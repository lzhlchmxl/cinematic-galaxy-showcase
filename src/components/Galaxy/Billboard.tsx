import React, { useMemo } from 'react';
import { CanvasTexture, Color } from 'three';
import * as THREE from 'three';

interface BillboardProps {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const Billboard: React.FC<BillboardProps> = ({
  text,
  position = [0, 1.8, 0],
  rotation = [THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(25), 0],
  scale = 1.0
}) => {
  // Dynamic texture from canvas for customizable text
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#23a6ff');
    gradient.addColorStop(1, '#71ffcc');

    // Dark background
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply gradient text
    ctx.fillStyle = gradient;
    ctx.font = 'bold 140px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [text]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Support pole */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.6, 12]} />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.3}
          color="#9fb2c8"
        />
      </mesh>

      {/* Billboard panel */}
      <mesh castShadow>
        <planeGeometry args={[3.0, 0.8]} />
        <meshStandardMaterial
          map={canvasTexture}
          emissiveMap={canvasTexture}
          emissiveIntensity={1.6}
          emissive={new Color('#7fe7ff')}
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Support braces */}
      <mesh position={[0, -0.45, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.015, 8, 24]} />
        <meshStandardMaterial
          metalness={0.8}
          roughness={0.3}
          color="#9fb2c8"
        />
      </mesh>
    </group>
  );
};