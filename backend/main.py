import os
import pathlib
import sys

# Monkey-patch ultralytics config dir before any other imports
project_root = pathlib.Path(__file__).parent.absolute()
ultralytics_dir = project_root / ".ultralytics"
ultralytics_dir.mkdir(parents=True, exist_ok=True)

os.environ["ULTRALYTICS_CONFIG_DIR"] = str(ultralytics_dir)
os.environ["YOLO_CONFIG_DIR"] = str(ultralytics_dir)
os.environ["APPDATA"] = str(project_root)
os.environ["USERPROFILE"] = str(project_root)
os.environ["HOME"] = str(project_root)
os.environ["TMPDIR"] = str(project_root / "tmp")
os.environ["TEMP"] = str(project_root / "tmp")
os.environ["TMP"] = str(project_root / "tmp")

(project_root / "tmp").mkdir(parents=True, exist_ok=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from api.routes import cameras, analytics, alerts
from api.websockets import analytics_ws, client_ws
from core.stream_manager import stream_manager
from config import config_manager
import asyncio

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    for cam in config_manager.get_all_cameras():
        stream_manager.start_camera(cam)
    yield
    # shutdown
    for cam_id in list(stream_manager.pipelines.keys()):
        stream_manager.stop_camera(cam_id)

app = FastAPI(title="Real-Time MOT System", lifespan=lifespan)

# ---------------------------------------------------------------------------
# CORS — allow the Vercel frontend (http & https) and localhost dev.
# WebSocket upgrades share the same origin check so listing https:// covers wss://.
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    # Local development
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    # Production Vercel frontend
    "https://visionmot-realtime-object-tracking.vercel.app",
    # Allow any Vercel preview deployments  (optional, harmless)
    "https://visionmot-realtime-object-tracking-git-main-vppranavs-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://visionmot.*\.vercel\.app",  # covers all preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cameras.router)
app.include_router(analytics.router)
app.include_router(alerts.router)
app.include_router(analytics_ws.router)
app.include_router(client_ws.router)


async def frame_generator(camera_id: str):
    while True:
        pipeline = stream_manager.get_pipeline(camera_id)
        if pipeline:
            frame = pipeline.get_latest_frame()
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                await asyncio.sleep(0.01)
            else:
                await asyncio.sleep(0.02)
        else:
            await asyncio.sleep(1)


@app.get("/stream/{camera_id}")
async def video_stream(camera_id: str):
    return StreamingResponse(
        frame_generator(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            # Required so browsers don't buffer the MJPEG stream
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering on Render
        }
    )


@app.get("/health")
async def health():
    """Simple health-check endpoint — used by Render to keep service alive."""
    return {"status": "ok", "pipelines": len(stream_manager.pipelines)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")