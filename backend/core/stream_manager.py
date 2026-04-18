from typing import Dict, Optional
from core.pipeline import CameraPipeline
from models.schemas import CameraConfig


class StreamManager:
    def __init__(self):
        self.pipelines: Dict[str, CameraPipeline] = {}

    def start_camera(self, config: CameraConfig) -> None:
        """Start (or restart) a camera pipeline."""
        if config.camera_id in self.pipelines:
            self.stop_camera(config.camera_id)

        pipeline = CameraPipeline(config)
        pipeline.start()
        self.pipelines[config.camera_id] = pipeline

    def stop_camera(self, camera_id: str) -> None:
        if camera_id in self.pipelines:
            self.pipelines[camera_id].stop()
            del self.pipelines[camera_id]

    def get_pipeline(self, camera_id: str) -> Optional[CameraPipeline]:
        return self.pipelines.get(camera_id)

    def is_running(self, camera_id: str) -> bool:
        """Return True if a pipeline exists AND its thread is alive."""
        pipeline = self.pipelines.get(camera_id)
        if pipeline is None:
            return False
        if pipeline.thread is not None:
            return pipeline.thread.is_alive()
        # Client pipelines don't have a meaningful thread but are "running" if registered
        return pipeline.running

    def update_config(self, camera_id: str, new_config: CameraConfig) -> None:
        self.start_camera(new_config)


stream_manager = StreamManager()