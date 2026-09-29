export interface MissionWorkflowStep {
  id: number;
  title: string;
  tagline: string;
  description: string;
  sectorId: string;
  actionText: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export const WORKFLOW_STEPS: MissionWorkflowStep[] = [
  {
    id: 1,
    title: 'DISASTER DEPLOYMENT & TAKEOFF',
    tagline: 'Staging Pad Launch',
    description: 'AURIS hexacopter arms BLDC motors, engages optical flow altitude hold, and ascends to 8.5m patrol ceiling.',
    sectorId: 'AREA_H',
    actionText: 'Ascending to search altitude',
    status: 'PENDING',
  },
  {
    id: 2,
    title: 'MULTIMODAL SECTOR RECONNAISSANCE',
    tagline: 'LiDAR & Thermal Sweep',
    description: 'Sweeps across Sector F debris field. RPLIDAR 360° constructs obstacle point cloud while MLX90640 thermal surveys heat gradients.',
    sectorId: 'AREA_F',
    actionText: 'Building spatial occupancy grid',
    status: 'PENDING',
  },
  {
    id: 3,
    title: 'UNCERTAIN CANDIDATE DETECTED',
    tagline: '"Not Detected ≠ Not Present"',
    description: 'Ambiguous human silhouette observed in Sector G rubble from imperfect Viewpoint 1. Evidence conflict: RGB 61%, Thermal 72%, Audio 58%.',
    sectorId: 'AREA_G',
    actionText: 'Evidence conflict evaluation',
    status: 'PENDING',
  },
  {
    id: 4,
    title: 'NEXT-BEST-VIEW (NBV) REPOSITIONING',
    tagline: 'Autonomous Vantage Flight',
    description: 'Onboard Edge-AI calculates optimal occlusion-free vector. Drone autonomously executes banked flight to Viewpoint 2.',
    sectorId: 'AREA_G',
    actionText: 'Flying glowing NBV flight corridor',
    status: 'PENDING',
  },
  {
    id: 5,
    title: 'EVIDENCE FUSION & PERSON IDENTIFICATION',
    tagline: '91% Confirmed Survivor',
    description: 'Multi-modal fusion converges: RGB 89% (face & torso clear), Thermal 91% (36.8°C core), Acoustic 84% (vocal distress cue).',
    sectorId: 'AREA_G',
    actionText: 'Survivor candidate verified',
    status: 'PENDING',
  },
  {
    id: 6,
    title: 'RISK-AWARE HAZARD ROUTING',
    tagline: 'Thermal & Grid Avoidance',
    description: 'Calculates dynamic safety margins avoiding Sector D fire plume (28m NW) and Sector E downed high-voltage grid.',
    sectorId: 'AREA_G',
    actionText: 'Corridor Alpha boundary verified',
    status: 'PENDING',
  },
  {
    id: 7,
    title: 'AUTOMATIC INCIDENT TRANSMISSION & DISPATCH',
    tagline: 'Ground Squad Extraction',
    description: 'Digital incident packet SAR-2026-089A sent via SIYI HM30 link to NDRF teams. Safe Ground Extraction Corridor Alpha illuminates.',
    sectorId: 'AREA_G',
    actionText: 'First responder unit deployed',
    status: 'PENDING',
  },
];
