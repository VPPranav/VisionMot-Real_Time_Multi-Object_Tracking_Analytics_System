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
        self.running = False
        self.frame_queue = deque(maxlen=5) # Reduced maxlen to avoid latency
        self.mjpeg_queue = deque(maxlen=5)
        
        self.thread = None
        self.fps = 0.0
        self.frame_idx = 0
        
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
        
        while self.running:
            if not self.cap.isOpened():
                # Try to reconnect
                # ...
                time.sleep(1)
                continue
                
            ret, frame = self.cap.read()
            if not ret:
                break
                
            self.frame_idx += 1
            if self.frame_idx % self.config.frame_skip != 0:
                continue
                
            # Perform Tracking
            tracks = self.tracker.update(frame, self.config)
            
            # Analytics
            self.counter.update(tracks, self.config.zones)
            alerts = self.anomaly_detector.update(tracks, self.config.zones)
            if alerts:
                self.alerts_queue.extend(alerts)
                
            agg_stats = self.stats_aggregator.aggregate(tracks)
            
            # Compute FPS
            curr_time = time.time()
            self.fps = 1.0 / (curr_time - prev_time + 1e-6)
            prev_time = curr_time
            
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
                "fps": self.fps,
                "frame_idx": self.frame_idx,
                "active_tracks": agg_stats["active_tracks"],
                "class_counts": agg_stats["class_counts"],
                "cumulative_classes": cumulative_classes,
                "crossing_counts": total_counts,
                "density_score": agg_stats["density_score"],
                "zone_stats": [], # Optional zone stats
                "velocity_avg": agg_stats["velocity_avg"]
            }
            
            # Annotate
            annotated_frame = Annotator.draw(
                frame.copy(), 
                tracks, 
                self.config.zones, 
                self.fps, 
                len([t for t in tracks if t.state == "Confirmed"])
            )
            
            # Encode for MJPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
            if ret:
                self.mjpeg_queue.append(buffer.tobytes())
                
    def get_latest_frame(self):
        if len(self.mjpeg_queue) > 0:
            return self.mjpeg_queue[-1]
        return None
