from typing import Dict, Optional
from core.pipeline import CameraPipeline
from models.schemas import CameraConfig

class StreamManager:
    def __init__(self):
        self.pipelines: Dict[str, CameraPipeline] = {}
        
    def start_camera(self, config: CameraConfig):
        if config.camera_id in self.pipelines:
            self.stop_camera(config.camera_id)
            
        pipeline = CameraPipeline(config)
        pipeline.start()
        self.pipelines[config.camera_id] = pipeline
        
    def stop_camera(self, camera_id: str):
        if camera_id in self.pipelines:
            self.pipelines[camera_id].stop()
            del self.pipelines[camera_id]
            
    def get_pipeline(self, camera_id: str) -> Optional[CameraPipeline]:
        return self.pipelines.get(camera_id)
        
    def update_config(self, camera_id: str, new_config: CameraConfig):
        # Depending on what changed, we might need to restart or just update
        # For now, let's keep it simple: restart
        self.start_camera(new_config)

stream_manager = StreamManager()
