# 🛰️ AURIS: Autonomous Uncertainty-Aware Rescue Intelligence System
### Smart India Hackathon (SIH 2026) — Interactive 3D Drone Mission Planning & Tactical Rescue Web Application

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/@react--three/fiber-8.17-black?style=flat-square)](https://docs.pmnd.rs/react-three-fiber)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🎯 Overview

**AURIS (Autonomous Uncertainty-aware Rescue Intelligence System)** is a next-generation real-time 3D cyber-tactical mission planning and rescue intelligence application built for disaster response operations. Designed for urban search and rescue (USAR), AURIS operates on the core principle:

> **"Not detected ≠ not present"**  
> System Core Loop: `SENSE → VERIFY → DECIDE → REPLAN → TRANSMIT`

Instead of relying on pre-rendered 3D videos, AURIS renders a fully interactive 160m × 160m procedural disaster environment with realistic physics, lighting, and an industrial 6-motor hexacopter executing autonomous inspection patterns, multimodal sensor fusion, and verified incident dispatch to NDRF rescue teams.

---

## ✨ Key Features & Capabilities

### 1. 🌐 Realistic 3D Disaster Environment
- **160m × 160m Procedural Simulation Zone**: Collapsed concrete towers with exposed rebar, shattered slabs, rubble mounds, crushed sedans, and shipping containers.
- **Dynamic Hazards**:
  - Volumetric fire plumes with point-light flicker and ember particles.
  - Active high-voltage snapping electrical arcs.
  - Reflective floodwater channels with submerged roadway markings.
- **Trapped Survivor with Space Blanket**: Anatomical candidate trapped under concrete slabs emitting thermal signature.

### 2. 🚁 Industrial Hexacopter & Propulsion Kinematics
- **6-Motor Coaxial BLDC Hexacopter**: Counter-rotating carbon fiber propellers, antenna array, lidar dome, and status beacons.
- **Smooth Kinematics Engine**: S-curve velocity ramping, shortest-arc angular yaw interpolation, and smooth orbit inspection.
- **Flight Speed Modes**:
  - `SLOW / CLEAR (2.5 m/s)`: Ideal for close-quarters structural inspection.
  - `NORMAL (5.2 m/s)`: Standard transit speed.
  - `FAST (8.5 m/s)`: Emergency rapid repositioning.

### 3. 🎥 Multi-Camera Tactical Views
- **Gimbal FPV (First Person View)**: Electronic 2-axis stabilized camera tracking the drone's forward horizon with scanline overlay and HUD reticle.
- **Drone Follow Cam**: Cinematic 3rd-person chase camera.
- **Tactical Top-Down View (God-Eye)**: Orthographic operational map perspective for full-theater awareness.
- **Free Orbit Cam**: Full 360° pan, tilt, and zoom examination.

### 4. 🔬 Multimodal Edge Sensor Suite & Fusion Engine
- **RGB Optical Camera**: High-resolution daylight video detection.
- **MLX90640 32×24 Far-Infrared Thermal Array**: 37.1°C core body heatmap anomaly detection.
- **RPLIDAR 360° Laser Scanner**: Real-time laser point-cloud sweep visualizing structural clearance.
- **MEMS Acoustic Array**: Audio beamforming detecting acoustic distress cries (300 Hz – 3.4 kHz).
- **Evidence Fusion Engine**: Bayesian confidence escalation (`64%` → `91%`), preventing false negatives in obstructed rubble.

### 5. 🗺️ Mission Planner & Automated Pipeline
- **Dedicated 7-Step Autonomous Operations Center**:
  1. *Recon Grid Init* (High-altitude sweep)
  2. *Multimodal Anomaly Trigger* (Audio & thermal signal pick-up)
  3. *Uncertainty-Aware Decent* (Approach Sector G)
  4. *Next-Best-View (NBV) Active Perception* (Re-orient around blind spot)
  5. *Multi-Sensor Fusion Verification* (Confidence jumps to 91%)
  6. *Ground Extraction Corridor Alpha Mapping* (Obstacle clearance route)
  7. *Rescue Intelligence Incident Packet Dispatch* (Automatic NDRF squad alert)
- One-click end-to-end execution, phase scrubbing, and instant restart controls.

### 6. 🚨 Rescue Intelligence Packet (`SAR-2026-089A`)
- Instant structured incident telemetry transmission via SIYI HM30 datalink.
- Automated generation of GPS coordinates, hazard context, safe approach corridors, and team recommendations.

---

## 🕹️ Controls & Navigation

| Input | Action |
|---|---|
| **W / A / S / D** | Manual Drone Flight (Forward / Left / Backward / Right) |
| **R / F** | Ascend / Descend Altitude |
| **Sectors (A – H)** | Auto-navigate to Disaster Sector |
| **`[MISSION PLANNER]`** | Launch Autonomous 7-Step Rescue Pipeline |
| **Camera Switcher** | Toggle `FREE`, `FOLLOW`, `FPV`, `TACTICAL` |
| **Speed Mode** | Toggle `SLOW`, `NORMAL`, `FAST` |
| **Spacebar / ESC** | Close modals & return to HUD |

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/karthikeyantoff/3D_Visual_Drone_Mission_Planning-.git

# 2. Navigate to project directory
cd 3D_Visual_Drone_Mission_Planning-

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` (or the port specified in your terminal).

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture & Tech Stack

```
auris-3d/
├── src/
│   ├── components/
│   │   ├── 3d/                 # Three.js / R3F Disaster Scene & Drone
│   │   │   ├── Drone.tsx               # Hexacopter model & flight physics
│   │   │   ├── DisasterEnvironment.tsx # Master 3D scene assembler
│   │   │   ├── GroundTerrain.tsx       # Seismic fracture terrain & curbs
│   │   │   ├── Buildings.tsx           # Collapsed high-rises & rebar
│   │   │   ├── RubblePiles.tsx         # Concrete debris & steel I-beams
│   │   │   ├── FireAndSmoke.tsx        # Flame cones, smoke & glowing embers
│   │   │   ├── ElectricalHazard.tsx    # Snapped pole & cyan voltage sparks
│   │   │   ├── FloodZone.tsx           # Reflective floodwater
│   │   │   ├── SurvivorCandidate.tsx   # Trapped anatomical survivor
│   │   │   ├── Visualizations.tsx      # Lidar sweep, acoustic waves, corridors
│   │   │   └── CameraManager.tsx       # Gimbal FPV, Follow, God-eye cameras
│   │   └── ui/                 # Cyber-Tactical Watch Dogs HUD
│   │       ├── HUD.tsx                 # Master HUD layout
│   │       ├── TopBar.tsx              # Telemetry banner & edge AI TOPS
│   │       ├── SectorSelector.tsx      # Sector navigation & Mission Planner trigger
│   │       ├── SpeedSelector.tsx       # Slow/Clear, Normal, Fast speed toggles
│   │       ├── CameraSelector.tsx      # Camera switcher
│   │       ├── SensorPanel.tsx         # 4-channel live sensor feed
│   │       ├── EvidenceFusionPanel.tsx # Fused confidence gauge (64% -> 91%)
│   │       ├── MissionPlannerModal.tsx # 7-step autonomous operations center
│   │       └── IncidentModal.tsx       # NDRF Incident Packet dispatch card
│   ├── state/
│   │   └── aurisStore.ts       # Central Zustand state management
│   ├── data/
│   │   ├── disasterScenario.ts # Sector coordinates & hazard zones
│   │   └── missionWorkflow.ts  # 7-step pipeline definitions
│   └── types/                  # TypeScript interfaces (Drone, Sensors, Incident)
```

---

## 🛡️ License

Built for **Smart India Hackathon (SIH 2026)**.  
Developed by **Karthikeyan T** and Team.
