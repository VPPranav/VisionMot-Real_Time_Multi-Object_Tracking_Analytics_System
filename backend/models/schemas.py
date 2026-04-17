from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Tuple, Any

class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class Detection(BaseModel):
    bbox: List[float] # [x1, y1, x2, y2]
    confidence: float
    class_id: int
    class_name: str

class Track(BaseModel):
    track_id: int
    bbox: List[float]
    class_id: int
    class_name: str
    confidence: float
    centroid: List[float] # [x, y]
    velocity_vector: List[float] # [vx, vy]
    state: str # "Tentative", "Confirmed", "Lost", "Deleted"
    age: int
    history: List[List[float]] = [] # list of centroids

class Zone(BaseModel):
    id: str
    name: str
    type: str # "counting_line", "density_zone", "flow_zone", "loiter_zone"
    points: List[List[float]] # polygon or line segment [[x, y], ...]
    threshold: Optional[float] = None
    direction: Optional[str] = None # For counting lines

class CameraConfig(BaseModel):
    camera_id: str
    name: str
    source: str # "0", "path/to/video.mp4", "rtsp://..."
    model_size: str = "n" # n, s, m, l
    confidence_threshold: float = 0.4
    iou_threshold: float = 0.45
    frame_skip: int = 1
    classes: List[int] = [0, 2, 3, 5, 7]
    zones: List[Zone] = []

class Alert(BaseModel):
    alert_id: str
    camera_id: str
    timestamp: str
    severity: str # "CRITICAL", "WARNING", "INFO"
    alert_type: str # "WRONG_WAY", "CROWD_DENSITY", "LOITERING", "SUDDEN_STOP"
    track_id: Optional[int] = None
    class_id: Optional[int] = None
    class_name: Optional[str] = None
    zone_id: Optional[str] = None
    description: str
    bbox: Optional[List[float]] = None
    dismissed: bool = False
