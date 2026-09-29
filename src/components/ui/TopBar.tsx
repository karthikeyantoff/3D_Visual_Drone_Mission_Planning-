import React from 'react';
import { Radio, ShieldAlert, Activity, Compass } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const TopBar: React.FC = () => {
  const { drone, missionPhase } = useAurisStore();

  return (
    <header className="flex items-center justify-between px-5 py-2.5 tactical-panel border-auris-border/40 text-slate-100 rounded-lg shadow-lg">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-auris-cyan/10 border border-auris-cyan flex items-center justify-center text-auris-cyan shadow-[0_0_10px_rgba(0,229,255,0.4)]">
          <Activity className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-widest text-white font-mono">AURIS</span>
            <span className="text-[9px] bg-auris-cyan/15 text-auris-cyan border border-auris-cyan/40 px-1.5 py-0.2 rounded font-bold font-mono">
              EDGE-AI 13 TOPS
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans tracking-tight leading-none mt-0.5">
            Autonomous Uncertainty-aware Rescue Intelligence System
          </p>
        </div>
      </div>

      {/* Center Core Loop Banner */}
      <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono bg-slate-950/80 border border-slate-800 px-4 py-1.5 rounded-full text-slate-300">
        <span className="text-auris-cyan font-bold">SENSE</span>
        <span className="text-slate-600">→</span>
        <span className="text-amber-400 font-bold">VERIFY</span>
        <span className="text-slate-600">→</span>
        <span className="text-purple-400 font-bold">DECIDE</span>
        <span className="text-slate-600">→</span>
        <span className="text-emerald-400 font-bold">REPLAN</span>
      </div>

      {/* Telemetry Status Badges */}
      <div className="flex items-center gap-2 text-xs">
        {/* Comm Link */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-mono">LINK:</span>
          <span className="text-emerald-400 font-bold font-mono">SIYI HM30</span>
        </div>

        {/* GPS */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px]">
          <Compass className="w-3.5 h-3.5 text-auris-cyan" />
          <span className="text-slate-400 font-mono">GPS:</span>
          <span className="text-slate-200 font-bold font-mono">{drone.gpsStatus}</span>
        </div>

        {/* Mission State */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-500/40 text-auris-cyan text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 text-auris-cyan" />
          <span className="font-bold uppercase tracking-wider font-mono">{missionPhase}</span>
        </div>
      </div>
    </header>
  );
};
