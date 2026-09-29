import React from 'react';
import { Terminal } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const MissionLogPanel: React.FC = () => {
  const { missionLogs } = useAurisStore();

  return (
    <div className="tactical-panel p-3.5 rounded-lg w-[310px] h-[240px] flex flex-col justify-between text-xs shadow-xl hidden md:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
        <span className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-mono text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          RESCUE INTELLIGENCE
        </span>
        <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60 font-bold font-mono animate-pulse">
          LIVE FEED
        </span>
      </div>

      {/* Terminal Log Stream */}
      <div className="flex-1 overflow-y-auto space-y-1.5 my-2 pr-1 font-mono text-[9px]">
        {missionLogs.map((log) => (
          <div key={log.id} className="bg-slate-900/50 p-1.5 rounded border border-slate-800/60 leading-tight">
            <span className="text-slate-500 mr-1.5 font-semibold">[{log.timestamp}]</span>
            <span className={
              log.type === 'alert' ? 'text-amber-400 font-bold' :
              log.type === 'warn' ? 'text-orange-400' :
              log.type === 'success' ? 'text-emerald-400 font-bold' :
              'text-slate-300'
            }>
              {log.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div className="border-t border-slate-800/80 pt-1.5 flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span>EDGE-AI BUFFER: OK</span>
        <span className="text-auris-cyan">ENCRYPTED TELEMETRY</span>
      </div>
    </div>
  );
};
