import React from 'react';
import { 
  Play, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Navigation, 
  Sparkles,
  ShieldCheck,
  Radar
} from 'lucide-react';
import { useAurisStore } from '../../state/aurisStore';

export const MissionPlannerModal: React.FC = () => {
  const {
    isMissionPlannerOpen,
    closeMissionPlanner,
    workflowSteps,
    activeWorkflowStep,
    isWorkflowRunning,
    runFullAutonomousFlow,
    jumpToWorkflowStep,
    resetMission,
    searchCoverage,
    fusion,
    drone
  } = useAurisStore();

  // Keyboard shortcut: ESC to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMissionPlannerOpen) {
        closeMissionPlanner();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMissionPlannerOpen, closeMissionPlanner]);

  if (!isMissionPlannerOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMissionPlanner();
      }}
    >
      <div className="tactical-panel w-full max-w-5xl h-[92vh] sm:h-[86vh] max-h-[780px] rounded-xl border-auris-cyan/60 shadow-[0_0_50px_rgba(0,229,255,0.35)] flex flex-col overflow-hidden text-slate-100 font-mono">
        
        {/* 1. Header Bar */}
        <div className="bg-gradient-to-r from-cyan-950/95 via-slate-900 to-purple-950/95 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-auris-cyan/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-auris-cyan/20 border border-auris-cyan flex items-center justify-center text-auris-cyan shadow-[0_0_12px_rgba(0,229,255,0.6)] shrink-0">
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-white text-xs sm:text-sm md:text-base tracking-wider truncate">
                  AURIS MISSION PLANNER & RESCUE DISPATCH
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-bold shrink-0">
                  AUTONOMOUS INTELLIGENCE LOOP
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-sans truncate">
                Full Closed-Loop Sequence: SENSE → VERIFY → DECIDE → REPLAN → TRANSMIT
              </p>
            </div>
          </div>

          <button 
            onClick={closeMissionPlanner}
            title="Close (Esc)"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/80 hover:border-red-500/50 border border-slate-700 text-slate-400 hover:text-white transition-all shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Main Responsive Content Area (Both columns scroll independently with min-h-0) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Flow Column: 7 Interactive Steps */}
          <div className="w-full md:w-3/5 p-3 sm:p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-800 space-y-2.5 custom-scrollbar">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between pb-1 sticky top-0 bg-slate-950/95 backdrop-blur py-1 z-10 border-b border-slate-800/60">
              <span>END-TO-END RESCUE PIPELINE:</span>
              <span className="text-auris-cyan font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                STEP {activeWorkflowStep} OF 7
              </span>
            </div>

            {workflowSteps.map((step) => {
              const isActive = activeWorkflowStep === step.id;
              const isDone = activeWorkflowStep > step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => jumpToWorkflowStep(step.id)}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/60 border-auris-cyan shadow-[0_0_15px_rgba(0,229,255,0.3)] ring-1 ring-auris-cyan/50'
                      : isDone
                      ? 'bg-slate-900/60 border-emerald-500/30 opacity-90 hover:opacity-100 hover:border-emerald-400/50'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Status Icon */}
                    <div className="pt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <Clock className="w-4 h-4 text-auris-cyan animate-spin-slow" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] sm:text-[11px] font-bold truncate ${isActive ? 'text-auris-cyan' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                          0{step.id}. {step.title}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isActive 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' 
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-600'
                        }`}>
                          {isDone ? 'COMPLETE' : isActive ? 'ACTIVE' : 'PENDING'}
                        </span>
                      </div>

                      <div className="text-[9px] sm:text-[10px] text-amber-400/90 font-semibold mt-0.5">
                        {step.tagline}
                      </div>

                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Live Operations & Intelligence Feed */}
          <div className="w-full md:w-2/5 p-3 sm:p-4 flex flex-col justify-between bg-slate-950/80 text-xs overflow-y-auto space-y-3 custom-scrollbar">
            
            <div className="space-y-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5 text-auris-cyan" />
                <span>LIVE FLIGHT & INTELLIGENCE TELEMETRY</span>
              </div>

              {/* Status Gauges 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-900/80 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">CURRENT SECTOR</span>
                  <span className="font-bold text-amber-400 text-xs truncate block">{drone.activeSector}</span>
                </div>
                <div className="bg-slate-900/80 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">ALTITUDE / SPEED</span>
                  <span className="font-bold text-white text-xs block">{drone.altitude.toFixed(1)}m • {drone.speed.toFixed(1)} m/s</span>
                </div>
                <div className="bg-slate-900/80 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">SEARCH COVERAGE</span>
                  <span className="font-bold text-auris-cyan text-xs block">{searchCoverage}%</span>
                </div>
                <div className="bg-slate-900/80 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">FUSED CONFIDENCE</span>
                  <span className={`font-bold text-xs block ${fusion.overallConfidence > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {fusion.overallConfidence}%
                  </span>
                </div>
              </div>

              {/* Active Intelligence Insight */}
              <div className="bg-cyan-950/30 border border-cyan-500/30 p-2.5 sm:p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-auris-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AUTONOMOUS DIRECTIVE:
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-200 leading-normal">
                  {workflowSteps.find(s => s.id === activeWorkflowStep)?.actionText || 'Ready'}
                </div>
              </div>

              {/* Ground Extraction Directive Badge */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 sm:p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RESCUE SQUAD DIRECTIVE:
                </div>
                <div className="text-[10px] text-slate-300 leading-normal">
                  {activeWorkflowStep >= 5 
                    ? 'Survivor Verified (91% confidence). Rescue Incident Packet dispatched to NDRF Squad 04 via Ground Extraction Corridor Alpha.' 
                    : 'Awaiting high-confidence multimodal verification in Sector G...'}
                </div>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="text-[9px] text-slate-500 italic pt-2 border-t border-slate-800/80">
              💡 Tip: Click any step on the left to jump the drone immediately to that phase.
            </div>

          </div>

        </div>

        {/* 3. Modal Bottom Action Toolbar */}
        <div className="bg-slate-950/95 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
            <span className={`w-2.5 h-2.5 rounded-full ${isWorkflowRunning ? 'bg-auris-cyan animate-ping' : 'bg-emerald-400'}`} />
            <span className="font-semibold">{isWorkflowRunning ? 'MODE: EXECUTING PIPELINE' : 'STATUS: READY FOR MISSION'}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Restart / Reset Mission Button */}
            <button
              onClick={resetMission}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[11px] sm:text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>RESTART</span>
            </button>

            {/* Start Full Flow Button */}
            <button
              onClick={runFullAutonomousFlow}
              disabled={isWorkflowRunning}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg font-bold text-[11px] sm:text-xs transition-all ${
                isWorkflowRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black shadow-[0_0_20px_rgba(0,229,255,0.7)]'
              }`}
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>{isWorkflowRunning ? 'EXECUTING PIPELINE...' : 'START FULL AUTONOMOUS MISSION'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
