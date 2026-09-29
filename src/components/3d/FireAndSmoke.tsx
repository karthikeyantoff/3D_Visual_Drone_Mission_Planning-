import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const FireAndSmoke: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Dynamic high-intensity fire flickering
    if (lightRef.current) {
      lightRef.current.intensity = 55 + Math.sin(t * 14) * 20 + Math.cos(t * 22) * 12;
    }
    
    if (flameGroupRef.current) {
      flameGroupRef.current.children.forEach((child, idx) => {
        child.scale.y = 1.0 + Math.sin(t * 9 + idx * 1.5) * 0.35;
        child.rotation.y = t * 0.6 + idx;
      });
    }
  });

  return (
    <group position={[-20, 0, 5]}>
      {/* High-Intensity Dynamic Fire Light */}
      <pointLight 
        ref={lightRef} 
        color="#ff5500" 
        distance={35} 
        decay={2} 
        position={[0, 3.2, 0]} 
      />

      {/* Floating High-Temperature Glowing Fire Embers */}
      <Sparkles 
        count={65} 
        scale={[6, 8, 6]} 
        size={3.5} 
        speed={1.8} 
        color="#fb923c" 
        position={[0, 4.0, 0]}
      />

      {/* Layered Multi-Flame Cones */}
      <group ref={flameGroupRef}>
        {[
          { pos: [0, 1.4, 0], scale: [1.4, 3.0, 1.4], col: "#ff2200" },
          { pos: [1.4, 1.1, 0.9], scale: [0.9, 2.2, 0.9], col: "#ff6600" },
          { pos: [-1.2, 1.2, -0.7], scale: [1.1, 2.5, 1.1], col: "#ff3b00" },
          { pos: [0.5, 0.9, -1.4], scale: [0.8, 1.8, 0.8], col: "#ffaa00" },
          { pos: [-0.6, 0.8, 1.2], scale: [0.85, 1.9, 0.85], col: "#f97316" },
        ].map((f, idx) => (
          <mesh key={idx} position={f.pos as [number, number, number]}>
            <coneGeometry args={[f.scale[0], f.scale[1], 12]} />
            <meshBasicMaterial color={f.col} />
          </mesh>
        ))}
      </group>

      {/* Volumetric Dark Smoke Plume */}
      {[3.0, 5.2, 7.8, 10.8, 14.2].map((y, idx) => (
        <mesh 
          key={idx} 
          position={[(idx % 2 === 0 ? 0.4 : -0.4) * idx * 0.5, y, (idx % 3 === 0 ? 0.5 : -0.3) * idx * 0.4]}
        >
          <sphereGeometry args={[1.5 + idx * 0.8, 12, 12]} />
          <meshStandardMaterial 
            color="#0f172a" 
            transparent 
            opacity={0.42 - idx * 0.06} 
            roughness={1.0} 
          />
        </mesh>
      ))}
    </group>
  );
};
