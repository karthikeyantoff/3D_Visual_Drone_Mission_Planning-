import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const ElectricalHazard: React.FC = () => {
  const sparkLightRef = useRef<THREE.PointLight>(null);
  const sparkOrbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // High-voltage erratic spark flash
    const isFlashing = (Math.sin(t * 35) > 0.35 && Math.cos(t * 50) > 0.25);
    
    if (sparkLightRef.current) {
      sparkLightRef.current.intensity = isFlashing ? 75 : 4;
    }
    if (sparkOrbRef.current) {
      sparkOrbRef.current.visible = isFlashing;
      sparkOrbRef.current.scale.setScalar(0.8 + Math.random() * 0.7);
    }
  });

  return (
    <group position={[5, 0, -5]}>
      {/* Heavy Tilted Concrete Utility Pole */}
      <mesh position={[0, 4.2, 0]} rotation={[0.42, 0.22, 0.18]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 9.5, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>

      {/* Pole-Mounted Cylindrical Transformer */}
      <mesh position={[0.4, 5.8, 0.2]} rotation={[0.42, 0.22, 0.18]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Crossarm Bar */}
      <mesh position={[0.2, 6.4, 0.1]} rotation={[0.42, 0.22, Math.PI / 2]}>
        <boxGeometry args={[0.15, 0.15, 2.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>

      {/* Dangling Ruptured High-Voltage Cable */}
      <mesh position={[1.6, 1.9, 0.9]} rotation={[0.65, 0.25, 0]}>
        <torusGeometry args={[1.9, 0.035, 8, 32, Math.PI * 0.75]} />
        <meshStandardMaterial color="#090d16" roughness={0.4} />
      </mesh>

      {/* Flashing Voltage Spark Point Light */}
      <pointLight 
        ref={sparkLightRef} 
        color="#00e5ff" 
        distance={22} 
        decay={2} 
        position={[2.5, 0.5, 1.3]} 
      />

      {/* Spark Glow Core */}
      <mesh ref={sparkOrbRef} position={[2.5, 0.5, 1.3]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Dynamic Cyan Voltage Particle Burst */}
      <Sparkles 
        count={30} 
        scale={[2.5, 2.5, 2.5]} 
        size={4.0} 
        speed={3.5} 
        color="#00e5ff" 
        position={[2.5, 0.7, 1.3]}
      />
    </group>
  );
};
