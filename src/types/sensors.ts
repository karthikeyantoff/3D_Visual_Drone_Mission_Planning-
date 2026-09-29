export interface SensorState {
  rgb: boolean;
  thermal: boolean;
  lidar: boolean;
  acoustic: boolean;
  opticalFlow: boolean;
}

export type EvidenceState = 'NONE' | 'INSUFFICIENT' | 'UNCERTAIN_CONFLICT' | 'CONFIRMED_HIGH';

export interface FusionConfidence {
  rgbConfidence: number;        // 0 - 100
  thermalConfidence: number;    // 0 - 100
  acousticConfidence: number;   // 0 - 100
  overallConfidence: number;    // 0 - 100
  state: EvidenceState;
  reinspectionRequired: boolean;
  explanation: string[];
}
