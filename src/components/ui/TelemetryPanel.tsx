import React from 'react';
import { Battery, ArrowUp, Gauge, Cpu, Navigation } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const TelemetryPanel: React.FC = () => {
  const { drone, searchCoverage } = useAurisStore();

  return (
    <div className="tactical-panel p-3.5 rounded-lg w-[290px] h-[240px] flex flex-col justify-between text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
        <span className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-mono text-[11px]">
          <Navigation className="w-3.5 h-3.5 text-auris-cyan" />
          DRONE TELEMETRY
        </span>
        <span className="text-[9px] text-auris-cyan bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60 font-bold font-mono">
          HEXA-01
        </span>
      </div>

      {/* 2x2 Telemetry Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-slate-300">
        {/* Battery */}
        <div className="bg-slate-900/70 p-1.5 rounded border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span>BATT</span>
          </div>
          <span className="font-bold font-mono text-emerald-400 text-[11px]">{drone.battery}%</span>
        </div>

        {/* Altitude */}
        <div className="bg-slate-900/70 p-1.5 rounded border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <ArrowUp className="w-3.5 h-3.5 text-auris-cyan" />
            <span>ALT</span>
          </div>
          <span className="font-bold font-mono text-slate-100 text-[11px]">{drone.altitude.toFixed(1)}m</span>
        </div>

        {/* Speed */}
        <div className="bg-slate-900/70 p-1.5 rounded border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
            <span>SPEED</span>
          </div>
          <span className="font-bold font-mono text-slate-100 text-[11px]">{drone.speed.toFixed(1)} m/s</span>
        </div>

        {/* NPU Latency */}
        <div className="bg-slate-900/70 p-1.5 rounded border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>NPU</span>
          </div>
          <span className="font-bold font-mono text-purple-300 text-[11px]">{drone.npuInferenceMs}ms</span>
        </div>
      </div>

      {/* Probabilistic Search Coverage Bar */}
      <div className="space-y-1 bg-slate-950/60 p-2 rounded border border-slate-800/60">
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-slate-400">SEARCH COVERAGE</span>
          <span className="font-bold text-auris-cyan">{searchCoverage}%</span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500" 
            style={{ width: `${searchCoverage}%` }}
          />
        </div>
      </div>

      {/* Active Sector Readout */}
      <div className="text-[10px] text-slate-400 flex justify-between items-center px-1">
        <span>SECTOR:</span>
        <span className="text-amber-400 font-bold font-mono text-[10px] truncate max-w-[180px]">{drone.activeSector}</span>
      </div>
    </div>
  );
};
