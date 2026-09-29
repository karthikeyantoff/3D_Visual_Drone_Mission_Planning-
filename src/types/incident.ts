export interface IncidentPacket {
  id: string;
  timestamp: string;
  victimCount: number;
  coordinates: {
    lat: string;
    lng: string;
    gridSector: string;
    altitudeM: number;
  };
  confidence: {
    rgb: number;
    thermal: number;
    acoustic: number;
    overall: number;
  };
  hazardContext: {
    fireDistanceM: number;
    electricalRisk: string;
    floodObstruction: string;
  };
  traversability: {
    vehicleAccess: boolean;
    recommendedSquad: string;
    approachCorridor: string;
  };
  transmissionStatus: 'STANDBY' | 'DISPATCHED_TO_NDRF' | 'EN_ROUTE';
  assignedTeam: string;
}
