import { create } from 'zustand';
import { CameraMode, DroneTelemetry, MissionPhase } from '../types/drone';
import { SensorState, FusionConfidence } from '../types/sensors';
import { IncidentPacket } from '../types/incident';
import { SECTORS } from '../data/disasterScenario';
import { WORKFLOW_STEPS, MissionWorkflowStep } from '../data/missionWorkflow';

export type FlightSpeed = 'SLOW' | 'NORMAL' | 'FAST';

interface AurisStore {
  // Drone Telemetry & Flight
  drone: DroneTelemetry;
  targetWaypoint: [number, number, number];
  isOrbitingSector: boolean;
  flightSpeed: FlightSpeed;
  cameraMode: CameraMode;
  selectedSectorId: string | null;
  
  // Sensor State & Evidence Fusion
  sensors: SensorState;
  fusion: FusionConfidence;
  
  // Team Dispatch & Incident Reporting
  incidentPacket: IncidentPacket;
  isIncidentModalOpen: boolean;
  isRescueRouteActive: boolean;
  
  // Dedicated Mission Planner Workflow
  isMissionPlannerOpen: boolean;
  activeWorkflowStep: number;
  workflowSteps: MissionWorkflowStep[];
  isWorkflowRunning: boolean;
  
  // Mission Machine Logs
  missionPhase: MissionPhase;
  missionProgress: number; // 0 - 100%
  searchCoverage: number;  // 0 - 100%
  missionLogs: Array<{ id: string; timestamp: string; text: string; type: 'info' | 'warn' | 'alert' | 'success' }>;
  
  // Actions
  setCameraMode: (mode: CameraMode) => void;
  setFlightSpeed: (speed: FlightSpeed) => void;
  setSelectedSectorId: (id: string | null) => void;
  setTargetWaypoint: (waypoint: [number, number, number]) => void;
  setIsOrbitingSector: (orbiting: boolean) => void;
  toggleSensor: (sensor: keyof SensorState) => void;
  setDroneTelemetry: (partial: Partial<DroneTelemetry>) => void;
  setMissionPhase: (phase: MissionPhase) => void;
  setFusionConfidence: (fusion: Partial<FusionConfidence>) => void;
  addLog: (text: string, type?: 'info' | 'warn' | 'alert' | 'success') => void;
  
  // Incident & Rescue Actions
  openIncidentModal: () => void;
  closeIncidentModal: () => void;
  dispatchRescueTeam: () => void;
  
  // Mission Planner Window Controls
  openMissionPlanner: () => void;
  closeMissionPlanner: () => void;
  runFullAutonomousFlow: () => void;
  jumpToWorkflowStep: (stepNumber: number) => void;
  
  // Autonomous Demo Controllers
  startMission: () => void;
  triggerNBVDemo: () => void;
  resetMission: () => void;
}

let workflowTimer: any = null;

export const useAurisStore = create<AurisStore>((set, get) => ({
  drone: {
    position: [0, 0.4, -40],
    rotation: [0, 0, 0],
    altitude: 0.4,
    speed: 0.0,
    battery: 94,
    commStatus: 'CONNECTED',
    gpsStatus: 'LOCKED',
    npuInferenceMs: 8.2,
    activeSector: 'SECTOR H (BASE)',
  },
  targetWaypoint: [0, 0.4, -40],
  isOrbitingSector: false,
  flightSpeed: 'SLOW',
  cameraMode: 'FREE',
  selectedSectorId: 'AREA_H',

  sensors: {
    rgb: true,
    thermal: true,
    lidar: true,
    acoustic: true,
    opticalFlow: true,
  },

  fusion: {
    rgbConfidence: 61,
    thermalConfidence: 72,
    acousticConfidence: 58,
    overallConfidence: 64,
    state: 'UNCERTAIN_CONFLICT',
    reinspectionRequired: true,
    explanation: [
      'RGB: Partial human silhouette (Occluded by concrete slab 58%)',
      'Thermal: Localized 37°C hotspot detected in void pocket',
      'Acoustic: Periodic distress cue localized at bearing 042°',
      'Evaluation: UNCERTAIN EVIDENCE -> "NOT DETECTED ≠ NOT PRESENT"',
    ],
  },

  incidentPacket: {
    id: 'SAR-2026-089A',
    timestamp: '11:58:40 UTC',
    victimCount: 1,
    coordinates: {
      lat: '28°36\'50.0"N',
      lng: '77°12\'32.4"E',
      gridSector: 'SECTOR G (RUBBLE VOID POCKET)',
      altitudeM: 2.4,
    },
    confidence: {
      rgb: 89,
      thermal: 91,
      acoustic: 84,
      overall: 91,
    },
    hazardContext: {
      fireDistanceM: 28,
      electricalRisk: 'LOW (CORRIDOR CLEARS DOWNED GRID)',
      floodObstruction: 'SUBMERGED ROADWAY 14M SOUTH',
    },
    traversability: {
      vehicleAccess: false,
      recommendedSquad: 'NDRF URBAN SAR STRETCHER SQUAD 04',
      approachCorridor: 'EXTRACTION CORRIDOR ALPHA (NORTH FLANK)',
    },
    transmissionStatus: 'STANDBY',
    assignedTeam: 'NDRF 8th BN FIRST RESPONDER UNIT',
  },
  isIncidentModalOpen: false,
  isRescueRouteActive: false,

  // Mission Planner
  isMissionPlannerOpen: false,
  activeWorkflowStep: 1,
  workflowSteps: WORKFLOW_STEPS,
  isWorkflowRunning: false,

  missionPhase: 'IDLE',
  missionProgress: 0,
  searchCoverage: 48,
  missionLogs: [
    {
      id: '1',
      timestamp: '00:00:01',
      text: 'AURIS Hexacopter initialized. Edge-AI NPU 13 TOPS active.',
      type: 'info',
    },
    {
      id: '2',
      timestamp: '00:00:03',
      text: 'Mission Planner workflow ready. Autonomous intelligence loop armed.',
      type: 'success',
    },
  ],

  setCameraMode: (mode) => set({ cameraMode: mode }),
  setFlightSpeed: (speed) => {
    set({ flightSpeed: speed });
    get().addLog(`Flight Speed adjusted to ${speed}`, 'info');
  },
  setTargetWaypoint: (waypoint) => set({ targetWaypoint: waypoint }),
  setIsOrbitingSector: (isOrbitingSector) => set({ isOrbitingSector }),
  
  openIncidentModal: () => set({ isIncidentModalOpen: true }),
  closeIncidentModal: () => set({ isIncidentModalOpen: false }),

  openMissionPlanner: () => set({ isMissionPlannerOpen: true }),
  closeMissionPlanner: () => set({ isMissionPlannerOpen: false }),

  dispatchRescueTeam: () => {
    const { addLog } = get();
    set((state) => ({
      isRescueRouteActive: true,
      incidentPacket: {
        ...state.incidentPacket,
        transmissionStatus: 'DISPATCHED_TO_NDRF'
      }
    }));
    addLog('ALERT BROADCAST: Incident Packet SAR-2026-089A sent to NDRF Teams!', 'success');
    addLog('Safe Ground Extraction Corridor Alpha illuminated on Tactical HUD.', 'success');
    addLog('First Responder Squad 04 deployed along cleared ground route.', 'info');
  },

  jumpToWorkflowStep: (stepNumber: number) => {
    if (workflowTimer) clearTimeout(workflowTimer);
    const { addLog } = get();

    set((state) => ({
      activeWorkflowStep: stepNumber,
      workflowSteps: state.workflowSteps.map((s) => ({
        ...s,
        status: s.id < stepNumber ? 'COMPLETED' : s.id === stepNumber ? 'ACTIVE' : 'PENDING'
      }))
    }));

    if (stepNumber === 1) {
      // Step 1: Takeoff
      set({ 
        targetWaypoint: [0, 8.5, -35], 
        cameraMode: 'FOLLOW',
        selectedSectorId: 'AREA_H',
        missionPhase: 'TAKEOFF',
        searchCoverage: 35
      });
      addLog('STEP 1: Hexacopter taking off from Base Pad H to 8.5m altitude.', 'info');
    } else if (stepNumber === 2) {
      // Step 2: Reconnaissance
      set({ 
        targetWaypoint: [32, 8.5, -22], 
        cameraMode: 'FOLLOW',
        selectedSectorId: 'AREA_F',
        missionPhase: 'SEARCHING',
        searchCoverage: 55
      });
      addLog('STEP 2: Sector F reconnaissance. LiDAR and Thermal active.', 'info');
    } else if (stepNumber === 3) {
      // Step 3: Uncertain Candidate
      set({ 
        targetWaypoint: [12.0, 5.5, 4.0], // Imperfect Viewpoint 1
        cameraMode: 'TACTICAL',
        selectedSectorId: 'AREA_G',
        missionPhase: 'UNCERTAIN_DETECTED',
        searchCoverage: 68,
        fusion: {
          rgbConfidence: 61,
          thermalConfidence: 72,
          acousticConfidence: 58,
          overallConfidence: 64,
          state: 'UNCERTAIN_CONFLICT',
          reinspectionRequired: true,
          explanation: [
            'RGB: Partial human silhouette (Occluded by concrete slab 58%)',
            'Thermal: Localized 37°C hotspot detected in void pocket',
            'Acoustic: Periodic distress cue localized at bearing 042°',
            'Evaluation: UNCERTAIN EVIDENCE -> "NOT DETECTED ≠ NOT PRESENT"',
          ],
        }
      });
      addLog('STEP 3: Ambiguous candidate detected in Sector G rubble! Evidence conflict.', 'alert');
    } else if (stepNumber === 4) {
      // Step 4: Next-Best-View Repositioning
      set({ 
        targetWaypoint: [18.5, 3.2, 15.0], // Viewpoint 2
        cameraMode: 'FOLLOW',
        missionPhase: 'REPOSITIONING',
        searchCoverage: 75
      });
      addLog('STEP 4: AURIS autonomously flying glowing NBV flight corridor.', 'info');
    } else if (stepNumber === 5) {
      // Step 5: Evidence Fusion Verification
      set({ 
        cameraMode: 'FPV',
        missionPhase: 'VERIFIED',
        searchCoverage: 91,
        fusion: {
          rgbConfidence: 89,
          thermalConfidence: 91,
          acousticConfidence: 84,
          overallConfidence: 91,
          state: 'CONFIRMED_HIGH',
          reinspectionRequired: false,
          explanation: [
            'RGB: Full human torso & face clear (91% visibility)',
            'Thermal: Strong human thermal silhouette confirmed (36.8°C)',
            'Acoustic: Direct line-of-sight voice distress signal verified (84%)',
            'Final Assessment: HIGH-CONFIDENCE SURVIVOR CANDIDATE (91%)',
          ],
        }
      });
      addLog('STEP 5: Real Person Identified & Verified! Multimodal fusion at 91% confidence.', 'success');
    } else if (stepNumber === 6) {
      // Step 6: Risk-Aware Planning
      set({ 
        cameraMode: 'TACTICAL',
        selectedSectorId: 'AREA_G'
      });
      addLog('STEP 6: Risk-aware mission engine calculated safe corridor avoiding fire & grid.', 'info');
    } else if (stepNumber === 7) {
      // Step 7: Transmission to Rescue Team
      set((state) => ({
        isRescueRouteActive: true,
        isIncidentModalOpen: true,
        incidentPacket: {
          ...state.incidentPacket,
          transmissionStatus: 'DISPATCHED_TO_NDRF'
        }
      }));
      addLog('STEP 7: Incident Packet SAR-2026-089A transmitted to NDRF team! Corridor Alpha active.', 'success');
    }
  },

  runFullAutonomousFlow: () => {
    const { jumpToWorkflowStep, addLog } = get();
    if (workflowTimer) clearTimeout(workflowTimer);

    set({ isWorkflowRunning: true });
    addLog('MISSION PLANNER: Initiating End-to-End Autonomous Rescue Sequence...', 'info');

    // Step 1: Launch (0s)
    jumpToWorkflowStep(1);

    // Step 2: Recon (3.5s)
    workflowTimer = setTimeout(() => {
      jumpToWorkflowStep(2);

      // Step 3: Uncertain Detection (7.5s)
      workflowTimer = setTimeout(() => {
        jumpToWorkflowStep(3);

        // Step 4: NBV Repositioning (11.5s)
        workflowTimer = setTimeout(() => {
          jumpToWorkflowStep(4);

          // Step 5: Verification of Person (15.5s)
          workflowTimer = setTimeout(() => {
            jumpToWorkflowStep(5);

            // Step 6: Risk Planning (18.5s)
            workflowTimer = setTimeout(() => {
              jumpToWorkflowStep(6);

              // Step 7: Transmit to Team & Deploy Route (21.5s)
              workflowTimer = setTimeout(() => {
                jumpToWorkflowStep(7);
                set({ isWorkflowRunning: false });
                addLog('MISSION PLANNER: Full Autonomous Mission Flow Complete!', 'success');
              }, 3000);
            }, 3000);
          }, 4000);
        }, 4000);
      }, 4000);
    }, 3500);
  },

  setSelectedSectorId: (id) => {
    set({ selectedSectorId: id });
    if (!id) return;

    // If user clicked the new MISSION PLANNER tab
    if (id === 'MISSION_PLANNER') {
      get().openMissionPlanner();
      return;
    }

    const sector = SECTORS.find(s => s.id === id);
    if (!sector) return;

    const targetMap: Record<string, [number, number, number]> = {
      'AREA_A': [-35, 12.5, 25],
      'AREA_B': [22, 8.5, 18],
      'AREA_C': [-12, 6.0, -18],
      'AREA_D': [-20, 11.0, 5],
      'AREA_E': [5, 7.5, -5],
      'AREA_F': [32, 8.5, -22],
      'AREA_G': [16.2, 4.2, 11.5],
      'AREA_H': [0, 0.4, -40],
    };

    const target = targetMap[id] || [sector.position[0], 7.5, sector.position[2]];
    set({ 
      targetWaypoint: target,
      isOrbitingSector: false,
      drone: { ...get().drone, activeSector: sector.label }
    });

    const { addLog } = get();
    addLog(`DISPATCH: Autonomous navigation initiated to ${sector.name}`, 'info');
  },

  toggleSensor: (sensor) => set((state) => ({
    sensors: { ...state.sensors, [sensor]: !state.sensors[sensor] }
  })),

  setDroneTelemetry: (partial) => set((state) => ({
    drone: { ...state.drone, ...partial }
  })),

  setMissionPhase: (phase) => set({ missionPhase: phase }),

  setFusionConfidence: (fusionUpdate) => set((state) => ({
    fusion: { ...state.fusion, ...fusionUpdate }
  })),

  addLog: (text, type = 'info') => {
    const now = new Date();
    const ts = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100)}`;
    set((state) => ({
      missionLogs: [
        { id: Math.random().toString(), timestamp: ts, text, type },
        ...state.missionLogs.slice(0, 30)
      ]
    }));
  },

  startMission: () => {
    get().runFullAutonomousFlow();
  },

  triggerNBVDemo: () => {
    get().jumpToWorkflowStep(3);
  },

  resetMission: () => {
    if (workflowTimer) clearTimeout(workflowTimer);

    set({
      drone: {
        position: [0, 0.4, -40],
        rotation: [0, 0, 0],
        altitude: 0.4,
        speed: 0.0,
        battery: 94,
        commStatus: 'CONNECTED',
        gpsStatus: 'LOCKED',
        npuInferenceMs: 8.2,
        activeSector: 'SECTOR H (BASE)',
      },
      targetWaypoint: [0, 0.4, -40],
      isOrbitingSector: false,
      flightSpeed: 'SLOW',
      cameraMode: 'FREE',
      selectedSectorId: 'AREA_H',
      missionPhase: 'IDLE',
      searchCoverage: 48,
      isIncidentModalOpen: false,
      isRescueRouteActive: false,
      isMissionPlannerOpen: false,
      activeWorkflowStep: 1,
      isWorkflowRunning: false,
      workflowSteps: WORKFLOW_STEPS.map(s => ({ ...s, status: 'PENDING' })),
      incidentPacket: {
        ...get().incidentPacket,
        transmissionStatus: 'STANDBY',
      },
      fusion: {
        rgbConfidence: 61,
        thermalConfidence: 72,
        acousticConfidence: 58,
        overallConfidence: 64,
        state: 'UNCERTAIN_CONFLICT',
        reinspectionRequired: true,
        explanation: [
          'RGB: Partial human silhouette (Occluded by concrete slab 58%)',
          'Thermal: Localized 37°C hotspot detected in void pocket',
          'Acoustic: Periodic distress cue localized at bearing 042°',
          'Evaluation: UNCERTAIN EVIDENCE -> "NOT DETECTED ≠ NOT PRESENT"',
        ],
      },
    });
    get().addLog('Mission Planner & Drone reset to initial Staging Pad H.', 'info');
  },
}));
