import React, { useMemo } from 'react';
import * as THREE from 'three';

// Procedural Asphalt Texture Generator with Cracks & Noise
const createAsphaltCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base Dark Concrete
  ctx.fillStyle = '#141824';
  ctx.fillRect(0, 0, 512, 512);

  // Noise & Gravel specks
  for (let i = 0; i < 25000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 40) + 15;
    ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Major Earthquake Fractures / Cracks
  ctx.strokeStyle = '#05070c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let cx = 100, cy = 0;
  ctx.moveTo(cx, cy);
  while (cy < 512) {
    cx += (Math.random() - 0.5) * 40;
    cy += Math.random() * 30 + 10;
    ctx.lineTo(cx, cy);
  }
  ctx.stroke();

  // Secondary crack
  ctx.beginPath();
  let c2x = 380, c2y = 0;
  ctx.moveTo(c2x, c2y);
  while (c2y < 512) {
    c2x += (Math.random() - 0.5) * 35;
    c2y += Math.random() * 25 + 10;
    ctx.lineTo(c2x, c2y);
  }
  ctx.stroke();

  // Yellow Road Markings (Worn & Broken)
  ctx.fillStyle = '#eab308';
  ctx.globalAlpha = 0.45;
  for (let y = 20; y < 512; y += 70) {
    if (Math.random() > 0.3) {
      ctx.fillRect(250, y, 12, 45);
    }
  }

  return new THREE.CanvasTexture(canvas);
};

export const GroundTerrain: React.FC = () => {
  const { geometry, asphaltTexture } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(180, 180, 80, 80);
    geo.rotateX(-Math.PI / 2);
    
    // Natural seismic terrain deformation
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      let y = (Math.sin(x * 0.06) * Math.cos(z * 0.06)) * 0.8;
      
      // Earthquake fault line trench
      if (Math.abs(z - 8.0) < 7.0) {
        y -= 1.1 + Math.sin(x * 0.2) * 0.5;
      }
      // Crater near fire sector
      const distFire = Math.hypot(x - (-20), z - 5);
      if (distFire < 9) {
        y -= (9 - distFire) * 0.15;
      }

      pos.setY(i, y);
    }
    geo.computeVertexNormals();

    const tex = createAsphaltCanvas();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);

    return { geometry: geo, asphaltTexture: tex };
  }, []);

  return (
    <group>
      {/* Textured Realistic Asphalt Ground */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial 
          map={asphaltTexture}
          roughness={0.88} 
          metalness={0.12}
          flatShading={false}
        />
      </mesh>

      {/* Concrete Sidewalk Curbs along Main Road */}
      {[-18, 18].map((curbX, idx) => (
        <mesh key={idx} position={[curbX, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.2, 0.35, 160]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      ))}

      {/* Subtle Tactical Blue Grid Line */}
      <gridHelper 
        args={[180, 45, '#00e5ff', '#1e293b']} 
        position={[0, 0.03, 0]} 
      />
    </group>
  );
};
