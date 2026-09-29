import React from 'react';

// Detailed Damaged Car Model
const DamagedCar: React.FC<{ 
  position: [number, number, number]; 
  rotation?: [number, number, number]; 
  color?: string;
  isOverturned?: boolean;
}> = ({ position, rotation = [0, 0, 0], color = "#3b82f6", isOverturned = false }) => {
  return (
    <group position={position} rotation={rotation}>
      <group rotation={isOverturned ? [Math.PI, 0.2, 0.4] : [0, 0, 0]} position={[0, isOverturned ? 1.2 : 0, 0]}>
        {/* Lower Chassis & Body */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.55, 4.4]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Cabin & Roof */}
        <mesh position={[0, 0.95, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.55, 2.4]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Windshield & Windows */}
        <mesh position={[0, 0.95, -0.2]}>
          <boxGeometry args={[1.82, 0.45, 2.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Crushed Front Hood Deformity */}
        <mesh position={[0, 0.6, 1.6]} rotation={[-0.25, 0.1, 0]} castShadow>
          <boxGeometry args={[1.9, 0.3, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.6} />
        </mesh>

        {/* 4 Wheels */}
        {[
          [-1.05, 0.3, 1.3],
          [1.05, 0.3, 1.3],
          [-1.05, 0.3, -1.3],
          [1.05, 0.3, -1.3],
        ].map((wPos, idx) => (
          <mesh key={idx} position={wPos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.25, 16]} />
            <meshStandardMaterial color="#090d16" roughness={0.9} />
          </mesh>
        ))}

        {/* Headlights */}
        <mesh position={[-0.7, 0.5, 2.21]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0.7, 0.5, 2.21]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#334155" /> {/* Smashed headlight */}
        </mesh>
      </group>
    </group>
  );
};

// Weathered Industrial Shipping Container
const ShippingContainer: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}> = ({ position, rotation = [0, 0, 0], color = "#c2410c" }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.6, 6.2]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.6} />
      </mesh>
      {/* Ribbed Steel Sidewall Corrugations */}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((z, idx) => (
        <mesh key={idx} position={[1.27, 1.3, z]}>
          <boxGeometry args={[0.08, 2.4, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Broken Streetlamp
const BrokenStreetLamp: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Tilted Steel Pole */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 7.0, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Curved Arm */}
      <mesh position={[0.8, 6.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Lamp Head with Flickering Orange/Warm Glow */}
      <mesh position={[1.5, 6.2, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.3]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
};

export const VehiclesAndDebris: React.FC = () => {
  return (
    <group>
      {/* Overturned Crushed Sedans & SUVs in Main Road */}
      <DamagedCar position={[-5, 0, 2]} rotation={[0, 0.6, 0]} color="#b91c1c" isOverturned={true} />
      <DamagedCar position={[8, 0, -8]} rotation={[0, -0.4, 0]} color="#1e293b" isOverturned={false} />
      <DamagedCar position={[-14, 0, 18]} rotation={[0, 1.2, 0]} color="#0369a1" isOverturned={false} />
      <DamagedCar position={[12, 0, 28]} rotation={[0, -0.8, 0]} color="#6b7280" isOverturned={true} />

      {/* Industrial Shipping Containers near Sector B Rubble */}
      <ShippingContainer position={[18, 0, -16]} rotation={[0, 0.3, 0]} color="#c2410c" />
      <ShippingContainer position={[20, 0, -14]} rotation={[0.2, -0.5, 0.1]} color="#0369a1" />

      {/* Snapped Streetlights */}
      <BrokenStreetLamp position={[-16, 0, -6]} rotation={[0.2, 0, -0.35]} />
      <BrokenStreetLamp position={[16, 0, 14]} rotation={[-0.3, 0, 0.25]} />
    </group>
  );
};
