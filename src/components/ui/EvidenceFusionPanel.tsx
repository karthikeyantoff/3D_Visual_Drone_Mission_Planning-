import React from 'react';
import { Layers, AlertTriangle, Send } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const EvidenceFusionPanel: React.FC = () => {
  const { fusion, openIncidentModal } = useAurisStore();
  const isConfirmed = fusion.state === 'CONFIRMED_HIGH';

  return (
    <div className="tactical-panel p-3.5 rounded-lg w-[310px] h-[240px] flex flex-col justify-between text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
        <span className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-mono text-[11px]">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          EVIDENCE FUSION
        </span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold font-mono ${
          isConfirmed 
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700' 
            : 'bg-amber-950/80 text-amber-400 border-amber-700'
        }`}>
          {isConfirmed ? 'CONFIRMED' : 'UNCERTAIN'}
        </span>
      </div>

      {/* Multimodal Confidence Gauge */}
      <div className="bg-slate-950/70 p-2 rounded border border-slate-800 space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-400">FUSED CONFIDENCE</span>
          <span className={`text-sm font-black ${isConfirmed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {fusion.overallConfidence}%
          </span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className={`h-full transition-all duration-700 ${
              isConfirmed 
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${fusion.overallConfidence}%` }}
          />
        </div>
      </div>

      {/* Principle Callout OR Transmit Action */}
      {!isConfirmed ? (
        <div className="bg-amber-500/10 border border-amber-500/30 px-2 py-1.5 rounded text-[10px] text-amber-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="font-mono">
            <span className="font-bold">UNCERTAIN: </span>
            <span className="italic">"Not detected ≠ not present"</span>
          </div>
        </div>
      ) : (
        <button
          onClick={openIncidentModal}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-2 py-1.5 rounded text-[10px] flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all font-mono"
        >
          <Send className="w-3 h-3 text-slate-950" />
          <span>TRANSMIT RESCUE PACKET</span>
        </button>
      )}

      {/* Explainable AI Evidence Breakdown */}
      <div className="space-y-1 text-[9px] text-slate-300 font-mono">
        {fusion.explanation.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-start gap-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/80 truncate">
            <span className="text-auris-cyan font-bold">•</span>
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
