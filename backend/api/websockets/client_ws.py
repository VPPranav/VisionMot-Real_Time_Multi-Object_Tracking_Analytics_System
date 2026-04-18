from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.stream_manager import stream_manager
import logging
import asyncio

router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/ws/client-stream/{camera_id}")
async def client_video_ws(websocket: WebSocket, camera_id: str):
    await websocket.accept()

    # Wait up to 10 seconds for the pipeline to be registered.
    # This handles the race condition where the frontend connects right after
    # clicking Start but before the backend has started the pipeline.
    pipeline = None
    for _ in range(20):  # 20 × 0.5 s = 10 s max wait
        pipeline = stream_manager.get_pipeline(camera_id)
        if pipeline and pipeline.is_client:
            break
        await asyncio.sleep(0.5)

    if not pipeline or not pipeline.is_client:
        logger.warning(f"[client_ws] No client pipeline found for {camera_id}, closing WS.")
        await websocket.close(code=1008)
        return

    import base64
    import numpy as np
    import cv2
    import time
    from datetime import datetime, timezone
    from core.annotator import Annotator

    _last_frame_time = time.time()
    logger.info(f"[client_ws] Client connected for camera {camera_id}")

    try:
        while True:
            try:
                data = await websocket.receive_text()
                if not data:
                    continue

                # Strip data-URL prefix (data:image/jpeg;base64,<data>)
                if "," in data:
                    data = data.split(",", 1)[1]

                try:
                    img_bytes = base64.b64decode(data)
                    nparr = np.frombuffer(img_bytes, np.uint8)
                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                except Exception as decode_err:
                    logger.warning(f"[client_ws] Frame decode error: {decode_err}")
                    continue

                if frame is None:
                    continue

                curr_time = time.time()
                elapsed = curr_time - _last_frame_time
                _last_frame_time = curr_time
                fps = 1.0 / (elapsed + 1e-6)

                # Resize for faster inference
                h, w = frame.shape[:2]
                if w > 640:
                    scale = 640.0 / w
                    frame = cv2.resize(frame, (640, int(h * scale)), interpolation=cv2.INTER_LINEAR)

                # --- Run tracking pipeline ---
                tracks = pipeline.tracker.update(frame, pipeline.config)
                pipeline.counter.update(tracks, pipeline.config.zones)
                alerts = pipeline.anomaly_detector.update(tracks, pipeline.config.zones)
                if alerts:
                    pipeline.alerts_queue.extend(alerts)
                agg_stats = pipeline.stats_aggregator.aggregate(tracks)
                pipeline.fps = fps

                # Cumulative class tracking
                cumulative_classes: dict = {}
                for t in pipeline.tracker.tracks.values():
                    if t.state in ("Confirmed", "Lost"):
                        cumulative_classes[t.class_name] = cumulative_classes.get(t.class_name, 0) + 1

                total_counts = {
                    "IN": {"vehicle": 0, "pedestrian": 0},
                    "OUT": {"vehicle": 0, "pedestrian": 0},
                }
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
                    "velocity_avg": agg_stats["velocity_avg"],
                }

                # Draw annotations
                annotated_frame = Annotator.draw(
                    frame,
                    tracks,
                    pipeline.config.zones,
                    fps,
                    len([t for t in tracks if t.state == "Confirmed"]),
                )

                # Encode and send back annotated frame
                ret, buffer = cv2.imencode(
                    ".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 65]
                )
                if ret:
                    b64_str = base64.b64encode(buffer).decode("utf-8")
                    await websocket.send_text(f"data:image/jpeg;base64,{b64_str}")

            except WebSocketDisconnect:
                break
            except RuntimeError as re:
                # WebSocket already closed
                logger.warning(f"[client_ws] RuntimeError (WS likely closed): {re}")
                break
            except Exception as inner_e:
                logger.error(f"[client_ws] Error processing frame for {camera_id}: {inner_e}")
                continue

    except WebSocketDisconnect:
        logger.info(f"[client_ws] Client disconnected: {camera_id}")
    except Exception as e:
        logger.error(f"[client_ws] Fatal WebSocket error for {camera_id}: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
        logger.info(f"[client_ws] Connection closed for {camera_id}")