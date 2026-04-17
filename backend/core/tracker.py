import numpy as np
import cv2
from ultralytics import YOLO
from typing import List, Dict
from models.schemas import CameraConfig, Track

class Tracker:
    def __init__(self, model_size: str = "n"):
        self.model_name = f"yolov8{model_size}.pt"
        self.model = YOLO(self.model_name)
        self.tracks: Dict[int, Track] = {}
        
    def update(self, frame: np.ndarray, config: CameraConfig) -> List[Track]:
        results = self.model.track(
            frame,
            persist=True,
            tracker="bytetrack.yaml",
            conf=config.confidence_threshold,
            iou=config.iou_threshold,
            classes=config.classes,
            verbose=False
        )
        
        current_frame_track_ids = set()
        active_tracks_list = []
        
        if len(results) > 0 and results[0].boxes is not None and results[0].boxes.id is not None:
            boxes = results[0].boxes
            for box, track_id_tensor in zip(boxes, boxes.id):
                track_id = int(track_id_tensor.item())
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls_id = int(box.cls[0].item())
                cls_name = self.model.names[cls_id]
                
                cx = (x1 + x2) / 2.0
                cy = (y1 + y2) / 2.0
                centroid = [cx, cy]
                
                if track_id not in self.tracks:
                    self.tracks[track_id] = Track(
                        track_id=track_id,
                        bbox=[x1, y1, x2, y2],
                        class_id=cls_id,
                        class_name=cls_name,
                        confidence=conf,
                        centroid=centroid,
                        velocity_vector=[0.0, 0.0],
                        state="Tentative",
                        age=1,
                        history=[centroid]
                    )
                else:
                    t = self.tracks[track_id]
                    t.bbox = [x1, y1, x2, y2]
                    t.confidence = conf
                    t.centroid = centroid
                    t.age += 1
                    t.history.append(centroid)
                    if len(t.history) > 30:
                        t.history.pop(0)
                        
                    if t.age >= 3:
                        t.state = "Confirmed"
                        
                    if len(t.history) >= 2:
                        hist_len = min(5, len(t.history))
                        oldest = t.history[-hist_len]
                        vx = centroid[0] - oldest[0]
                        vy = centroid[1] - oldest[1]
                        t.velocity_vector = [vx, vy]
                        
                current_frame_track_ids.add(track_id)
                active_tracks_list.append(self.tracks[track_id])
                
        # Handle lost/deleted tracks
        lost_track_ids = []
        for tid, t in self.tracks.items():
            if tid not in current_frame_track_ids:
                if t.state == "Confirmed":
                    t.state = "Lost"
                    active_tracks_list.append(t)
                elif t.state == "Lost":
                    # Remove after lost for a while if needed. Here we keep it simple.
                    # Or we just don't return it and let it naturally fade.
                    pass
                else:
                    lost_track_ids.append(tid)
                    
        return active_tracks_list
