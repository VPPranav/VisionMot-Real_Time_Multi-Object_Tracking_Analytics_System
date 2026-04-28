<div align="center">
  <img src="./frontend/public/logo.png" alt="VisionMOT Logo" width="160" />
</div>

<h1 align="center">VisionMOT: Real-Time Multi-Object Tracking & Analytics Ecosystem</h1>

<div align="center">
  <h3>Intelligent Surveillance · Geofencing & Crossing Metrics · Zero-Latency Anomaly Detection</h3>
  <p>A flagship Computer Vision application explicitly engineered for scalable monitoring, traffic estimation, and smart-city data structuring.</p>
</div>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FF6600?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

</div>

### Dashboard View
![Dashboard](images/1.png)

### Live Monitoring
![Live Monitoring](images/2.png)

<hr/>

## 📖 Table of Contents

1. [Overview & Philosophy](#-overview--philosophy)
2. [Live Demo](#-live-demo)
3. [Core Product Features](#-core-product-features)
4. [Project Directory Structure](#-project-directory-structure)
5. [Deep-Dive System Architecture](#-deep-dive-system-architecture)
6. [Computer Vision & Tracking Engine](#-computer-vision--tracking-engine)
7. [Frontend Dashboard Breakdown](#-frontend-dashboard-breakdown)
8. [API & WebSocket Reference](#-api--websocket-reference)
9. [Comprehensive Setup Guide](#-comprehensive-setup-guide)
10. [Deployment Instructions (Render & Vercel)](#-deployment-instructions)
11. [Environment Variables](#-environment-variables)
12. [Configuration Reference](#-configuration-reference)
13. [Troubleshooting](#-troubleshooting)
14. [License & Developer Information](#-license--developer-information)

---

## 🔬 Overview & Philosophy

**VisionMOT** (Vision Multi-Object Tracking) is an aggressively optimized, production-level intelligence platform. Modern surveillance systems require more than just bounding boxes on a screen — they require temporal tracking, spatial mapping, statistical generation, and instant localized alerts.

This platform operates by ingesting live dynamic video streams (via browser webcam, local device camera, RTSP feeds, or pre-recorded video files), utilizing deep learning models to structure the pixel data into classified identities, and tracing those identities over chronological intervals using highly adaptive heuristic logic.

Every vehicle, pedestrian, or defined class entity mapped by VisionMOT is pushed instantly through an asynchronous tracking thread — ensuring zero interface blocking while computing geographic anomaly events seamlessly via WebSockets.

**Key Design Principles:**
- **Real-time first**: Every pipeline decision is made to minimize latency — frame queues with `maxlen=1`, 20 FPS inference caps, async WebSocket broadcasting.
- **Deployment ready**: Works on Render (free tier) + Vercel with browser-side webcam streaming — no server GPU required.
- **Modular architecture**: Backend and frontend are fully decoupled. The API can be consumed by any external client.
- **Zero polling**: All live data (analytics, alerts) is pushed via WebSocket — no REST polling loops.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://visionmot-realtime-object-tracking.vercel.app |
| **Backend API (Render)** | https://visionmot-real-time-multi-object.onrender.com |
| **API Swagger Docs** | https://visionmot-real-time-multi-object.onrender.com/docs |
| **Health Check** | https://visionmot-real-time-multi-object.onrender.com/health |

> ⚠️ The Render free tier sleeps after 15 minutes of inactivity. The first request after sleep may take 30–60 seconds to respond. Use the **Browser Webcam** source — it streams from your device so no server-side camera hardware is required.

---

### Analytics
![Analytics](images/3.png)

### Alerts System
![Alerts](images/4.png)

## 🌟 Core Product Features

### 🎯 Tracking & Detection
- **High-Fidelity Multi-Object Tracking**: Consistent multi-object verification in high-density domains by matching YOLO classification vectors with ByteTrack pipelines.
- **Granular Object Categorization**: Natively categorizes humans, cars, trucks, buses, motorcycles, and bicycles out of the box (COCO class IDs: 0, 2, 3, 5, 7).
- **Configurable Confidence & IoU Thresholds**: Per-camera tuning of detection sensitivity and overlap suppression.
- **Inference FPS Cap**: Intelligently throttles inference to 20 FPS maximum to preserve CPU/GPU headroom across all pipelines simultaneously.

### 📡 Streaming
- **Browser Webcam Streaming (Client Mode)**: Captures webcam frames in-browser, sends them via WebSocket to the backend for YOLO inference, and receives back annotated frames — no server-side camera required.
- **MJPEG Stream Support**: For server-side cameras (local device, RTSP, video files), frames are encoded as MJPEG and streamed via `/stream/{camera_id}`.
- **RTSP / IP Camera Support**: Full RTSP URL support via OpenCV's VideoCapture backend.
- **Video File Looping**: Supports MP4, AVI, and other OpenCV-supported formats with automatic looping.

### 🚨 Anomaly Detection
- **Zone-Based High Density Alerts**: Automatically alerts when a pre-drawn geographic zone surpasses critical object thresholds.
- **Wrong-Way Movement Detection**: Analyzes velocity vectors to establish expected flow paths, firing Critical alerts if an entity violates traffic direction.
- **Suspicious Loitering Detection**: Monitors elapsed frame tracking time to trigger flags when entities remain stationary inside secured boundaries.

### 📊 Analytics & Data
- **Dual-WebSocket Architecture**: Analytics pushed at 2Hz and alerts pushed in near real-time via separate WebSocket connections.
- **Cumulative Object Counting**: Tracks unique object identities over the entire session — not just instantaneous counts.
- **Line Crossing Metrics**: IN/OUT crossing counts per zone for vehicles and pedestrians.
- **CSV Data Export**: Client-side generation and download of `system_analytics_export.csv` from the Analytics page.
- **Historical Charts**: Recharts-powered line, bar, and pie charts with time-series trend data.

### 🖥️ UI/UX
- **Glassmorphism Design System**: Frosted translucent components with deep indigo gradients and smooth animations.
- **Multi-Layout Dashboard**: Switch between single, 2-column, and 4-column grid views.
- **Responsive**: Fully functional on mobile, tablet, and desktop viewports.
- **Real-time FPS & Track Count Overlay**: Displayed on hover over each video feed.
- **Dismissible Alert Log**: Severity-filtered alert center with CRITICAL / WARNING / INFO categorization.

---

## 📁 Project Directory Structure

```
VisionMOT/                              # Repository root
│
├── backend/                            # Python FastAPI backend
│   ├── __pycache__/                    # Python bytecode cache
│   ├── .pytest_cache/                  # Pytest cache
│   ├── .ultralytics/                   # Ultralytics model config (auto-generated)
│   │
│   ├── analytics/                      # Analytics computation modules
│   │   ├── anomaly_detector.py         # Wrong-way, loitering, density alert logic
│   │   ├── counter.py                  # LineCounter — zone IN/OUT crossing counts
│   │   └── stats_aggregator.py         # Active tracks, class counts, velocity aggregation
│   │
│   ├── api/                            # FastAPI route & WebSocket handlers
│   │   ├── routes/
│   │   │   ├── cameras.py              # GET/POST/DELETE /cameras endpoints
│   │   │   ├── analytics.py            # GET /analytics/{camera_id} history endpoint
│   │   │   └── alerts.py               # GET /alerts endpoint + global_alerts store
│   │   └── websockets/
│   │       ├── analytics_ws.py         # WS /ws/analytics/{camera_id} — 2Hz analytics push
│   │       └── client_ws.py            # WS /ws/client-stream/{camera_id} — browser webcam
│   │
│   ├── config/                         # Configuration management
│   │   ├── __init__.py
│   │   └── cameras.json                # Persisted camera configurations (JSON file store)
│   │
│   ├── core/                           # Core tracking infrastructure
│   │   ├── annotator.py                # Frame annotation — draws bounding boxes, IDs, zones
│   │   ├── pipeline.py                 # CameraPipeline — per-camera processing thread
│   │   ├── stream_manager.py           # StreamManager — manages all active pipelines
│   │   └── tracker.py                  # YOLOv8 + ByteTrack wrapper
│   │
│   ├── models/                         # Pydantic data models
│   │   └── schemas.py                  # CameraConfig, TrackResult, AlertEvent, etc.
│   │
│   ├── tests/                          # Pytest test suite
│   │
│   ├── tmp/                            # Temporary files (ultralytics cache, etc.)
│   ├── venv/                           # Python virtual environment (not committed)
│   │
│   ├── config.py                       # ConfigManager — reads/writes cameras.json
│   ├── Dockerfile.backend              # Docker build for backend service
│   ├── main.py                         # FastAPI app entry point — routes, CORS, lifespan
│   ├── requirements.txt                # Python dependencies
│   ├── yolov8n.pt                      # YOLOv8 Nano weights (fast, lower accuracy)
│   └── yolov8s.pt                      # YOLOv8 Small weights (balanced)
│
├── frontend/                           # React + Vite + TypeScript frontend
│   ├── dist/                           # Production build output (generated by npm run build)
│   ├── node_modules/                   # NPM dependencies (not committed)
│   ├── public/
│   │   └── logo.png                    # VisionMOT logo asset
│   │
│   ├── .env                            # Local env vars (VITE_API_URL — NOT committed)
│   ├── .gitignore
│   ├── Dockerfile.frontend             # Docker build for frontend (nginx)
│   ├── index.html                      # Vite HTML template
│   ├── package.json                    # NPM dependencies & scripts
│   ├── package-lock.json
│   ├── postcss.config.js               # PostCSS config for Tailwind
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript compiler options
│   ├── vite.config.ts                  # Vite bundler configuration
│   └── src/
│       ├── assets/                     # Static assets (images, icons)
│       │
│       ├── components/                 # Reusable UI components
│       │   ├── alerts/                 # Alert notification components
│       │   ├── layout/                 # Sidebar, TopBar, AppShell layout wrappers
│       │   └── video/
│       │       └── VideoFeed.tsx       # Core video feed component (MJPEG + client WS)
│       │
│       ├── hooks/                      # Custom React hooks
│       │   ├── useAnalyticsWS.ts       # WebSocket hook — subscribes to analytics stream
│       │   ├── useAnalyticsHistory.ts  # Fetches historical analytics data for charts
│       │   └── useCameraConfig.ts      # React Query hook — camera CRUD operations
│       │
│       ├── lib/                        # Utility libraries
│       │
│       ├── pages/                      # Top-level route pages
│       │   ├── About.tsx               # About page — project info
│       │   ├── AlertsLog.tsx           # Alert center — filterable live alert log
│       │   ├── Analytics.tsx           # System-wide analytics charts & export
│       │   ├── Auth.tsx                # Login / authentication page
│       │   ├── CameraDetail.tsx        # Per-camera detail — feed + analytics tabs
│       │   ├── Configuration.tsx       # Camera management — add/delete camera sources
│       │   ├── Dashboard.tsx           # Main dashboard — live feeds grid
│       │   └── Home.tsx                # Landing / home page
│       │
│       ├── store/                      # Zustand global state stores
│       │   ├── analyticsStore.ts       # Stores latest analytics per camera_id
│       │   ├── alertStore.ts           # Stores alert events, dismiss state
│       │   ├── authStore.ts            # Auth state (user, token)
│       │   └── cameraStore.ts          # Camera list state
│       │
│       ├── utils/                      # Helper utilities
│       │
│       ├── App.tsx                     # Root component — router, layout
│       ├── counter.ts                  # Utility counter
│       ├── index.css                   # Global base styles
│       ├── main.ts                     # Vite entry — env validation
│       ├── main.tsx                    # React DOM render entry
│       └── style.css                   # Additional global styles
│
│
├── config/                             # Root-level shared config (if any)
├── images/                             # Documentation images / screenshots
├── .gitignore                          # Root gitignore
└── README.md                           # This file
```

---

### Live Counts
![Live Counts](images/5.png)

## 🏛️ Deep-Dive System Architecture

VisionMOT segregates operational computation between an asynchronous FastAPI backend and a React rendering frontend, connected via REST and WebSocket protocols.

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Vercel)                         │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  VideoFeed   │    │  Analytics   │    │   AlertsLog      │  │
│  │  Component   │    │  Charts      │    │   Component      │  │
│  └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘  │
│         │                   │                      │            │
│  ┌──────▼───────────────────▼──────────────────────▼─────────┐ │
│  │              Zustand State Stores                          │ │
│  │  analyticsStore │ alertStore │ cameraStore │ authStore     │ │
│  └──────┬───────────────────┬──────────────────────┬─────────┘ │
│         │                   │                      │            │
│    WebSocket           WebSocket              REST fetch        │
│  /ws/client-stream   /ws/analytics/{id}    /cameras, /stream   │
└─────────┼───────────────────┼──────────────────────┼───────────┘
          │                   │                      │
          │         NETWORK (HTTPS / WSS)            │
          │                   │                      │
┌─────────▼───────────────────▼──────────────────────▼───────────┐
│                     BACKEND (Render)                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  FastAPI (main.py)                      │   │
│  │   CORS · Lifespan · MJPEG /stream · /health             │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │                   Stream Manager                        │   │
│  │   pipelines: Dict[camera_id → CameraPipeline]           │   │
│  └───────┬───────────────────────────────────┬─────────────┘   │
│          │                                   │                  │
│  ┌───────▼──────────┐             ┌──────────▼──────────────┐  │
│  │  CameraPipeline  │             │  client_ws.py           │  │
│  │  (Thread)        │             │  (WebSocket handler)    │  │
│  │                  │             │                         │  │
│  │  VideoCapture    │             │  Receives base64 frames │  │
│  │  ↓               │             │  Runs YOLO + ByteTrack  │  │
│  │  YOLOv8 Tracker  │             │  Returns annotated JPEG │  │
│  │  ↓               │             └─────────────────────────┘  │
│  │  ByteTrack       │                                           │
│  │  ↓               │                                           │
│  │  Annotator.draw  │                                           │
│  │  ↓               │                                           │
│  │  mjpeg_queue[1]  │                                           │
│  └──────────────────┘                                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  analytics_ws.py — 2Hz WebSocket broadcaster            │   │
│  │  alerts_ws — 10Hz alert poller & broadcaster            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Deep Dive (Python, FastAPI, OpenCV)

#### `main.py` — Application Entry Point
- Registers all routers (cameras, analytics, alerts, WebSockets).
- Configures CORS to allow the Vercel frontend origin.
- Implements `lifespan` context manager: starts all saved cameras on startup, stops all on shutdown.
- Exposes `GET /stream/{camera_id}` — a `StreamingResponse` with `multipart/x-mixed-replace` MIME type for MJPEG delivery.
- Exposes `GET /health` — used to keep Render from sleeping and for health monitoring.

#### `core/pipeline.py` — CameraPipeline
Each camera gets its own `CameraPipeline` instance running in a background `threading.Thread`:

- **For RTSP/file/local cameras**: Continuously grabs frames via `cv2.VideoCapture`, runs YOLO inference, updates ByteTrack, draws annotations, and stores the JPEG-encoded result in a `deque(maxlen=1)` — ensuring consumers always get the most recent frame, never a stale one.
- **For browser webcam (client mode)**: The pipeline thread simply idles. All processing is handled in `client_ws.py` — frames arrive over WebSocket, are processed synchronously, and the annotated result is sent back immediately.
- **FPS throttling**: A `INFERENCE_INTERVAL = 1/20` cap prevents overloading the CPU. Frames are grabbed from the OS buffer continuously (to drain stale frames) but inference only runs when the interval has elapsed.
- **Video looping**: For file sources, automatically seeks to frame 0 when the video ends.

#### `api/websockets/client_ws.py` — Browser Webcam WebSocket
- Accepts connections at `/ws/client-stream/{camera_id}`.
- Waits up to 10 seconds (polling every 500ms) for the pipeline to be registered — handles the race condition when the frontend connects right after clicking "Start".
- Receives base64-encoded JPEG frames from the browser.
- Strips the `data:image/jpeg;base64,` prefix, decodes, and runs the full YOLO + ByteTrack pipeline inline.
- Returns the annotated frame as a base64 data URL string back to the browser.

#### `api/websockets/analytics_ws.py` — Analytics Broadcaster
- `/ws/analytics/{camera_id}`: Polls `pipeline.latest_analytics` every 500ms (2Hz) and pushes JSON to the client.
- `/ws/alerts`: Polls all pipeline `alerts_queue` lists every 100ms and broadcasts new alerts.

#### `config/cameras.json` — Persistent Camera Store
Cameras are persisted as JSON to disk. On startup, all cameras in this file are automatically started. **Important for Render deployment**: this file must be committed to GitHub with at least one default camera configuration, as Render's filesystem resets on restart.

### Frontend Deep Dive (React 18, Vite, Zustand, Tailwind CSS)

#### State Management (Zustand)
Four lightweight stores handle all application state:
- **`analyticsStore`**: Keyed by `camera_id`. Updated by `useAnalyticsWS` hook which maintains a persistent WebSocket connection.
- **`alertStore`**: Accumulates alerts from the alerts WebSocket. Supports `dismissAlert` and `clearAlerts`.
- **`cameraStore`**: Camera list fetched once on mount via React Query, then kept in sync.
- **`authStore`**: Simple auth state (username, token) for the login gate.

#### `VideoFeed.tsx` — Core Streaming Component
The most complex component — handles both MJPEG and browser webcam modes:

**MJPEG mode** (server-side cameras):
- Renders an `<img>` tag pointing to `/stream/{camera_id}`.
- The browser natively handles MJPEG multipart streaming.
- `onError` triggers an offline state when the stream drops.

**Client mode** (browser webcam):
- Requests `getUserMedia` for webcam access.
- Captures frames at 10 FPS via a `setInterval` drawing to a hidden `<canvas>`.
- Sends frames as base64 strings over a `WebSocket` to `/ws/client-stream/{camera_id}`.
- Receives annotated frames back and sets them as the `src` of the displayed `<img>`.
- Auto-reconnects every 3 seconds if the WebSocket closes unexpectedly.
- Shows a spinner while connecting, and a permission-denied error if `getUserMedia` fails.

---

## 👁️ Computer Vision & Tracking Engine

### YOLOv8 Object Detection

VisionMOT uses [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) for object detection. Two model sizes are supported:

| Model | File | Speed | Accuracy | Best For |
|-------|------|-------|----------|----------|
| YOLOv8n (Nano) | `yolov8n.pt` | Fastest | Lower | Render free tier, CPU-only |
| YOLOv8s (Small) | `yolov8s.pt` | Balanced | Higher | Local GPU, paid hosting |

**Detected classes (COCO IDs):**

| Class ID | Object |
|----------|--------|
| 0 | Person |
| 2 | Car |
| 3 | Motorcycle |
| 5 | Bus |
| 7 | Truck |

Classes are configurable per-camera via the `classes` array in the camera configuration.

### ByteTrack Multi-Object Tracking

A major flaw in lightweight MOTs is **ID-switching** — when one car crosses behind another, naive trackers assign a new identity to the same object. VisionMOT integrates **ByteTrack** via `lapx` (Linear Assignment Processing):

- **High-confidence detections**: Directly matched to existing tracks using IoU-based linear assignment.
- **Low-confidence detections**: Kept in a secondary buffer — used to re-associate occluded objects when they reappear, preventing ID-switch.
- **Track states**: `Tentative` → `Confirmed` → `Lost` — only `Confirmed` tracks are counted and displayed.
- **Cumulative identity tracking**: Every object that was ever `Confirmed` or `Lost` is counted in the session total, giving a true unique object count over time.

### Anomaly Detection (`analytics/anomaly_detector.py`)

Three alert types are generated automatically:

| Alert Type | Severity | Trigger |
|------------|----------|---------|
| `HIGH_DENSITY` | CRITICAL | Object count in zone exceeds threshold |
| `WRONG_WAY` | CRITICAL | Object velocity vector opposes expected flow direction |
| `LOITERING` | WARNING | Object stationary within zone beyond time threshold |

Alerts include: `camera_id`, `timestamp`, `track_id`, `class_name`, `description`, and `severity`.

---

## 🖥️ Frontend Dashboard Breakdown

### 1. Dashboard (`/dashboard`)
The main control center for all camera feeds.

- Displays all configured cameras as video feed cards in a configurable grid (1, 2, or 4 columns).
- Each card has **Start** / **Stop** buttons that call the backend `/cameras/{id}/start` and `/cameras/{id}/stop` endpoints.
- The **Start** button is disabled while the feed is running; **Stop** is disabled while idle — preventing double-click race conditions.
- The feed shows a loading spinner while the WebSocket connects, and an offline graphic if the MJPEG stream drops.
- Hovering over a feed reveals the camera name, live FPS, and active track count.
- Badge shows **LIVE** (green pulse) when running, **IDLE** (grey) when stopped.

### 2. Camera Detail (`/camera/{id}`)
Deep-dive analytics for a specific camera.

- Shows the live video feed with independent Start/Stop controls.
- **Live Counts tab**: Line chart of vehicle and pedestrian counts over the last 5 minutes.
- **Total Unique Objects**: Cumulative vehicle and pedestrian cards updated in real-time.
- **Track History tab**: Under construction — will show per-track trajectories.
- **Density Map tab**: Under construction — will show heatmap overlay.

### 3. Analytics (`/analytics`)
System-wide aggregated analytics across all cameras.

- **Quick Stat Pills**: Total objects, total vehicles, total pedestrians — updated live.
- **Class Distribution Pie Chart**: Breakdown of detected object types across all feeds.
- **Total Tracked Bar Chart**: Cumulative vehicles vs pedestrians side by side.
- **Activity Trend Line Chart**: Active track count and average velocity over time for the first camera.
- **Export CSV**: Downloads `system_analytics_export.csv` with time, active tracks, and velocity columns.

### 4. Alerts Log (`/alerts`)
Real-time alert center.

- **Severity Filters**: Filter by ALL / CRITICAL / WARNING / INFO with live counts per category.
- **Alert Cards**: Show severity badge, alert type, timestamp, camera ID, class name, and track ID.
- **Dismiss**: Individual alert dismissal with a green checkmark confirmation.
- **Clear All**: Wipes the entire alert log.
- CRITICAL alerts have a red left-border highlight for immediate visual attention.

### 5. Configuration (`/configuration`)
Camera source management.

- **Add Camera panel**: Dropdown to select source type (Browser Webcam, Local Cam, RTSP, Video File).
- For RTSP and file sources, a URL/path input appears dynamically.
- **Delete**: Removes camera via `DELETE /cameras/{id}` API call.
- Displays each camera's model size, confidence threshold, and class count.
- Shows a Render deployment tip explaining the ephemeral filesystem limitation.

---

## ⚙️ API & WebSocket Reference

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns `{"status": "ok", "pipelines": N}` |
| `GET` | `/cameras` | List all configured cameras |
| `POST` | `/cameras` | Add a new camera configuration |
| `DELETE` | `/cameras/{camera_id}` | Remove a camera configuration |
| `POST` | `/cameras/{camera_id}/start` | Start the processing pipeline for a camera |
| `POST` | `/cameras/{camera_id}/stop` | Stop the processing pipeline for a camera |
| `GET` | `/stream/{camera_id}` | MJPEG video stream (multipart/x-mixed-replace) |
| `GET` | `/analytics/{camera_id}` | Latest analytics snapshot for a camera |
| `GET` | `/alerts` | List of all alert events |

Full interactive API docs: `https://<your-backend>/docs`

### WebSocket Endpoints

| Path | Direction | Rate | Payload |
|------|-----------|------|---------|
| `/ws/analytics/{camera_id}` | Server → Client | 2 Hz | Analytics JSON (tracks, FPS, counts, density) |
| `/ws/alerts` | Server → Client | ~10 Hz | Alert event JSON (type, severity, description) |
| `/ws/client-stream/{camera_id}` | Bidirectional | 10 FPS | Client sends base64 JPEG; server replies with annotated base64 JPEG |

### Analytics WebSocket Payload Schema

```json
{
  "type": "analytics",
  "camera_id": "cam_webcam_01",
  "timestamp": "2026-04-19T10:30:00.000Z",
  "fps": 18.4,
  "frame_idx": 1234,
  "active_tracks": 5,
  "class_counts": { "person": 3, "car": 2 },
  "cumulative_classes": { "person": 12, "car": 7, "truck": 1 },
  "crossing_counts": {
    "IN": { "vehicle": 4, "pedestrian": 8 },
    "OUT": { "vehicle": 3, "pedestrian": 6 }
  },
  "density_score": 0.42,
  "zone_stats": [],
  "velocity_avg": 2.1
}
```

### Camera Configuration Schema

```json
{
  "camera_id": "cam_webcam_01",
  "name": "Webcam (Browser)",
  "source": "client",
  "model_size": "n",
  "confidence_threshold": 0.45,
  "iou_threshold": 0.45,
  "frame_skip": 1,
  "classes": [0, 2, 3, 5, 7],
  "zones": []
}
```

**Source values:**
- `"client"` — browser webcam (streamed from the user's device)
- `"0"` — server-side local camera index 0
- `"rtsp://user:pass@192.168.1.x:554/stream"` — RTSP IP camera
- `"/path/to/video.mp4"` — pre-recorded video file

---

## 🚀 Comprehensive Setup Guide

### 📦 Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | >= 3.10 | 3.11 recommended |
| Node.js | >= 18.0 | 20 LTS recommended |
| npm | >= 9.0 | Comes with Node.js |
| Docker (optional) | Latest | For containerized setup |
| NVIDIA GPU (optional) | CUDA 11.8+ | For hardware-accelerated inference |

---

### Setup Route 1: Docker Compose (Recommended for Quick Start) 🐳

This route prevents dependency conflicts and isolates the entire stack onto a Linux subsystem.

**Prerequisites:** Docker Desktop must be running.

```bash
# Clone the repository
git clone https://github.com/VPPranav/VisionMot-Real_Time_M.git
cd VisionMot-Real_Time_M

# Build and start all services
docker compose up --build
```

Docker will:
1. Build the FastAPI backend container (Uvicorn on port `8000`)
2. Build the React frontend container (Nginx serving Vite build on port `5173`)

Open your browser: `http://localhost:5173`

> Make sure ports `8000` and `5173` are free before running.

To stop:
```bash
docker compose down
```

---

### Setup Route 2: Manual Local Development 💻

#### Step 1: Clone the Repository

```bash
git clone https://github.com/VPPranav/VisionMot-Real_Time_M.git
cd VisionMot-Real_Time_M
```

#### Step 2: Set Up the Backend

```bash
cd backend

# Create and activate a virtual environment (strongly recommended)
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> **GPU Acceleration (Optional):** If you have an NVIDIA GPU, install PyTorch with CUDA support first:
> ```bash
> pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
> pip install -r requirements.txt
> ```
> Visit [pytorch.org](https://pytorch.org/get-started/locally/) to find the right CUDA version for your system.

> **CPU-only deployment (Render / no GPU):** Install the lighter CPU-only PyTorch to save ~1.5GB:
> ```bash
> pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
> pip install -r requirements.txt
> ```

Start the backend:
```bash
python main.py
```

The backend is now running at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the Swagger UI.

#### Step 3: Set Up the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # or create .env manually:
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

Open your browser: `http://localhost:5173`

#### Step 4: Add Your First Camera

1. Navigate to **Configuration** in the sidebar.
2. Click **Add Camera**.
3. Select **Browser Webcam (client)** as the source type.
4. Give it a name (e.g., "My Webcam").
5. Click **Save Camera**.
6. Go to **Dashboard** and click **Start** on the camera card.
7. Grant camera permission when the browser prompts.
8. The feed should appear with bounding boxes within a few seconds.

---

## 🌐 Deployment Instructions

### Part 1: Deploy Backend on Render 🔵

#### Step 1: Create a Render Account
Go to [render.com](https://render.com) and sign in or create an account.

#### Step 2: Create a New Web Service
- Click **New → Web Service**
- Connect your GitHub repository
- Select `backend` as the **Root Directory**

#### Step 3: Configure the Service

| Setting | Value |
|---------|-------|
| **Environment** | Python 3 |
| **Root Directory** | `backend` |
| **Build Command** | `pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port 10000` |
| **Instance Type** | Free (or Standard for better performance) |

> **Why the custom build command?** The default `pip install -r requirements.txt` installs full CUDA PyTorch (~2GB), which causes Render free tier builds to time out. The custom command installs CPU-only PyTorch (~300MB) first, then the rest of the requirements.

#### Step 4: Add Environment Variable (Optional)
If your app uses any secrets, add them under **Environment → Environment Variables**.

#### Step 5: Deploy
Click **Deploy Web Service**. Your backend URL will be:
`https://your-service-name.onrender.com`

Test it: `https://your-service-name.onrender.com/health` should return `{"status":"ok"}`.

#### Step 6: Commit cameras.json
To prevent cameras from disappearing on Render restarts, commit a default `cameras.json` to your repo:

```json
[
  {
    "camera_id": "cam_webcam_01",
    "name": "Webcam (Browser)",
    "source": "client",
    "model_size": "n",
    "confidence_threshold": 0.45,
    "iou_threshold": 0.45,
    "frame_skip": 1,
    "classes": [0, 2, 3, 5, 7],
    "zones": []
  }
]
```

> **Render Free Tier Limitations:**
> - Service sleeps after **15 minutes of inactivity** — first request after sleep takes 30–60 seconds.
> - No persistent disk — `cameras.json` changes made at runtime are lost on restart.
> - Limited CPU — use `yolov8n` (Nano) model for best performance.
> - No GPU — CPU-only inference.
> - **Solution for all of the above:** Use **Browser Webcam** source. The browser sends frames to the server, so no server-side camera is needed, and the model is light enough for CPU inference.

---

### Part 2: Deploy Frontend on Vercel 🔵

#### Step 1: Build Locally First (Verify)

```bash
cd frontend
npm run build
```

Ensure the `dist/` directory is generated with no TypeScript errors.

#### Step 2: Create a Vercel Project
- Go to [vercel.com](https://vercel.com) and sign in.
- Click **Add New → Project**.
- Import your GitHub repository.

#### Step 3: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### Step 4: Add Environment Variable

Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-render-service.onrender.com` |

> Do **not** include a trailing slash. Do **not** use `http://` — it must be `https://` for `wss://` WebSocket connections to work correctly.

#### Step 5: Deploy
Click **Deploy**. Your frontend URL will be:
`https://your-project.vercel.app`

---

## 🔐 Environment Variables

### Frontend (`.env` in `frontend/`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000` | Full URL of the backend API (no trailing slash) |

The frontend derives the WebSocket URL automatically:
- `https://...` → `wss://...` (production)
- `http://...` → `ws://...` (local development)

### Backend

No `.env` file is required. All configuration is via `cameras.json` and Render environment variables if needed.

---

## ⚙️ Configuration Reference

### Camera Configuration Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `camera_id` | string | — | Unique identifier (e.g., `cam_001`) |
| `name` | string | — | Display name shown in UI |
| `source` | string | — | `"client"`, `"0"`, RTSP URL, or file path |
| `model_size` | `"n"` \| `"s"` | `"n"` | YOLOv8 model size (nano or small) |
| `confidence_threshold` | float | `0.45` | Minimum detection confidence (0.0–1.0) |
| `iou_threshold` | float | `0.45` | Non-max suppression IoU threshold |
| `frame_skip` | int | `1` | Process every Nth frame (1 = every frame) |
| `classes` | int[] | `[0,2,3,5,7]` | COCO class IDs to detect |
| `zones` | Zone[] | `[]` | Geographic zones for counting and alerts |

### Performance Tuning Tips

| Scenario | Recommendation |
|----------|---------------|
| Render free tier | `model_size: "n"`, `confidence_threshold: 0.45` |
| Local CPU (no GPU) | `model_size: "n"`, `frame_skip: 2` |
| Local GPU (CUDA) | `model_size: "s"`, `confidence_threshold: 0.35` |
| High object density | Lower `iou_threshold` to `0.35` |
| Reduce false positives | Raise `confidence_threshold` to `0.55–0.65` |

---

## 🔧 Troubleshooting

### "No cameras configured" on Dashboard (after Render restart)
**Cause:** Render's filesystem is ephemeral — camera configs saved at runtime are lost on restart.
**Fix:** Commit `cameras.json` with default cameras to your GitHub repository. Changes pushed to GitHub survive restarts.

### "Waiting for frame..." forever
**Cause 1:** `isRunning` was not passed to the VideoFeed component (fixed in latest version).
**Cause 2:** The WebSocket connection failed — check browser DevTools → Network → WS tab.
**Cause 3:** Render service is waking up from sleep — wait 30–60 seconds and try Start again.
**Fix:** Click Stop, wait 3 seconds, click Start again.

### Camera feed shows blank / black screen
**Cause:** Browser didn't grant camera permission, or the WebSocket reconnect cycle hasn't completed.
**Fix:** Check the browser address bar for a camera icon with a blocked indicator. Click it and allow access. Refresh the page.

### "Stream Offline" error on MJPEG feed
**Cause:** The backend pipeline isn't started for this camera, or the Render service is sleeping.
**Fix:** Click the **Start** button on the camera card. If on Render, wait 30–60 seconds for cold start.

### Build fails on Render (timeout during pip install)
**Cause:** Default `pip install torch` downloads the full CUDA PyTorch (~2GB).
**Fix:** Use this build command instead:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt
```

### WebSocket connects but analytics show 0.0 FPS
**Cause:** Pipeline is registered but inference hasn't started producing frames yet.
**Fix:** Wait a few seconds. If FPS stays at 0 for >10 seconds, check the Render logs for errors.

### CORS error in browser console
**Cause:** The backend's `ALLOWED_ORIGINS` doesn't include your Vercel URL.
**Fix:** Ensure `VITE_API_URL` in Vercel matches exactly what's in `main.py`'s `ALLOWED_ORIGINS` list. Redeploy the backend.

### `lapx` or `scipy` import error on startup
**Cause:** Missing dependency for ByteTrack's linear assignment.
**Fix:** Ensure `requirements.txt` includes `lapx>=0.5.5` and `scipy>=1.12.0`, then redeploy.

---

## 📊 Tech Stack Summary

### Backend
| Technology | Version | Role |
|------------|---------|------|
| Python | 3.10+ | Runtime |
| FastAPI | 0.110+ | REST API & WebSocket server |
| Uvicorn | 0.28+ | ASGI server |
| Ultralytics (YOLOv8) | 8.1+ | Object detection |
| OpenCV | 4.9+ | Frame capture, encoding, resizing |
| PyTorch | 2.2+ | Deep learning inference backend |
| ByteTrack (via lapx) | 0.5.5+ | Multi-object tracking |
| NumPy | 1.26+ | Numerical operations |
| SciPy | 1.12+ | Linear assignment for tracking |
| Pydantic | 2.6+ | Data validation & schemas |

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| React | 18 | UI framework |
| TypeScript | 5.0+ | Type safety |
| Vite | 5.0+ | Build tool & dev server |
| Tailwind CSS | 3.0+ | Utility-first styling |
| Zustand | Latest | Global state management |
| React Query | Latest | Server state & caching |
| Recharts | Latest | Data visualization charts |
| Lucide React | Latest | Icon library |
| date-fns | Latest | Date formatting |
| clsx | Latest | Conditional class names |

---

## ⚖️ License & Developer Information

**VisionMOT** is a proprietary multi-object tracking solution, engineered, designed, and maintained entirely by **Pranav V P**.

| | |
|---|---|
| **Developer** | Pranav V P |
| **Contact** | [pranavvp1507@gmail.com](mailto:pranavvp1507@gmail.com) |
| **Repository** | [github.com/VPPranav/VisionMot-Real_Time_M](https://github.com/VPPranav/VisionMot-Real_Time_M) |
| **Copyright** | © 2026 Pranav V P. All rights reserved. |
| **License** | Proprietary Software |

*VisionMOT leverages Ultralytics YOLOv8 under applicable open-source licensing. PyTorch, FastAPI, React, and all other third-party libraries retain their respective licenses.*

---

<div align="center">
  <p>Built with ❤️ by <strong>Pranav V P</strong></p>
  <p>
    <a href="mailto:pranavvp1507@gmail.com">pranavvp1507@gmail.com</a>
  </p>
</div>
