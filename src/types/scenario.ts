export interface SectorInfo {
  id: string;
  name: string;
  label: string;
  position: [number, number, number];
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'URBAN' | 'COLLAPSE' | 'FLOOD' | 'FIRE' | 'ELECTRICAL' | 'SEARCH' | 'SURVIVOR' | 'BASE';
}

export interface HazardZone {
  id: string;
  type: 'FIRE' | 'FLOOD' | 'ELECTRICAL' | 'COLLAPSE';
  position: [number, number, number];
  radius: number;
  severity: number;
}
