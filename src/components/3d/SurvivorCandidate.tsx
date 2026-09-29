import React from 'react';
import { useAurisStore } from '../../state/aurisStore';

export const SurvivorCandidate: React.FC = () => {
  const { sensors } = useAurisStore();

  const isThermal = sensors.thermal;

  return (
    <group position={[16.2, 0.4, 11.5]}>
      {/* Human Body / Torso (With Realistic Thermal Signature Shader) */}
      <group position={[0, 0.25, 0]} rotation={[0, 0.85, 1.2]}>
        {/* Torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.22, 0.65, 12, 24]} />
          <meshStandardMaterial 
            color={isThermal ? "#ff2200" : "#475569"} 
            emissive={isThermal ? "#ff1100" : "#000000"}
            emissiveIntensity={isThermal ? 0.9 : 0.0}
            roughness={0.6} 
          />
        </mesh>

        {/* Arms / Legs */}
        <mesh position={[0.22, 0.1, -0.1]} rotation={[0.4, 0, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
          <meshStandardMaterial 
            color={isThermal ? "#ff5500" : "#334155"} 
            emissive={isThermal ? "#ff3300" : "#000000"}
            emissiveIntensity={isThermal ? 0.8 : 0.0}
          />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[-0.35, 0.45, 0.18]} castShadow>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial 
          color={isThermal ? "#ff6600" : "#cbd5e1"} 
          emissive={isThermal ? "#ff4400" : "#000000"}
          emissiveIntensity={isThermal ? 1.0 : 0.0}
          roughness={0.5} 
        />
      </mesh>

      {/* Emergency Silver Space Foil Blanket Corner */}
      <mesh position={[0.1, 0.35, 0.2]} rotation={[0.2, 0.4, -0.1]} castShadow>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          metalness={0.95} 
          roughness={0.15} 
          side={2} // DoubleSide
        />
      </mesh>

      {/* Occluding Concrete Slab (Creates the visual uncertainty from Viewpoint 1) */}
      <mesh position={[-0.45, 0.95, -0.65]} rotation={[0.38, -0.42, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.35, 2.0]} />
        <meshStandardMaterial color="#334155" roughness={0.92} />
      </mesh>
    </group>
  );
};
