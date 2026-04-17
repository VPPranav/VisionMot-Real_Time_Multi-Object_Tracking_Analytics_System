<div align="center">
  <img src="./frontend/public/logo.png" alt="VisionMOT Logo" width="120" />
</div>

# VisionMOT - Real-Time Multi-Object Tracking System

## Overview
**VisionMOT** is a production-grade, highly optimized real-time multi-object tracking and analytics ecosystem. Engineered for intelligent surveillance, traffic flow analysis, and security anomaly detection. 

At its core, the project ingests live video streams (via webcam, RTSP, or local media), perfectly tracks multi-class entities like vehicles and pedestrians using **YOLOv8 + ByteTrack**, performs geographic telemetry via virtual tripwires, and flags anomalous events. The insights are broadcasted instantly via a dual-WebSocket link natively to an advanced, fully glassmorphic React/Vite dashboard.

---

## 🌟 Key Features
- **Intelligent Tracking System**: Utilizes state-of-the-art YOLOv8 object detection seamlessly bound to a high-speed ByteTrack logic to sustain ID confirmations seamlessly.
- **Microsecond Anomaly Detection**: Generates real-time events triggered by "High Zone Density", "Wrong Way Detection", and "Loitering". 
- **Premium User Interface**: Constructed using Tailwind CSS with beautiful `glassmorphism`, `backdrop-blur`, intuitive routing, and dynamic data visualization using Recharts.
- **Live Video Streaming Pipeline**: Encodes real-time annotated object tracking maps into a robust MJPEG loop accessible natively via the browser panel without dropping analytical tracking performance.
- **Actionable Analytics Engine**: Tracks active models, calculates aggregate FPS, computes mean velocity tensors, and outputs accurate historical crossing graphs directly compatible with CSV export.

---

## 🛠️ Tech Stack & Architecture

### Backend Stack
- **FastAPI**: Manages the API layout, websockets, and background streaming.
- **Python 3.10+**: Core engine logic format.
- **OpenCV**: Stream decoding and high-speed box annotation rendering.
- **Ultralytics (YOLOv8)**: Heavy-duty object classification and recognition.
- **PyTorch**: Sub-process logic tensor management.

### Frontend Stack
- **React 18 & Vite**: Lightning-fast web application build engine.
- **TypeScript**: Total module type safety matching backend schema logic.
- **Tailwind CSS & PostCSS**: Next-generation utility-based styling mapped around glassmorphism and deep gradients.
- **Recharts**: Beautiful charting grids natively mapping API responses.
- **Zustand**: Fast and unopinionated global state management.

---

## ⚙️ How to Run & Setup

### Option 1: Run via Docker (Recommended)
This approach binds the API and Web Client seamlessly inside configured node networks.

1. Install **Docker** and **Docker Compose**.
2. Navigate to the root directory where `docker-compose.yml` is located.
3. Start the build protocol:
   ```bash
   docker compose up --build
   ```
4. Access the web platform at `http://localhost:5173`.

### Option 2: Run Local Instances (For Development)

**Step 1: Start Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Or `source venv/bin/activate` on Linux
pip install -r requirements.txt
python main.py
```
*Backend will map aggressively to `http://localhost:8000`*

**Step 2: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```
*Frontend interface mounts correctly at `http://localhost:5173`*

---

## 🔗 Using the Application

1. **Dashboard Overview**: As you boot into the UI, you will find active video matrices rendering out MJPEG streams along with generic feed commands to start or pause individual camera scripts remotely.
2. **System Analytics**: Navigate to the Analytics tab to view total class distributions natively mapping Cars and Pedestrians in a visual grid over a defined period. Need data? Hit the "Export CSV" feature to immediately export trend velocities down to local formats!
3. **Camera Deep Dive**: Click on any running camera to manipulate specific metrics and view high-resolution event graphs for real-time traffic statistics.
4. **Settings/Configuration**: Boot into Configuration to generate new isolated asynchronous tracking threads! The system supports RTSP inputs locally.

---

## 🛡️ License & Development

**VisionMOT** is actively engineered, engineered, and maintained entirely by **Pranav V P**.

- **Email Details:** [pranavvp1507@gmail.com](mailto:pranavvp1507@gmail.com)
- **Copyright:** Proprietary © 2026

*If you are interested in extending this system, check out the source schema definitions and websocket layouts mapped inside the `/backend/api` directories.*
