import React from 'react';
import { GroundTerrain } from './GroundTerrain';
import { Buildings } from './Buildings';
import { VehiclesAndDebris } from './VehiclesAndDebris';
import { RubblePiles } from './RubblePiles';
import { FloodZone } from './FloodZone';
import { FireAndSmoke } from './FireAndSmoke';
import { ElectricalHazard } from './ElectricalHazard';
import { SurvivorCandidate } from './SurvivorCandidate';
import { SectorMarkers } from './SectorMarkers';
import { Drone } from './Drone';
import { Visualizations } from './Visualizations';

export const DisasterEnvironment: React.FC = () => {
  return (
    <group>
      <GroundTerrain />
      <Buildings />
      <VehiclesAndDebris />
      <RubblePiles />
      <FloodZone />
      <FireAndSmoke />
      <ElectricalHazard />
      <SurvivorCandidate />
      <SectorMarkers />
      <Drone />
      <Visualizations />
    </group>
  );
};
