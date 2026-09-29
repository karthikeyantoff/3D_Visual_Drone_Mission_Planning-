import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAurisStore } from '../../state/aurisStore';

export const Drone: React.FC = () => {
  const { 
    drone, 
    targetWaypoint, 
    flightSpeed,
    sensors, 
    setDroneTelemetry 
  } = useAurisStore();

  const droneGroupRef = useRef<THREE.Group>(null);
  const propGroupRefs = useRef<THREE.Group[]>([]);

  // Smooth continuous internal physics state
  const currentPos = useRef(new THREE.Vector3(...drone.position));
  const currentVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const currentYaw = useRef(drone.rotation[1]);
  const currentPitch = useRef(0);
  const currentRoll = useRef(0);
  const orbitAngle = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);
    const target = new THREE.Vector3(...targetWaypoint);

    // Speed configuration based on user preference
    const speedConfig = {
      SLOW: { maxSpeed: 2.6, orbitSpeed: 0.22, lerpRate: 1.8 },
      NORMAL: { maxSpeed: 5.2, orbitSpeed: 0.45, lerpRate: 2.8 },
      FAST: { maxSpeed: 8.5, orbitSpeed: 0.70, lerpRate: 3.8 },
    }[flightSpeed];

    // 1. Calculate vector to target
    const toTarget = new THREE.Vector3().subVectors(target, currentPos.current);
    const distToTarget = toTarget.length();

    let currentSpeed = 0;
    let desiredYaw = currentYaw.current;
    let desiredPitch = 0;
    let desiredRoll = 0;

    if (distToTarget > 2.0) {
      // --- SMOOTH SLOW TRANSIT TO WAYPOINT ---
      const speedFactor = Math.min(1.0, distToTarget / 6.0);
      currentSpeed = speedConfig.maxSpeed * Math.max(0.25, speedFactor);

      const moveDir = toTarget.clone().normalize();
      currentVelocity.current.lerp(moveDir.multiplyScalar(currentSpeed), dt * speedConfig.lerpRate);
      currentPos.current.addScaledVector(currentVelocity.current, dt);

      // Smooth Heading Direction (Shortest angular path)
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - desiredYaw;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      desiredYaw += angleDiff;

      // Gentle aerodynamic banking
      desiredPitch = 0.08 * speedFactor;
      desiredRoll = -Math.sin(angleDiff) * 0.15;
    } else {
      // --- SLOW DETAILED SECTOR INSPECTION ORBIT ---
      if (target.z < -35) {
        // Base Pad Landing Hover
        currentSpeed = 0.0;
        currentVelocity.current.lerp(new THREE.Vector3(0, 0, 0), dt * 3.0);
        currentPos.current.lerp(target, dt * 2.0);
        desiredPitch = 0;
        desiredRoll = 0;
      } else {
        // Very Slow, Clear 360-Degree Inspection Orbit (Radius 5.8m)
        currentSpeed = 1.8;
        orbitAngle.current += dt * speedConfig.orbitSpeed;
        const orbitRadius = 5.8;

        const desiredX = target.x + Math.cos(orbitAngle.current) * orbitRadius;
        const desiredZ = target.z + Math.sin(orbitAngle.current) * orbitRadius;
        const desiredY = target.y + Math.sin(t * 1.2) * 0.25;

        const desiredOrbitPos = new THREE.Vector3(desiredX, desiredY, desiredZ);
        currentPos.current.lerp(desiredOrbitPos, dt * 2.2);

        // Face tangent of the orbit circle smoothly
        desiredYaw = orbitAngle.current + Math.PI / 2 + 0.15;
        desiredRoll = -0.06;
        desiredPitch = 0.02;
      }
    }

    // Micro hover stabilization
    const hoverVibe = Math.sin(t * 8) * 0.008;

    // Smooth Euler damping
    currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, desiredYaw, dt * 3.0);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, desiredPitch, dt * 3.5);
    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, desiredRoll, dt * 3.5);

    // Apply to 3D Transform
    if (droneGroupRef.current) {
      droneGroupRef.current.position.set(
        currentPos.current.x,
        currentPos.current.y + hoverVibe,
        currentPos.current.z
      );
      droneGroupRef.current.rotation.set(
        currentPitch.current,
        currentYaw.current,
        currentRoll.current
      );
    }

    // High-speed Propeller Rotation
    propGroupRefs.current.forEach((prop, idx) => {
      if (prop) {
        const dir = idx % 2 === 0 ? 1 : -1;
        prop.rotation.y += dir * (currentSpeed > 0 ? 1.2 : 0.85);
      }
    });

    // Synchronize Store Telemetry
    setDroneTelemetry({
      position: [currentPos.current.x, currentPos.current.y, currentPos.current.z],
      rotation: [currentPitch.current, currentYaw.current, currentRoll.current],
      altitude: Math.max(0.4, currentPos.current.y),
      speed: Math.round(currentSpeed * 10) / 10,
    });
  });

  return (
    <group ref={droneGroupRef} position={drone.position}>
      {/* 1. Central Carbon Fiber Chassis Plate */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.008, 24]} />
        <meshStandardMaterial color="#020617" roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.04, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.20, 0.008, 24]} />
        <meshStandardMaterial color="#020617" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Aerodynamic Matte White Canopy Shell with Carbon Inset */}
      <mesh position={[0, 0.085, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* 2. Six Carbon Arms & Heavy-Duty BLDC Motors */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const angle = (idx * Math.PI) / 3;
        const armLength = 0.58;
        const x = Math.cos(angle) * armLength;
        const z = Math.sin(angle) * armLength;

        return (
          <group key={idx}>
            {/* CNC Anodized Arm Clamp at Chassis */}
            <mesh position={[x * 0.25, 0.04, z * 0.25]} rotation={[0, -angle + Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.045, 0.04, 0.045]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Carbon Fiber Arm Tube */}
            <mesh 
              position={[x * 0.55, 0.04, z * 0.55]} 
              rotation={[0, -angle + Math.PI / 2, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.014, 0.014, armLength * 0.7, 12]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.4} />
            </mesh>

            {/* Motor Base & Orange Anodized Rotor Bell */}
            <mesh position={[x, 0.035, z]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.02, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[x, 0.065, z]} castShadow>
              <cylinderGeometry args={[0.034, 0.034, 0.026, 16]} />
              <meshStandardMaterial color="#ea580c" roughness={0.25} metalness={0.9} />
            </mesh>

            {/* 15-Inch Aerodynamic Folding Propeller Blades */}
            <group 
              position={[x, 0.088, z]} 
              ref={(el) => { if (el) propGroupRefs.current[idx] = el; }}
            >
              <mesh castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.012, 12]} />
                <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.44, 0.003, 0.028]} />
                <meshStandardMaterial color="#090d16" roughness={0.2} />
              </mesh>
            </group>

            {/* Navigation Strobe on Arm Tips */}
            <mesh position={[x, 0.02, z]}>
              <sphereGeometry args={[0.009, 8, 8]} />
              <meshBasicMaterial 
                color={idx in [1, 2] ? "#ef4444" : idx in [4, 5] ? "#22c55e" : "#ffffff"} 
              />
            </mesh>
          </group>
        );
      })}

      {/* 3. Carbon Landing Skids */}
      {[-0.18, 0.18].map((side, idx) => (
        <group key={idx} position={[side, -0.16, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.58, 12]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.08, 0.16]} rotation={[0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.24, 12]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.08, -0.16]} rotation={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.24, 12]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 4. Onboard Edge-AI RPi 5 + AI HAT+ Enclosure */}
      <group position={[0, -0.01, 0]}>
        <mesh position={[0, 0.02, 0.02]} castShadow>
          <boxGeometry args={[0.09, 0.024, 0.07]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.03, -0.015, 0, 0.015, 0.03].map((fx, fIdx) => (
          <mesh key={fIdx} position={[fx, 0.035, 0.02]}>
            <boxGeometry args={[0.003, 0.008, 0.065]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 5. Front 2-Axis Optical/Thermal Gimbal */}
      <group position={[0, -0.065, 0.22]} rotation={[0.22, 0, 0]}>
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[0.07, 0.006, 0.06]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        {[-0.025, 0.025].map((dx, dIdx) => (
          <React.Fragment key={dIdx}>
            <mesh position={[dx, 0.02, 0.02]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#00e5ff" roughness={0.9} />
            </mesh>
            <mesh position={[dx, 0.02, -0.02]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#00e5ff" roughness={0.9} />
            </mesh>
          </React.Fragment>
        ))}

        <mesh castShadow>
          <boxGeometry args={[0.085, 0.05, 0.055]} />
          <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[-0.022, 0, 0.029]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.008, 16]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.022, 0, 0.029]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.008, 16]} />
          <meshBasicMaterial color={sensors.thermal ? "#ff5500" : "#64748b"} />
        </mesh>
      </group>

      {/* 6. Top RPLIDAR A1M8 Laser Turret */}
      <group position={[0, 0.145, 0.02]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.035, 24]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.015, 24]} />
          <meshBasicMaterial color={sensors.lidar ? "#00e5ff" : "#334155"} />
        </mesh>
      </group>
    </group>
  );
};
