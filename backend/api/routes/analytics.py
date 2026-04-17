from fastapi import APIRouter
from core.stream_manager import stream_manager
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/{camera_id}/history")
def get_analytics_history(camera_id: str, window: str = "60s"):
    pipeline = stream_manager.get_pipeline(camera_id)
    if not pipeline:
        return []
        
    try:
        # Simple window parsing (e.g. "60s", "5m")
        if window.endswith('s'):
            seconds = int(window[:-1])
        elif window.endswith('m'):
            seconds = int(window[:-1]) * 60
        else:
            seconds = 60
    except ValueError:
        seconds = 60
        
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=seconds)
    
    history = list(pipeline.stats_aggregator.history)
    filtered_history = [
        s for s in history 
        if datetime.fromisoformat(s["timestamp"]) > cutoff
    ]
    return filtered_history

@router.get("/summary")
def get_analytics_summary():
    summary = {
        "total_cameras": len(stream_manager.pipelines),
        "total_tracks": 0,
        "class_counts": {},
        "active_alerts": 0
    }
    
    for cam_id, pipeline in stream_manager.pipelines.items():
        if pipeline.latest_analytics:
            summary["total_tracks"] += pipeline.latest_analytics.get("active_tracks", 0)
            for cls, count in pipeline.latest_analytics.get("class_counts", {}).items():
                summary["class_counts"][cls] = summary["class_counts"].get(cls, 0) + count
                
    return summary

@router.post("/{camera_id}/reset-counts")
def reset_counts(camera_id: str):
    pipeline = stream_manager.get_pipeline(camera_id)
    if pipeline:
        pipeline.counter.counts = {}
        return {"status": "success"}
    return {"status": "not_found"}
