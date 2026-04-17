import numpy as np
import cv2
from ultralytics import YOLO
from models.schemas import CameraConfig, Detection, BBox

class Detector:
    def __init__(self, model_size: str = "n"):
        self.model_name = f"yolov8{model_size}.pt"
        self.model = YOLO(self.model_name)
    
    def detect(self, frame: np.ndarray, config: CameraConfig) -> list[Detection]:
        results = self.model(
            frame, 
            conf=config.confidence_threshold, 
            iou=config.iou_threshold, 
            classes=config.classes, 
            verbose=False
        )
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = box.conf[0].item()
                cls_id = int(box.cls[0].item())
                cls_name = self.model.names[cls_id]
                
                detections.append(Detection(
                    bbox=[x1, y1, x2, y2],
                    confidence=conf,
                    class_id=cls_id,
                    class_name=cls_name
                ))
        return detections

    def get_model_names(self):
        return self.model.names
