from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import asyncio
import logging
from core.stream_manager import stream_manager
from api.routes.alerts import global_alerts

router = APIRouter()
logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.debug(f"[analytics_ws] New connection. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.debug(f"[analytics_ws] Disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        dead: List[WebSocket] = []
        for conn in self.active_connections:
            try:
                await conn.send_text(message)
            except Exception:
                dead.append(conn)
        for d in dead:
            self.disconnect(d)


analytics_manager = ConnectionManager()
alerts_manager = ConnectionManager()


@router.websocket("/ws/analytics/{camera_id}")
async def websocket_analytics(websocket: WebSocket, camera_id: str):
    await analytics_manager.connect(websocket)
    try:
        while True:
            pipeline = stream_manager.get_pipeline(camera_id)
            if pipeline and pipeline.latest_analytics:
                try:
                    await websocket.send_json(pipeline.latest_analytics)
                except Exception as e:
                    logger.warning(f"[analytics_ws] Send error for {camera_id}: {e}")
                    break
            await asyncio.sleep(0.5)  # 2 Hz
    except WebSocketDisconnect:
        pass
    finally:
        analytics_manager.disconnect(websocket)


@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    await alerts_manager.connect(websocket)
    try:
        while True:
            new_alerts = []
            for cam_id, pipeline in list(stream_manager.pipelines.items()):
                if pipeline.alerts_queue:
                    alerts_to_push = pipeline.alerts_queue[:]
                    pipeline.alerts_queue.clear()
                    new_alerts.extend(alerts_to_push)

            for alert in new_alerts:
                global_alerts.append(alert)
                try:
                    await websocket.send_json(alert.model_dump())
                except Exception as e:
                    logger.warning(f"[analytics_ws] Alert send error: {e}")
                    break

            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        pass
    finally:
        alerts_manager.disconnect(websocket)