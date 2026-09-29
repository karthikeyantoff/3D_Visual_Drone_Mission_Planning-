import React from 'react';
import { Html } from '@react-three/drei';
import { SECTORS } from '../../data/disasterScenario';
import { useAurisStore } from '../../state/aurisStore';

export const SectorMarkers: React.FC = () => {
  const { selectedSectorId, setSelectedSectorId } = useAurisStore();

  return (
    <group>
      {SECTORS.map((sector) => {
        const isSelected = selectedSectorId === sector.id;
        
        return (
          <group key={sector.id} position={sector.position}>
            {/* Holographic Vertical Beacon Line */}
            <mesh position={[0, -sector.position[1] / 2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, sector.position[1], 8]} />
              <meshBasicMaterial 
                color={isSelected ? "#00e5ff" : (sector.type === 'FIRE' ? "#ef233c" : "#64748b")} 
                transparent 
                opacity={0.4} 
              />
            </mesh>

            {/* Floating 3D Sector Pin Icon */}
            <Html position={[0, 0.5, 0]} center distanceFactor={45}>
              <button
                onClick={() => setSelectedSectorId(sector.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
                  isSelected 
                    ? 'bg-auris-cyan/90 text-slate-950 border border-white shadow-[0_0_15px_rgba(0,229,255,0.8)] scale-110' 
                    : sector.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900'
                    : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950 animate-ping' : 'bg-auris-cyan'}`} />
                {sector.label}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
