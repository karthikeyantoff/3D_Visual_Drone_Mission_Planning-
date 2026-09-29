import React from 'react';
import { Gauge } from 'lucide-react';
import { useAurisStore, FlightSpeed } from '../../state/aurisStore';

export const SpeedSelector: React.FC = () => {
  const { flightSpeed, setFlightSpeed } = useAurisStore();

  const speeds: { key: FlightSpeed; label: string; desc: string }[] = [
    { key: 'SLOW', label: 'SLOW / CLEAR', desc: '2.5 m/s' },
    { key: 'NORMAL', label: 'NORMAL', desc: '5.2 m/s' },
    { key: 'FAST', label: 'FAST', desc: '8.5 m/s' },
  ];

  return (
    <div className="tactical-panel p-2 rounded-lg flex items-center gap-1.5 text-xs">
      <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wider flex items-center gap-1 shrink-0">
        <Gauge className="w-3.5 h-3.5 text-auris-cyan" />
        SPEED:
      </span>

      {speeds.map((s) => {
        const isActive = flightSpeed === s.key;

        return (
          <button
            key={s.key}
            onClick={() => setFlightSpeed(s.key)}
            className={`px-2.5 py-1.5 rounded font-bold transition-all text-[11px] flex items-center gap-1 ${
              isActive
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
};
