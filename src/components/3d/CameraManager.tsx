import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAurisStore } from '../../state/aurisStore';
import { SECTORS } from '../../data/disasterScenario';

export const CameraManager: React.FC = () => {
  const { cameraMode, drone, selectedSectorId } = useAurisStore();
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Smooth persistent interpolation vectors for rock-solid camera motion
  const smoothedCamPos = useRef(new THREE.Vector3(0, 28, 48));
  const smoothedLookTarget = useRef(new THREE.Vector3(0, 5, 0));
  const targetOrbitPos = useRef(new THREE.Vector3(0, 5, 0));

  useFrame((_, delta) => {
    const dPos = new THREE.Vector3(...drone.position);
    const yaw = drone.rotation[1];

    if (cameraMode === 'FREE') {
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        if (selectedSectorId) {
          const sec = SECTORS.find((s) => s.id === selectedSectorId);
          if (sec) {
            targetOrbitPos.current.lerp(new THREE.Vector3(...sec.position), delta * 2.5);
            controlsRef.current.target.copy(targetOrbitPos.current);
          }
        }
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Safe clamp delta to prevent lag spikes causing jumps
      const dt = Math.min(delta, 0.1);

      if (cameraMode === 'FPV') {
        // --- ULTRA-SMOOTH GIMBAL-STABILIZED FPV MODE ---
        // Position camera directly at front 2-axis optical gimbal
        const forwardOffset = 0.28;
        const upOffset = 0.02;
        const camTargetX = dPos.x + Math.sin(yaw) * forwardOffset;
        const camTargetY = dPos.y + upOffset;
        const camTargetZ = dPos.z + Math.cos(yaw) * forwardOffset;

        const desiredCamPos = new THREE.Vector3(camTargetX, camTargetY, camTargetZ);
        
        // High-responsiveness position tracking
        smoothedCamPos.current.lerp(desiredCamPos, dt * 18.0);
        camera.position.copy(smoothedCamPos.current);

        // Gimbal-stabilized forward look-at target (18 meters ahead)
        const lookDist = 18.0;
        const desiredLookX = dPos.x + Math.sin(yaw) * lookDist;
        const desiredLookY = dPos.y - 1.2; // Slight downward pitch for ground perception
        const desiredLookZ = dPos.z + Math.cos(yaw) * lookDist;

        const desiredLookTarget = new THREE.Vector3(desiredLookX, desiredLookY, desiredLookZ);
        smoothedLookTarget.current.lerp(desiredLookTarget, dt * 10.0);
        camera.lookAt(smoothedLookTarget.current);

      } else if (cameraMode === 'FOLLOW') {
        // --- SMOOTH THIRD-PERSON CHASE CAM ---
        const followDist = 8.5;
        const followHeight = 4.2;
        const desiredCam = new THREE.Vector3(
          dPos.x - Math.sin(yaw) * followDist,
          dPos.y + followHeight,
          dPos.z - Math.cos(yaw) * followDist
        );
        
        smoothedCamPos.current.lerp(desiredCam, dt * 5.0);
        camera.position.copy(smoothedCamPos.current);

        const lookPoint = new THREE.Vector3(dPos.x, dPos.y + 0.8, dPos.z);
        smoothedLookTarget.current.lerp(lookPoint, dt * 8.0);
        camera.lookAt(smoothedLookTarget.current);

      } else if (cameraMode === 'TACTICAL') {
        // --- SMOOTH TACTICAL TOP-DOWN OVERVIEW ---
        const topCam = new THREE.Vector3(dPos.x, 50, dPos.z + 0.1);
        smoothedCamPos.current.lerp(topCam, dt * 4.0);
        camera.position.copy(smoothedCamPos.current);

        const groundPoint = new THREE.Vector3(dPos.x, 0, dPos.z);
        smoothedLookTarget.current.lerp(groundPoint, dt * 6.0);
        camera.lookAt(smoothedLookTarget.current);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={4}
      maxDistance={140}
    />
  );
};
