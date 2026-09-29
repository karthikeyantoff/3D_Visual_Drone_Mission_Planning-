import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAurisStore } from '../../state/aurisStore';

export const Visualizations: React.FC = () => {
  const { sensors, missionPhase, drone, isRescueRouteActive } = useAurisStore();
  const lidarRayRef = useRef<THREE.Mesh>(null);
  const acousticGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Rotate LiDAR Ray
    if (lidarRayRef.current && sensors.lidar) {
      lidarRayRef.current.rotation.y = t * 5.5;
    }

    // 2. Expand Acoustic Waves
    if (acousticGroupRef.current && sensors.acoustic) {
      acousticGroupRef.current.children.forEach((ring, idx) => {
        const s = ((t * 1.4 + idx * 0.7) % 2.8) + 0.5;
        ring.scale.set(s, s, 1);
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 0.65 - s * 0.22);
        }
      });
    }

    // 3. Emergency Beacon Strobe
    if (beaconRef.current) {
      beaconRef.current.scale.setScalar(1.0 + Math.sin(t * 8) * 0.25);
    }
  });

  return (
    <group>
      {/* 1. 360-Degree LiDAR Scanning Plane (Anchored to Drone) */}
      {sensors.lidar && (
        <group position={drone.position}>
          {/* Circular Scan Disk */}
          <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 12, 32]} />
            <meshBasicMaterial 
              color="#00e5ff" 
              transparent 
              opacity={0.12} 
              side={THREE.DoubleSide} 
            />
          </mesh>

          {/* High-Speed Rotating Laser Beam */}
          <mesh ref={lidarRayRef} position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 14, 8]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        </group>
      )}

      {/* 2. Directional Acoustic Waves at Survivor Location */}
      {sensors.acoustic && (
        <group ref={acousticGroupRef} position={[16.2, 0.5, 11.5]}>
          {[0, 1, 2].map((idx) => (
            <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.35, 32]} />
              <meshBasicMaterial 
                color="#0070f3" 
                transparent 
                opacity={0.6} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 3. Hero Uncertainty Bounding Box & Frustum */}
      {(missionPhase === 'UNCERTAIN_DETECTED' || missionPhase === 'CALCULATING_NBV' || missionPhase === 'REPOSITIONING') && (
        <group position={[16.2, 1.2, 11.5]}>
          <mesh>
            <boxGeometry args={[3.0, 2.4, 2.6]} />
            <meshBasicMaterial color="#ffb703" wireframe />
          </mesh>
          <mesh>
            <boxGeometry args={[3.0, 2.4, 2.6]} />
            <meshBasicMaterial color="#ffb703" transparent opacity={0.15} />
          </mesh>
        </group>
      )}

      {/* 4. Glowing Next-Best-View (NBV) Flight Corridor Ribbon */}
      {(missionPhase === 'CALCULATING_NBV' || missionPhase === 'REPOSITIONING' || missionPhase === 'VERIFIED') && (
        <group>
          {/* Flight Path Line */}
          <mesh position={[15.2, 4.2, 9.8]} rotation={[0.4, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          {/* NBV Target Waypoint Marker */}
          <mesh position={[18.5, 3.2, 15.0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color="#00e5ff" wireframe />
          </mesh>
        </group>
      )}

      {/* 5. Emergency Extraction Beacon Strobe over Survivor (Sector G) */}
      <group position={[16.2, 3.5, 11.5]}>
        <mesh ref={beaconRef}>
          <octahedronGeometry args={[0.45]} />
          <meshBasicMaterial color={isRescueRouteActive ? "#10b981" : "#00e5ff"} wireframe />
        </mesh>
        <pointLight 
          color={isRescueRouteActive ? "#10b981" : "#00e5ff"} 
          distance={12} 
          intensity={isRescueRouteActive ? 25 : 8} 
        />
      </group>

      {/* 6. NEON GREEN GROUND EXTRACTION CORRIDOR ALPHA (BASE PAD H -> SECTOR G) */}
      {isRescueRouteActive && (
        <group>
          {/* Waypoint 1: Staging to Main Road */}
          <mesh position={[0, 0.15, -25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 28]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          {/* Waypoint 2: Diagonal corridor avoiding Fire Hazard to Sector G */}
          <mesh position={[8, 0.15, -3]} rotation={[-Math.PI / 2, 0, -0.6]}>
            <planeGeometry args={[2.5, 22]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          {/* Waypoint 3: Rubble approach into Survivor Pocket */}
          <mesh position={[15, 0.15, 8]} rotation={[-Math.PI / 2, 0, 0.3]}>
            <planeGeometry args={[2.5, 12]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.55} side={THREE.DoubleSide} />
          </mesh>

          {/* Rescue First Responder Ground Unit Marker */}
          <group position={[6, 0.4, -6]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.8, 2.8]} />
              <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
            </mesh>
            <pointLight color="#10b981" distance={8} intensity={12} position={[0, 1.2, 0]} />
          </group>
        </group>
      )}

      {/* 7. Fire Hazard Exclusion Zone Perimeter */}
      <group position={[-20, 0.1, 5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.2, 7.5, 32]} />
          <meshBasicMaterial color="#ef233c" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};
