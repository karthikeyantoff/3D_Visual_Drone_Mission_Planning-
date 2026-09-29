import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { DisasterEnvironment } from './DisasterEnvironment';
import { CameraManager } from './CameraManager';

export const CanvasContainer: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#050811]">
      <Canvas
        camera={{ position: [0, 28, 48], fov: 45, near: 0.1, far: 500 }}
        shadows
        gl={{ 
          antialias: true, 
          powerPreference: 'high-performance',
        }}
      >
        {/* Atmospheric Dark Disaster Fog */}
        <color attach="background" args={['#050811']} />
        <fogExp2 attach="fog" args={['#050811', 0.011]} />

        {/* Ambient Twilight Fill */}
        <ambientLight intensity={0.75} color="#1e293b" />
        
        {/* Cool High-Contrast Directional Sun/Moon Beam */}
        <directionalLight
          position={[40, 55, 30]}
          intensity={2.2}
          color="#93c5fd"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-camera-near={0.5}
          shadow-camera-far={160}
          shadow-camera-left={-65}
          shadow-camera-right={65}
          shadow-camera-top={65}
          shadow-camera-bottom={-65}
        />

        {/* Warm Disaster Horizon Rim Fill */}
        <directionalLight
          position={[-40, 25, -35]}
          intensity={0.9}
          color="#f97316"
        />

        {/* Soft Ground Contact Shadows for Realistic Grounding */}
        <ContactShadows 
          position={[0, 0.04, 0]} 
          opacity={0.65} 
          scale={140} 
          blur={2.4} 
          far={30} 
          color="#020617" 
        />

        {/* 3D Disaster World & Camera Director */}
        <DisasterEnvironment />
        <CameraManager />
      </Canvas>
    </div>
  );
};
