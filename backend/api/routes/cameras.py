from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from models.schemas import CameraConfig, Zone
from config import config_manager
from core.stream_manager import stream_manager

router = APIRouter(prefix="/cameras", tags=["cameras"])

@router.get("", response_model=List[CameraConfig])
def list_cameras():
    return config_manager.get_all_cameras()

@router.post("", response_model=CameraConfig)
def add_camera(config: CameraConfig):
    if config_manager.get_camera(config.camera_id):
        raise HTTPException(status_code=400, detail="Camera ID already exists")
        
    config_manager.add_camera(config)
    stream_manager.start_camera(config)
    return config

@router.delete("/{camera_id}")
def remove_camera(camera_id: str):
    if config_manager.remove_camera(camera_id):
        stream_manager.stop_camera(camera_id)
        return {"status": "removed"}
    raise HTTPException(status_code=404, detail="Camera not found")

@router.post("/{camera_id}/start")
def start_camera_stream(camera_id: str):
    cam = config_manager.get_camera(camera_id)
    if cam:
        stream_manager.start_camera(cam)
        return {"status": "started"}
    raise HTTPException(status_code=404, detail="Camera not found")

@router.post("/{camera_id}/stop")
def stop_camera_stream(camera_id: str):
    stream_manager.stop_camera(camera_id)
    return {"status": "stopped"}

@router.patch("/{camera_id}/config", response_model=CameraConfig)
def update_camera_config(camera_id: str, patch_data: dict):
    updated = config_manager.update_camera(camera_id, patch_data)
    if updated:
        stream_manager.update_config(camera_id, updated)
        return updated
    raise HTTPException(status_code=404, detail="Camera not found")

@router.get("/{camera_id}/zones", response_model=List[Zone])
def get_zones(camera_id: str):
    cam = config_manager.get_camera(camera_id)
    if cam:
        return cam.zones
    raise HTTPException(status_code=404, detail="Camera not found")

@router.post("/{camera_id}/zones", response_model=CameraConfig)
def set_zones(camera_id: str, zones: List[Zone]):
    updated = config_manager.update_camera(camera_id, {"zones": [z.model_dump() for z in zones]})
    if updated:
        stream_manager.update_config(camera_id, updated)
        return updated
    raise HTTPException(status_code=404, detail="Camera not found")
