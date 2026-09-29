import React from 'react';

// Twisted Steel I-Beam
const SteelIBeam: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  length?: number;
}> = ({ position, rotation, length = 4.5 }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Central Web */}
      <mesh castShadow>
        <boxGeometry args={[0.04, 0.35, length]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} metalness={0.8} />
      </mesh>
      {/* Top & Bottom Flanges */}
      {[-0.17, 0.17].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.25, 0.04, length]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const RubblePiles: React.FC = () => {
  return (
    <group>
      {/* Ground Zero Multi-layer Rubble Mound (Near Survivor Sector G) */}
      <group position={[16, 0, 11]}>
        {/* Tier 1 Slabs */}
        <mesh position={[0, 0.25, 0]} rotation={[0.1, 0.4, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 0.45, 5.5]} />
          <meshStandardMaterial color="#2d3748" roughness={0.92} />
        </mesh>
        
        {/* Tier 2 Fractured Slab with Exposed Jagged Void */}
        <mesh position={[0.9, 0.7, -0.4]} rotation={[-0.2, -0.5, 0.15]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 0.4, 4.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} />
        </mesh>

        {/* Tier 3 Collapsed Roof Deck */}
        <mesh position={[-0.7, 1.15, 0.5]} rotation={[0.3, 0.2, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.35, 3.6]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>

        {/* Twisted Structural Steel I-Beams */}
        <SteelIBeam position={[1.4, 1.2, 0.8]} rotation={[0.4, 0.8, -0.3]} length={5.0} />
        <SteelIBeam position={[-1.8, 0.6, -1.2]} rotation={[-0.5, -0.2, 0.6]} length={4.2} />

        {/* Procedural Debris Rocks & Brick Chunks */}
        {[-3.0, -1.8, 1.2, 2.5, -0.6, 2.8, -2.2, 0.5].map((offset, idx) => (
          <mesh 
            key={idx} 
            position={[offset * 1.1, 0.3 + (idx % 3) * 0.2, (idx % 2 === 0 ? 1 : -1) * (1.8 + idx * 0.3)]} 
            rotation={[idx * 0.5, idx * 0.7, idx * 0.3]}
            castShadow
          >
            <dodecahedronGeometry args={[0.35 + (idx % 3) * 0.18]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#334155" : "#7c2d12"} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Roadblock Rubble Mound (Sector E / Center) */}
      <group position={[2, 0, 8]}>
        <mesh position={[0, 0.35, 0]} rotation={[0.05, 0.8, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.6, 3.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.92} />
        </mesh>
        <mesh position={[1.4, 0.85, 0.2]} rotation={[-0.3, 0.3, 0.1]} castShadow>
          <boxGeometry args={[3.8, 0.4, 2.6]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <SteelIBeam position={[0.5, 0.7, -0.4]} rotation={[0.2, 0.4, 0.5]} length={3.8} />
      </group>
    </group>
  );
};
