import React from 'react';
import { ShieldCheck, MapPin, Send, X, Users, Compass, Flame } from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const IncidentModal: React.FC = () => {
  const { 
    incidentPacket, 
    isIncidentModalOpen, 
    closeIncidentModal, 
    dispatchRescueTeam,
    setSelectedSectorId,
    setCameraMode
  } = useAurisStore();

  if (!isIncidentModalOpen) return null;

  const isDispatched = incidentPacket.transmissionStatus === 'DISPATCHED_TO_NDRF';

  const handleDispatch = () => {
    dispatchRescueTeam();
    setSelectedSectorId('AREA_G');
    setCameraMode('TACTICAL');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="tactical-panel w-full max-w-xl rounded-xl border-auris-cyan/60 shadow-[0_0_40px_rgba(0,229,255,0.3)] flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-950/90 to-slate-900 px-5 py-3.5 border-b border-auris-cyan/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white text-sm tracking-wider">
                  RESCUE INTELLIGENCE INCIDENT PACKET
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                PACKET ID: <span className="text-auris-cyan font-bold">{incidentPacket.id}</span> • {incidentPacket.timestamp}
              </p>
            </div>
          </div>

          <button 
            onClick={closeIncidentModal}
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* 1. Target & Geo Location */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-auris-cyan" />
                GEO-COORDINATES:
              </div>
              <div className="font-bold text-white text-[11px]">{incidentPacket.coordinates.lat}</div>
              <div className="font-bold text-white text-[11px]">{incidentPacket.coordinates.lng}</div>
              <div className="text-[10px] text-amber-400 pt-0.5">{incidentPacket.coordinates.gridSector}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-purple-400" />
                FUSED CONFIDENCE:
              </div>
              <div className="text-xl font-black text-emerald-400">{incidentPacket.confidence.overall}%</div>
              <div className="text-[9px] text-slate-400">
                RGB {incidentPacket.confidence.rgb}% • Thermal {incidentPacket.confidence.thermal}% • Audio {incidentPacket.confidence.acoustic}%
              </div>
            </div>
          </div>

          {/* 2. Environmental Hazard Proximity */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              SURROUNDING HAZARD CONTEXT:
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">FIRE PROXIMITY</span>
                <span className="font-bold text-amber-400">{incidentPacket.hazardContext.fireDistanceM}m NW (CLEAR)</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">ELECTRICAL GRID</span>
                <span className="font-bold text-emerald-400">{incidentPacket.hazardContext.electricalRisk}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block">FLOOD OBSTRUCTION</span>
                <span className="font-bold text-slate-300">{incidentPacket.hazardContext.floodObstruction}</span>
              </div>
            </div>
          </div>

          {/* 3. Actionable Traversability & Team Recommendation */}
          <div className="bg-cyan-950/30 border border-cyan-500/30 p-3 rounded-lg space-y-2">
            <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-auris-cyan" />
              ACTIONABLE GROUND EXTRACTION DIRECTIVE:
            </div>
            <div className="text-[11px] text-slate-200 space-y-1">
              <div>• <span className="text-slate-400">Recommended Squad:</span> <span className="text-white font-bold">{incidentPacket.traversability.recommendedSquad}</span></div>
              <div>• <span className="text-slate-400">Safe Approach:</span> <span className="text-emerald-400 font-bold">{incidentPacket.traversability.approachCorridor}</span></div>
              <div>• <span className="text-slate-400">Vehicle Traversability:</span> <span className="text-amber-400 font-bold">BLOCKED (Debris Level 4) — Foot Rescue Only</span></div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Dispatch Action */}
        <div className="bg-slate-950/80 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LINK: SIYI HM30 DIGITAL TELEMETRY</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeIncidentModal}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
            >
              DISMISS
            </button>

            <button
              onClick={handleDispatch}
              disabled={isDispatched}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono font-bold text-xs transition-all ${
                isDispatched
                  ? 'bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] cursor-default'
                  : 'bg-auris-cyan hover:bg-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(0,229,255,0.7)]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatched ? 'TRANSMITTED TO NDRF SQUAD' : 'TRANSMIT TO RESCUE TEAM'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
