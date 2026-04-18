import cv2
import time
import threading
import queue
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
        self.latest_analytics: dict = {}
        self.alerts_queue: list = []

        source = str(config.source)
        self.is_client = (source == "client")

        if not self.is_client:
            if source.isdigit():
                source = int(source)
            self.cap = cv2.VideoCapture(source)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        else:
            self.cap = None
            # maxsize=2 so the WS handler can always drop in a frame without blocking
            self.client_frame_queue: queue.Queue = queue.Queue(maxsize=2)

        self.running = False
        # maxlen=1 so consumers always get the newest frame
        self.frame_queue: deque = deque(maxlen=1)
        self.mjpeg_queue: deque = deque(maxlen=1)

        self.thread: threading.Thread | None = None
        self.fps: float = 0.0
        self.frame_idx: int = 0
        self._last_frame_time: float = 0.0

    # ------------------------------------------------------------------
    # Client-stream helpers
    # ------------------------------------------------------------------

    def push_client_frame(self, frame_bytes: bytes) -> None:
        """Push a raw JPEG frame from the client WebSocket into the queue."""
        if not self.is_client or not self.running:
            return
        import numpy as np
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is not None:
            # Drop old frame if queue is full to keep latency low
            if self.client_frame_queue.full():
                try:
                    self.client_frame_queue.get_nowait()
                except queue.Empty:
                    pass
            try:
                self.client_frame_queue.put_nowait(frame)
            except queue.Full:
                pass

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def start(self) -> None:
        self.running = True
        self.thread = threading.Thread(target=self._process_loop, daemon=True)
        self.thread.start()

    def stop(self) -> None:
        self.running = False
        if self.thread:
            self.thread.join(timeout=2.0)
        if self.cap:
            self.cap.release()

    # ------------------------------------------------------------------
    # Main processing loop (runs in a background thread)
    # ------------------------------------------------------------------

    def _process_loop(self) -> None:
        # For client cameras the processing is done in client_ws.py per-frame;
        # the pipeline thread is only used for RTSP / file / local-webcam sources.
        # If this is a client camera, just idle until stopped.
        if self.is_client:
            while self.running:
                time.sleep(0.5)
            return

        INFERENCE_INTERVAL = 1.0 / 20.0  # Cap at 20 FPS for non-client sources

        while self.running:
            if not self.cap or not self.cap.isOpened():
                time.sleep(1)
                continue

            # Grab the newest frame from the OS buffer
            ret = self.cap.grab()
            if not ret:
                # Loop video / file when it ends
                if isinstance(self.config.source, str) and not str(self.config.source).isdigit():
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret = self.cap.grab()
                if not ret:
                    time.sleep(0.1)
                    continue

            ret, frame = self.cap.retrieve()
            if not ret or frame is None:
                continue

            curr_time = time.time()
            elapsed = curr_time - self._last_frame_time

            if elapsed < INFERENCE_INTERVAL:
                continue

            self._last_frame_time = curr_time
            self.frame_idx += 1

            # Resize for inference speed
            h, w = frame.shape[:2]
            if w > 640:
                scale = 640.0 / w
                frame = cv2.resize(frame, (640, int(h * scale)), interpolation=cv2.INTER_LINEAR)

            # Tracking
            tracks = self.tracker.update(frame, self.config)

            # Analytics
            self.counter.update(tracks, self.config.zones)
            alerts = self.anomaly_detector.update(tracks, self.config.zones)
            if alerts:
                self.alerts_queue.extend(alerts)

            agg_stats = self.stats_aggregator.aggregate(tracks)
            self.fps = 1.0 / (elapsed + 1e-6)

            cumulative_classes: dict = {}
            for t in self.tracker.tracks.values():
                if t.state in ("Confirmed", "Lost"):
                    cumulative_classes[t.class_name] = cumulative_classes.get(t.class_name, 0) + 1

            total_counts = {
                "IN": {"vehicle": 0, "pedestrian": 0},
                "OUT": {"vehicle": 0, "pedestrian": 0},
            }
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
                "velocity_avg": agg_stats["velocity_avg"],
            }

            annotated_frame = Annotator.draw(
                frame,
                tracks,
                self.config.zones,
                self.fps,
                len([t for t in tracks if t.state == "Confirmed"]),
            )

            ret, buffer = cv2.imencode(
                ".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70]
            )
            if ret:
                self.mjpeg_queue.append(buffer.tobytes())

    # ------------------------------------------------------------------

    def get_latest_frame(self) -> bytes | None:
        if self.mjpeg_queue:
            return self.mjpeg_queue[-1]
        return None