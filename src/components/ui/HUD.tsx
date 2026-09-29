import React from 'react';
import { TopBar } from './TopBar';
import { TelemetryPanel } from './TelemetryPanel';
import { SensorPanel } from './SensorPanel';
import { EvidenceFusionPanel } from './EvidenceFusionPanel';
import { MissionLogPanel } from './MissionLogPanel';
import { CameraSelector } from './CameraSelector';
import { SpeedSelector } from './SpeedSelector';
import { MissionControls } from './MissionControls';
import { SectorSelector } from './SectorSelector';
import { IncidentModal } from './IncidentModal';
import { MissionPlannerModal } from './MissionPlannerModal';

export const HUD: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 scanlines select-none overflow-hidden">
      {/* 1. TOP COMMAND BAR & NAVIGATION STRIP */}
      <div className="pointer-events-auto space-y-2">
        <TopBar />
        <div className="flex flex-wrap justify-between items-center gap-2">
          <SectorSelector />
          <div className="flex items-center gap-2">
            <SpeedSelector />
            <CameraSelector />
          </div>
        </div>
      </div>

      {/* 2. CENTER TACTICAL RETICLE */}
      <div className="flex-1 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-20 h-20 border border-cyan-400/40 rounded-full flex items-center justify-center relative">
          <div className="w-1.5 h-1.5 bg-auris-cyan rounded-full" />
          <div className="absolute top-0 w-0.5 h-2 bg-cyan-400/60" />
          <div className="absolute bottom-0 w-0.5 h-2 bg-cyan-400/60" />
          <div className="absolute left-0 h-0.5 w-2 bg-cyan-400/60" />
          <div className="absolute right-0 h-0.5 w-2 bg-cyan-400/60" />
        </div>
      </div>

      {/* 3. BOTTOM COCKPIT & OPERATIONS DECK */}
      <div className="pointer-events-auto space-y-3">
        {/* Main Flanks Container */}
        <div className="flex items-end justify-between gap-3 w-full">
          {/* Left Flank: Sensing Suite + Drone Telemetry */}
          <div className="flex items-end gap-3 shrink-0">
            <SensorPanel />
            <TelemetryPanel />
          </div>

          {/* Center Dock: Mission Action Controls */}
          <div className="hidden lg:flex flex-col items-center justify-end pb-1">
            <MissionControls />
          </div>

          {/* Right Flank: Rescue Intelligence Log + Evidence Fusion Engine */}
          <div className="flex items-end gap-3 shrink-0">
            <MissionLogPanel />
            <EvidenceFusionPanel />
          </div>
        </div>

        {/* Small Screen Centered Mission Controls Fallback */}
        <div className="flex lg:hidden justify-center pt-1">
          <MissionControls />
        </div>
      </div>

      {/* 4. MODALS & POPUP WINDOWS */}
      <IncidentModal />
      <MissionPlannerModal />
    </div>
  );
};
