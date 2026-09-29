import React from 'react';
import { Play, RotateCcw, Sparkles, Send } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const MissionControls: React.FC = () => {
  const { 
    missionPhase, 
    startMission, 
    triggerNBVDemo, 
    resetMission,
    openIncidentModal,
    isRescueRouteActive
  } = useAurisStore();

  const isRunning = missionPhase !== 'IDLE';
  const isVerified = missionPhase === 'VERIFIED';

  return (
    <div className="tactical-panel px-3 py-2 rounded-lg flex items-center gap-2.5 text-xs shadow-2xl border-auris-border/40">
      {/* Start Mission Button */}
      <button
        onClick={startMission}
        disabled={isRunning}
        className={`flex items-center gap-2 px-4 py-2 rounded font-bold font-mono transition-all text-xs ${
          isRunning
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400/40'
        }`}
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>START MISSION</span>
      </button>

      {/* Next-Best-View Uncertainty Demo Trigger */}
      <button
        onClick={triggerNBVDemo}
        className="flex items-center gap-2 px-4 py-2 rounded font-bold font-mono bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-[0_0_18px_rgba(168,85,247,0.4)] transition-all text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
        <span>NEXT-BEST-VIEW DEMO</span>
      </button>

      {/* Dispatch Rescue Team / Incident Report Action */}
      <button
        onClick={openIncidentModal}
        className={`flex items-center gap-2 px-4 py-2 rounded font-bold font-mono transition-all text-xs border ${
          isRescueRouteActive
            ? 'bg-emerald-700 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
            : isVerified
            ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.7)] animate-pulse'
            : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
        }`}
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isRescueRouteActive ? 'EXTRACTION ROUTE ACTIVE' : 'DISPATCH RESCUE TEAM'}</span>
      </button>

      {/* Reset Button */}
      <button
        onClick={resetMission}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded font-bold font-mono bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all text-xs"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
        <span>RESET</span>
      </button>
    </div>
  );
};
