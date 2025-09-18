import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import type { PlanetProps } from '../../types/founder.types';

export const BasicPlanet: React.FC<PlanetProps> = ({
  founder,
  onHover,
  onClick,
  isHovered
}) => {
  const meshRef = useRef<Mesh>(null);
  const [rotationSpeed] = useState(() => 0.01 + Math.random() * 0.02);

  // Animate planet rotation and hover effects
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.y += rotationSpeed * delta;

      // Hover scale animation
      const targetScale = isHovered ? 1.2 : 1.0;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      meshRef.current.scale.setScalar(newScale);

      // Subtle bobbing animation
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = founder.position.y + Math.sin(time + founder.position.x) * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={founder.position}
      onClick={() => onClick(founder)}
      onPointerOver={() => onHover(founder)}
      onPointerOut={() => onHover(null)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={founder.color}
        emissive={founder.color}
        emissiveIntensity={isHovered ? 0.3 : 0.1}
        roughness={0.3}
        metalness={0.7}
      />

      {/* Orbital ring for visual interest */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 32]} />
        <meshBasicMaterial
          color={founder.color}
          transparent
          opacity={isHovered ? 0.6 : 0.3}
        />
      </mesh>
    </mesh>
  );
};