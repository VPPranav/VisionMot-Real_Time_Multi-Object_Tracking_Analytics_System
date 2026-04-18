from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.stream_manager import stream_manager
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/client-stream/{camera_id}")
async def client_video_ws(websocket: WebSocket, camera_id: str):
    await websocket.accept()
    
    pipeline = stream_manager.get_pipeline(camera_id)
    if not pipeline or not pipeline.is_client:
        await websocket.close()
        return

    import base64
    import numpy as np
    import cv2
    import time
    from datetime import datetime, timezone
    from core.annotator import Annotator
    
    _last_frame_time = time.time()
    
    try:
        while True:
            # We expect a base64 string
            data = await websocket.receive_text()
            if "," in data:
                data = data.split(",")[1]
            
            nparr = np.frombuffer(base64.b64decode(data), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                continue

            curr_time = time.time()
            elapsed = curr_time - _last_frame_time
            _last_frame_time = curr_time
            fps = 1.0 / (elapsed + 1e-6)

            # --- Resize for faster inference ---
            h, w = frame.shape[:2]
            if w > 640:
                scale = 640.0 / w
                frame = cv2.resize(frame, (640, int(h * scale)), interpolation=cv2.INTER_LINEAR)

            # Process Tracking
            tracks = pipeline.tracker.update(frame, pipeline.config)
            pipeline.counter.update(tracks, pipeline.config.zones)
            alerts = pipeline.anomaly_detector.update(tracks, pipeline.config.zones)
            if alerts:
                pipeline.alerts_queue.extend(alerts)
            agg_stats = pipeline.stats_aggregator.aggregate(tracks)
            pipeline.fps = fps

            # Cumulative tracking logic
            cumulative_classes = {}
            for t in pipeline.tracker.tracks.values():
                if t.state in ("Confirmed", "Lost"):
                    cumulative_classes[t.class_name] = cumulative_classes.get(t.class_name, 0) + 1

            total_counts = {"IN": {"vehicle": 0, "pedestrian": 0}, "OUT": {"vehicle": 0, "pedestrian": 0}}
            for zone_counts in pipeline.counter.counts.values():
                for d in ["IN", "OUT"]:
                    for c in ["vehicle", "pedestrian"]:
                        total_counts[d][c] += zone_counts[d][c]

            pipeline.frame_idx += 1
            pipeline.latest_analytics = {
                "type": "analytics",
                "camera_id": pipeline.config.camera_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "fps": round(fps, 1),
                "frame_idx": pipeline.frame_idx,
                "active_tracks": agg_stats["active_tracks"],
                "class_counts": agg_stats["class_counts"],
                "cumulative_classes": cumulative_classes,
                "crossing_counts": total_counts,
                "density_score": agg_stats["density_score"],
                "zone_stats": [],
                "velocity_avg": agg_stats["velocity_avg"]
            }

            annotated_frame = Annotator.draw(
                frame,
                tracks,
                pipeline.config.zones,
                fps,
                len([t for t in tracks if t.state == "Confirmed"])
            )

            # Return image to client over WS
            ret, buffer = cv2.imencode('.jpg', annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 65])
            if ret:
                b64_str = base64.b64encode(buffer).decode('utf-8')
                await websocket.send_text(f"data:image/jpeg;base64,{b64_str}")
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
