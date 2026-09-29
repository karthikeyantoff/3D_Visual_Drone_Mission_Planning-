import React from 'react';

export const FloodZone: React.FC = () => {
  return (
    <group position={[-12, 0.08, -18]}>
      {/* Reflective Murky Water Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 32]} />
        <meshStandardMaterial 
          color="#0b1926" 
          roughness={0.12} 
          metalness={0.8}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Submerged Road Marking Lines */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 28]} />
        <meshBasicMaterial color="#eab308" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};
