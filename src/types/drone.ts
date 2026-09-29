export type CameraMode = 'FREE' | 'FOLLOW' | 'FPV' | 'TACTICAL';

export type CommStatus = 'CONNECTED' | 'DEGRADED' | 'OFFLINE_EDGE_AI';

export type GPSStatus = 'LOCKED' | 'DEGRADED' | 'DENIED_OPTICAL_FLOW';

export type MissionPhase = 
  | 'IDLE'
  | 'TAKEOFF'
  | 'SEARCHING'
  | 'UNCERTAIN_DETECTED'
  | 'CALCULATING_NBV'
  | 'REPOSITIONING'
  | 'REINSPECTING'
  | 'VERIFIED'
  | 'RISK_REPLANNING'
  | 'MISSION_COMPLETE';

export interface DroneTelemetry {
  position: [number, number, number];
  rotation: [number, number, number];
  altitude: number;
  speed: number;
  battery: number;
  commStatus: CommStatus;
  gpsStatus: GPSStatus;
  npuInferenceMs: number;
  activeSector: string;
}
