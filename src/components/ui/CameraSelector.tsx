import React from 'react';
import { Video, Crosshair, Eye, Compass } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';
import { CameraMode } from '../../types/drone';

export const CameraSelector: React.FC = () => {
  const { cameraMode, setCameraMode } = useAurisStore();

  const modes: { key: CameraMode; label: string; icon: any }[] = [
    { key: 'FREE', label: 'FREE ORBIT', icon: Compass },
    { key: 'FOLLOW', label: 'FOLLOW DRONE', icon: Video },
    { key: 'FPV', label: 'DRONE FPV', icon: Eye },
    { key: 'TACTICAL', label: 'TACTICAL TOP', icon: Crosshair },
  ];

  return (
    <div className="tactical-panel p-2 rounded-lg flex items-center gap-1.5 text-xs">
      <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wider hidden sm:inline">
        CAMERA:
      </span>
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = cameraMode === m.key;

        return (
          <button
            key={m.key}
            onClick={() => setCameraMode(m.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all ${
              isActive
                ? 'bg-auris-cyan text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[11px]">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
