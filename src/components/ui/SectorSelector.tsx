import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { SECTORS } from '../../data/disasterScenario';
import { useAurisStore } from '../../state/aurisStore';

export const SectorSelector: React.FC = () => {
  const { selectedSectorId, setSelectedSectorId, openMissionPlanner, isMissionPlannerOpen } = useAurisStore();

  return (
    <div className="tactical-panel p-1.5 rounded-lg flex items-center gap-1.5 text-xs overflow-x-auto max-w-full shadow-lg">
      <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1 shrink-0 font-mono">
        <MapPin className="w-3.5 h-3.5 text-auris-cyan" />
        SECTORS:
      </span>

      {/* Sectors A to H */}
      {SECTORS.map((sector) => {
        const isSelected = selectedSectorId === sector.id && !isMissionPlannerOpen;

        return (
          <button
            key={sector.id}
            onClick={() => setSelectedSectorId(sector.id)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-auris-cyan text-slate-950 shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                : sector.riskLevel === 'CRITICAL'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {sector.label}
          </button>
        );
      })}

      <div className="w-[1px] h-4 bg-slate-700 mx-1 shrink-0" />

      {/* NEW DEDICATED MISSION PLANNER SESSION BUTTON */}
      <button
        onClick={openMissionPlanner}
        className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold font-mono whitespace-nowrap transition-all border shrink-0 ${
          isMissionPlannerOpen
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 shadow-[0_0_12px_rgba(168,85,247,0.6)] border-white'
            : 'bg-gradient-to-r from-cyan-950/80 to-purple-950/80 text-cyan-300 border-purple-500/50 hover:border-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.3)] animate-pulse'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>MISSION PLANNER</span>
      </button>
    </div>
  );
};
