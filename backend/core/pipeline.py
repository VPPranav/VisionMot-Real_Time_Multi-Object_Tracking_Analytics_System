import cv2
import time
import asyncio
import threading
from collections import deque
from core.tracker import Tracker
from core.annotator import Annotator
from analytics.counter import LineCounter
from analytics.anomaly_detector import AnomalyDetector
from analytics.stats_aggregator import StatsAggregator
from models.schemas import CameraConfig
from datetime import datetime, timezone

class CameraPipeline:
    def __init__(self, config: CameraConfig):
        self.config = config
        self.tracker = Tracker(config.model_size)
        self.counter = LineCounter()
        self.anomaly_detector = AnomalyDetector(config.camera_id)
        self.stats_aggregator = StatsAggregator()
        self.latest_analytics = {}
        self.alerts_queue = []
        
        # Determine source (int for webcam, str for rtsp/file)
        source = config.source
        if source.isdigit():
            source = int(source)
            
        self.cap = cv2.VideoCapture(source)
        # Reduce OpenCV internal buffer to 1 so we always read the newest frame
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        self.running = False
        # maxlen=1 so consumers always get the newest frame, never a stale one
        self.frame_queue = deque(maxlen=1)
        self.mjpeg_queue = deque(maxlen=1)
        
        self.thread = None
        self.fps = 0.0
        self.frame_idx = 0
        self._last_frame_time = 0.0
        
    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._process_loop, daemon=True)
        self.thread.start()
        
    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=2.0)
        self.cap.release()
        
    def _process_loop(self):
        prev_time = time.time()
        # Target: run inference at most at ~20 FPS to keep CPU/GPU headroom
        INFERENCE_INTERVAL = 1.0 / 20.0  # 20 FPS cap for inference
        
        while self.running:
            if not self.cap.isOpened():
                time.sleep(1)
                continue

            # Always grab the newest frame from the OS buffer
            ret = self.cap.grab()
            if not ret:
                time.sleep(0.01)
                continue

            curr_time = time.time()
            elapsed = curr_time - self._last_frame_time

            # Skip inference if we haven't waited long enough (frame rate limiter)
            if elapsed < INFERENCE_INTERVAL:
                continue

            ret, frame = self.cap.retrieve()
            if not ret:
                continue

            self._last_frame_time = curr_time
            self.frame_idx += 1

            # --- Resize for faster inference (YOLO runs on 640px anyway) ---
            h, w = frame.shape[:2]
            if w > 640:
                scale = 640.0 / w
                frame = cv2.resize(frame, (640, int(h * scale)), interpolation=cv2.INTER_LINEAR)

            # Perform Tracking
            tracks = self.tracker.update(frame, self.config)

            # Analytics
            self.counter.update(tracks, self.config.zones)
            alerts = self.anomaly_detector.update(tracks, self.config.zones)
            if alerts:
                self.alerts_queue.extend(alerts)

            agg_stats = self.stats_aggregator.aggregate(tracks)

            # Compute FPS
            self.fps = 1.0 / (elapsed + 1e-6)

            # Cumulative tracking logic
            cumulative_classes = {}
            for t in self.tracker.tracks.values():
                if t.state in ("Confirmed", "Lost"):
                    cumulative_classes[t.class_name] = cumulative_classes.get(t.class_name, 0) + 1

            # Combine into analytics payload
            total_counts = {"IN": {"vehicle": 0, "pedestrian": 0}, "OUT": {"vehicle": 0, "pedestrian": 0}}
            for zone_counts in self.counter.counts.values():
                for d in ["IN", "OUT"]:
                    for c in ["vehicle", "pedestrian"]:
                        total_counts[d][c] += zone_counts[d][c]

            self.latest_analytics = {
                "type": "analytics",
                "camera_id": self.config.camera_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "fps": round(self.fps, 1),
                "frame_idx": self.frame_idx,
                "active_tracks": agg_stats["active_tracks"],
                "class_counts": agg_stats["class_counts"],
                "cumulative_classes": cumulative_classes,
                "crossing_counts": total_counts,
                "density_score": agg_stats["density_score"],
                "zone_stats": [],
                "velocity_avg": agg_stats["velocity_avg"]
            }

            # Annotate the already-resized frame
            annotated_frame = Annotator.draw(
                frame,
                tracks,
                self.config.zones,
                self.fps,
                len([t for t in tracks if t.state == "Confirmed"])
            )

            # Encode at lower quality for faster streaming (70 is a sweet spot)
            ret, buffer = cv2.imencode(
                '.jpg', annotated_frame,
                [int(cv2.IMWRITE_JPEG_QUALITY), 70]
            )
            if ret:
                # maxlen=1 ensures the consumer always gets the newest frame
                self.mjpeg_queue.append(buffer.tobytes())

    def get_latest_frame(self):
        if self.mjpeg_queue:
            return self.mjpeg_queue[-1]
        return None
