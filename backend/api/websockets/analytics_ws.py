from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import asyncio
import json
from core.stream_manager import stream_manager
from api.routes.alerts import global_alerts

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

analytics_manager = ConnectionManager()
alerts_manager = ConnectionManager()

@router.websocket("/ws/analytics/{camera_id}")
async def websocket_analytics(websocket: WebSocket, camera_id: str):
    await analytics_manager.connect(websocket)
    try:
        while True:
            pipeline = stream_manager.get_pipeline(camera_id)
            if pipeline and pipeline.latest_analytics:
                await websocket.send_json(pipeline.latest_analytics)
            await asyncio.sleep(0.5) # 2Hz
    except WebSocketDisconnect:
        analytics_manager.disconnect(websocket)

@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    await alerts_manager.connect(websocket)
    try:
        while True:
            # Alerts are pushed as they happen, but since pipelines run in threads, 
            # we can poll pipelines for new alerts and broadcast them.
            new_alerts = []
            for cam_id, pipeline in stream_manager.pipelines.items():
                if pipeline.alerts_queue:
                    # Thread-safe pop ALL
                    alerts_to_push = pipeline.alerts_queue[:]
                    pipeline.alerts_queue.clear()
                    new_alerts.extend(alerts_to_push)
            
            for alert in new_alerts:
                global_alerts.append(alert)
                await websocket.send_json(alert.model_dump())
                    
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        alerts_manager.disconnect(websocket)
