<div align="center">
  <img src="./frontend/public/logo.png" alt="VisionMOT Logo" width="160" />
</div>

<h1 align="center">VisionMOT: Real-Time Multi-Object Tracking & Analytics Ecosystem</h1>

<div align="center">
  <h3>Intelligent Surveillance | Geofencing & Crossing Metrics | Zero-Latency Anomaly Detection</h3>
  <p>A flagship Computer Vision application explicitly engineered for scalable monitoring, traffic estimation, and smart-city data structuring.</p>
</div>

<hr/>

## 📖 Table of Contents
1. [Overview & Philosophy](#-overview--philosophy)
2. [Core Product Features](#-core-product-features)
3. [Deep-Dive System Architecture](#-deep-dive-system-architecture)
4. [Computer Vision & Tracking Engine](#-computer-vision--tracking-engine)
5. [Frontend Dashboard Breakdown](#-frontend-dashboard-breakdown)
6. [Comprehensive Setup Guide (Local & Docker)](#-comprehensive-setup-guide)
7. [API & WebSocket Integrations](#-api--websocket-integrations)
8. [License & Developer Information](#-license--developer-information)

---

## 🔬 Overview & Philosophy

**VisionMOT** (Vision Multi-Object Tracking) is not just a standard tracking hook; it is an aggressively optimized, production-level intelligence platform. Modern systems require more than just bounding boxes on a screen—they require temporal tracking, spatial mapping, statistical generation, and instant localized alerts.

This platform operates by ingesting live dynamic video streams (via webcam, local media, or RTSP feeds), utilizing heavyweight deep learning models to structure the pixel data into classified identities, and tracing those identities over chronological intervals using highly adaptive heuristic logic. 

Every vehicle, pedestrian, or defined class entity mapped by VisionMOT is pushed instantly through an asynchronous tracking thread—ensuring zero interface blocking while computing geographic anomaly events seamlessly via websockets.

---

## 🌟 Core Product Features

* **High-Fidelity Tracking Pipeline**: Achieves consistent multi-object verification in highly dense domains by matching YOLO classification vectors with ByteTrack tracking pipelines.
* **Instantaneous Anomaly Polling**: Out-of-the-box algorithmic detection designed specifically for:
  * **Zone-Based High Density**: Automatically alerts users if a pre-drawn geographic zone surpasses critical object thresholds.
  * **Wrong-Way Driving/Movement Locomotion**: Understands velocity vectors to establish "flow paths", firing Critical alerts if an entity violates traffic pathing direction.
  * **Suspicious Loitering Detection**: Monitors elapsed frame tracking time to trigger flags when entities remain stagnant inside secured boundaries natively.
* **Dual-Websocket Data Structuring**: Employs rapid `asyncio` WebSocket configurations pushing structural counts at `2Hz` directly to the client without REST polling delays.
* **Smooth Glassmorphism UI**: Built over React 18 & Tailwind CSS. Navigational panels, camera streams, and trend data are visualized on frosted translucent components that emphasize user clarity via deep indigo gradients.
* **Cumulative Data Exporting**: VisionMOT's UI dynamically constructs its local histories. The platform provides localized client-side mechanisms to generate and push `system_analytics_export.csv` directly into your browser seamlessly.

---

## 🏛️ Deep-Dive System Architecture

VisionMOT segregates operational computation gracefully between an asynchronous bridging API and a dynamic user-side rendering app.

### 1. The Backend (Python, FastAPI, OpenCV) 🐍
The backend orchestrates the heaviest load sizes in the network natively without dropping frames.
* **FastAPI Mount Layer**: Serves scalable REST APIs and mounts raw hardware stream arrays locally to a server structure. 
* **Stream Manager Engine**: When a camera config is posted (such as starting a local webcam), the backend invokes an independent `Threading.Thread` operating inside a pure `deque` pipeline. This heavily reduces I/O choke and bounds the GPU utilization effectively while MJPEG frames are sequentially decoded.
* **State Management (`StatsAggregator`)**: Maintains active object mapping natively under an active dictionary set, pruning out dead objects efficiently relying on tracking heuristics.

### 2. The Frontend (React, Vite, Zustand, Tailwind) ⚛️
* **Zustand State Store**: Utilized for its completely unopinionated and incredibly fast data-flow logic to instantly fetch and spread WebSocket packets into components without generic React context re-renders. 
* **Recharts Implementation**: Feeds raw historical JSON arrays dynamically into high-framerate line & pie SVGs that adapt actively as new counts run chronologically.

---

## 👁️ Computer Vision & Tracking Engine

### **YOLOv8 Classifiers (`yolov8s.pt`)**
VisionMOT utilizes Ultralytics' baseline small-scale models to balance processing capacity against resolution depth. This system recognizes humans, vehicles, bicycles, and heavier truck profiles out of the box dynamically via PyTorch arrays. 

### **ByteTrack Heuristics Integration**
A major flaw in lightweight MOTs is ID-Switching (where one car crossing behind another suddenly becomes a new car). VisionMOT incorporates **ByteTrack (`lapx` processing)** natively. This tracks bounding box overlap chronologically using linear assignment processors (`lapx`). It natively verifies high-confidence targets, whilst maintaining memory of low-confidence targets in cases of graphical occlusion.

---

## 🖥️ Frontend Dashboard Breakdown

VisionMOT's localized network includes extensively mapped pages prioritizing intelligence delivery:

- **1. Dashboard**: View live matrices of your running visual feeds. Hit **Start Feed** / **Stop Feed** directly on the active elements to manipulate the API threads cleanly. 
- **2. Camera Detailed Analytics**: Need to measure a specific highway flow? Click any feed to pull an exact Line Chart graphing `Active Vehicles over the Last 60s`, mapping incoming and outgoing data alongside cumulative tracked pedestrian and vehicle identities.
- **3. System Alerts Log**: Logs every configured threshold breach (Loitering, Density, Speedings) marked with tracking IDs, specific class definitions, timestamps, and dismissible functionality natively bound directly from the `AlertStore`.
- **4. Global Analytics**: Pulls a macroscopic pie-chart visualization covering the system's class distribution layout globally and includes historical metrics export formats (`CSV`).
- **5. Configuration Base**: Boot into this section to cleanly generate brand new Camera Feed identifiers directly into the `cameras.json` API store. 

---

## 🚀 Comprehensive Setup Guide

### 📦 Prerequisites
- **Python >= 3.10**
- **Node.js >= 18.0**
- *(Optional but Recommended)* Docker Desktop & Docker Compose.
- *(For High Performance)* NATIVE NVIDIA GPU with strictly configured CUDA toolkit processing binaries.

### Setup Route 1: Local Docker Containerization 🐳 
This prevents dependency overlaps natively and isolates the entire setup out of Windows configurations onto a Linux subsystem node matrix.

1. Verify Docker daemon is actively running.
2. In the root directory, simply execute:
   ```bash
   docker compose up --build
   ```
*(Docker will compile `Uvicorn` backends and output Vite to Port `5173`. Make sure ports `8000` & `5173` are explicitly free).*

### Setup Route 2: Active Developer Mounting (Direct Setup) 💻

**1. Initialize the FastAPI/Vision Backend:**
It is highly recommended to isolate this configuration in a local environment to protect generalized binaries.
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # (For Windows) 
# source venv/bin/activate (For Linux/MacOS)

pip install -r requirements.txt
python main.py
```
*Note: Depending on your hardware, consider installing `torch` alongside explicitly configured CUDA arguments directly via PyTorch's website to activate Graphical Hardware tracking acceleration natively if you see excessive CPU delays!*

**2. Initialize the React UI:**
```bash
cd frontend
npm install
npm run dev
```

Your system is now online. Open: `http://localhost:5173`

---

## ⚙️ API & WebSocket Integrations

If you plan to scale the tracker externally onto mobile applications or third-party web apps, VisionMOT employs standard protocol designs dynamically. 

- **WebSocket (`ws://localhost:8000/ws/analytics`)**: Instantly pipes raw `JSON` string arrays containing aggregate data classes, live velocity updates, tracking ID strings, and object volume densities. 
- **REST Endpoints (`GET /cameras`, `POST /cameras/<id>/start`)**: Designed for manipulating specific stream endpoints safely through Pydantic verified models.

---

## ⚖️ License & Developer Information

**VisionMOT** is a proprietary multi-object tracking solution and is engineered, mapped, designed, and completely maintained by **Pranav V P**. 

- **Developer Contact:** [pranavvp1507@gmail.com](mailto:pranavvp1507@gmail.com)
- **Copyright Statement:** Proprietary Software © 2026. All rights secured natively by the aforementioned developer layout. 

*VisionMOT leverages Ultralytics standard configurations under applicable Open Source licensing dependencies in standard builds.*
