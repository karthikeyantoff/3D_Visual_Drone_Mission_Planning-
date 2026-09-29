import React from 'react';
import { Eye, Flame, Radar, Mic } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const SensorPanel: React.FC = () => {
  const { sensors, toggleSensor, fusion } = useAurisStore();

  const sensorList = [
    { key: 'rgb' as const, label: 'RGB CAMERA 4K', sub: 'Visual Geometry', icon: Eye, conf: fusion.rgbConfidence, color: 'text-cyan-400', bar: 'bg-cyan-400' },
    { key: 'thermal' as const, label: 'MLX90640 THERMAL', sub: 'Heat Signature', icon: Flame, conf: fusion.thermalConfidence, color: 'text-orange-400', bar: 'bg-orange-400' },
    { key: 'lidar' as const, label: 'RPLIDAR 360°', sub: 'Spatial Point Cloud', icon: Radar, conf: 88, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { key: 'acoustic' as const, label: 'MEMS MIC ARRAY', sub: 'DOA Beamforming', icon: Mic, conf: fusion.acousticConfidence, color: 'text-blue-400', bar: 'bg-blue-400' },
  ];

  return (
    <div className="tactical-panel p-3.5 rounded-lg w-[290px] h-[240px] flex flex-col justify-between text-xs shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
        <span className="font-bold text-slate-200 tracking-wider flex items-center gap-1.5 font-mono text-[11px]">
          <Radar className="w-3.5 h-3.5 text-auris-cyan" />
          SENSING SUITE
        </span>
        <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60 font-bold font-mono">
          4 CHANNELS
        </span>
      </div>

      {/* Sensor Channels Grid */}
      <div className="space-y-1.5">
        {sensorList.map((s) => {
          const Icon = s.icon;
          const isActive = sensors[s.key];

          return (
            <div 
              key={s.key}
              onClick={() => toggleSensor(s.key)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-all border ${
                isActive 
                  ? 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/60 shadow-sm' 
                  : 'bg-slate-950/40 border-slate-900 opacity-40 hover:opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isActive ? s.color : 'text-slate-600'}`} />
                <div>
                  <div className="font-bold text-slate-200 text-[10px] leading-tight font-mono">{s.label}</div>
                  <div className="text-[9px] text-slate-400 leading-tight">{s.sub}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold ${isActive ? s.color : 'text-slate-600'}`}>
                  {s.conf}%
                </span>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-700'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
