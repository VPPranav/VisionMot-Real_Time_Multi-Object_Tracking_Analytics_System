import json
import os
from pydantic_settings import BaseSettings
from typing import List, Dict, Optional
from models.schemas import CameraConfig

class Settings(BaseSettings):
    camera_configs_path: str = "config/cameras.json"
    default_model_size: str = "n"
    default_confidence_threshold: float = 0.4
    default_iou_threshold: float = 0.45
    default_classes: List[int] = [0, 2, 3, 5, 7] # person, car, motorcycle, bus, truck

    class Config:
        env_file = ".env"

settings = Settings()

import threading
class ConfigManager:
    def __init__(self):
        self.config_path = settings.camera_configs_path
        self.lock = threading.Lock()
        self.cameras: Dict[str, CameraConfig] = {}
        self.load()

    def load(self):
        with self.lock:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r') as f:
                    try:
                        data = json.load(f)
                        for d in data:
                            cam = CameraConfig(**d)
                            self.cameras[cam.camera_id] = cam
                    except json.JSONDecodeError:
                        self.cameras = {}
            else:
                os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
                self.save_unlocked()

    def save_unlocked(self):
        with open(self.config_path, 'w') as f:
            json.dump([cam.model_dump() for cam in self.cameras.values()], f, indent=4)

    def save(self):
        with self.lock:
            self.save_unlocked()

    def get_camera(self, camera_id: str) -> Optional[CameraConfig]:
        return self.cameras.get(camera_id)

    def get_all_cameras(self) -> List[CameraConfig]:
        return list(self.cameras.values())
        
    def add_camera(self, config: CameraConfig):
        with self.lock:
            self.cameras[config.camera_id] = config
            self.save_unlocked()

    def update_camera(self, camera_id: str, patch_data: dict):
        with self.lock:
            if camera_id in self.cameras:
                cam_dict = self.cameras[camera_id].model_dump()
                cam_dict.update((k, v) for k, v in patch_data.items() if v is not None)
                self.cameras[camera_id] = CameraConfig(**cam_dict)
                self.save_unlocked()
                return self.cameras[camera_id]
            return None

    def remove_camera(self, camera_id: str):
        with self.lock:
            if camera_id in self.cameras:
                del self.cameras[camera_id]
                self.save_unlocked()
                return True
            return False

config_manager = ConfigManager()
