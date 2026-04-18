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

    # Start the pipeline if it isn't running
    if not pipeline.running:
        pipeline.start()
        
    try:
        while True:
            # We expect a base64 encoded jpeg string or raw bytes.
            # Easiest is raw bytes to avoid base64 overhead
            data = await websocket.receive_bytes()
            pipeline.push_client_frame(data)
            
            # The client will fetch the streaming result via the normal /stream/ endpoint
            # or we can send frames back. But /stream uses multi-part HTTP stream which is fine.
            # To minimize delay, the client stream endpoint only receives.
            
    except WebSocketDisconnect:
        # We don't automatically stop pipeline, user stops via Dashboard
        pass
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
