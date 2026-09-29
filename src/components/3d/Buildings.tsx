import React from 'react';

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  hasDamage?: boolean;
  floors?: number;
}

const RealisticBuilding: React.FC<BuildingProps> = ({ 
  position, 
  size, 
  rotation = [0, 0, 0], 
  color = "#1e2433",
  hasDamage = true,
  floors = 6
}) => {
  const floorHeight = size[1] / floors;

  return (
    <group position={position} rotation={rotation}>
      {/* Main Structural Core */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.15} />
      </mesh>

      {/* Architectural Window Strips & Frames */}
      {Array.from({ length: floors }).map((_, fIdx) => {
        const y = (fIdx + 0.5) * floorHeight;
        // Skip damaged floors to show exposure
        if (hasDamage && (fIdx === floors - 2 || fIdx === floors - 1)) return null;

        return (
          <group key={fIdx} position={[0, y, 0]}>
            {/* Front & Back Window Glass Panels */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[0, 0, (side * size[2]) / 2 + side * 0.02]}>
                <planeGeometry args={[size[0] * 0.88, floorHeight * 0.55]} />
                <meshStandardMaterial 
                  color="#0f172a" 
                  roughness={0.15} 
                  metalness={0.85} 
                  transparent
                  opacity={0.7}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Exposed Damaged Floor Slabs with Jagged Rebar */}
      {hasDamage && (
        <group position={[0, size[1] * 0.75, 0]}>
          {/* Smashed Wall Void */}
          <mesh position={[size[0] * 0.25, 0, size[2] * 0.48]} castShadow>
            <boxGeometry args={[size[0] * 0.5, floorHeight * 1.8, 0.4]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.95} />
          </mesh>

          {/* Hanging Concrete Chunk */}
          <mesh position={[size[0] * 0.35, -floorHeight * 0.6, size[2] * 0.4]} rotation={[0.2, 0.1, -0.4]} castShadow>
            <boxGeometry args={[size[0] * 0.4, 0.4, size[2] * 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>

          {/* Protruding Steel Rebar Rods */}
          {[-0.8, -0.3, 0.2, 0.7].map((rx, idx) => (
            <mesh 
              key={idx} 
              position={[size[0] * 0.3 + rx * 0.8, -floorHeight * 0.4, size[2] * 0.52]} 
              rotation={[0.3, 0, (idx % 2 === 0 ? 0.3 : -0.4)]}
            >
              <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Rooftop Details (HVAC Units, Antennas, Water Tank) */}
      <group position={[0, size[1], 0]}>
        {/* Parapet Wall Lip */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[size[0] + 0.2, 0.6, size[2] + 0.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* HVAC Chiller Unit */}
        <mesh position={[-size[0] * 0.25, 0.7, size[2] * 0.2]} castShadow>
          <boxGeometry args={[2.5, 1.4, 2.0]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Rooftop Water Tank */}
        <mesh position={[size[0] * 0.25, 1.4, -size[2] * 0.2]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 2.2, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Telecom Mast with Blinking Warning Light */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 5.0, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 5.0, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
};

export const Buildings: React.FC = () => {
  return (
    <group>
      {/* Sector A: Urban High-Rise District */}
      <RealisticBuilding position={[-35, 0, 25]} size={[18, 38, 20]} floors={8} color="#182030" />
      <RealisticBuilding position={[-38, 0, -10]} size={[15, 28, 16]} floors={6} color="#1c2438" />
      <RealisticBuilding position={[-20, 0, 34]} size={[12, 22, 14]} floors={5} color="#151b28" />
      
      {/* Sector B: Collapsed Structure */}
      <RealisticBuilding position={[24, 0, 22]} size={[16, 14, 16]} floors={3} color="#131924" />
      
      {/* Sector F: Peripheral Search Zone */}
      <RealisticBuilding position={[38, 0, -25]} size={[15, 26, 15]} floors={6} color="#1e2636" />
      <RealisticBuilding position={[-22, 0, -36]} size={[16, 18, 14]} floors={4} color="#161e2c" />
      <RealisticBuilding position={[30, 0, -4]} size={[12, 16, 12]} floors={4} color="#1a2232" />
    </group>
  );
};
