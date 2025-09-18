import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, BufferAttribute } from 'three';
import * as THREE from 'three';

interface SimpleParticleTrailsProps {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const SimpleParticleTrails: React.FC<SimpleParticleTrailsProps> = ({
  mousePosition,
  isHovering
}) => {
  const trailPointsRef = useRef<Points>(null);
  const trailHistory = useRef<{ x: number; y: number; z: number; age: number }[]>([]);

  // Simple trail geometry
  const trailGeometry = useMemo(() => {
    const maxTrailPoints = 30;
    const positions = new Float32Array(maxTrailPoints * 3);
    const alphas = new Float32Array(maxTrailPoints);

    for (let i = 0; i < maxTrailPoints; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      alphas[i] = 0;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('alpha', new BufferAttribute(alphas, 1));
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Only add trail points when hovering
    if (isHovering && trailPointsRef.current) {
      // Add new trail point
      trailHistory.current.push({
        x: mousePosition.x * 15,
        y: mousePosition.y * 15,
        z: 8 + Math.sin(time * 3) * 1,
        age: 0
      });

      // Age existing points and remove old ones
      trailHistory.current = trailHistory.current
        .map(point => ({ ...point, age: point.age + 0.05 }))
        .filter(point => point.age < 1.0);

      // Keep only recent points
      if (trailHistory.current.length > 30) {
        trailHistory.current = trailHistory.current.slice(-30);
      }

      // Update geometry
      const positions = trailGeometry.attributes.position.array as Float32Array;
      const alphas = trailGeometry.attributes.alpha.array as Float32Array;

      // Clear arrays
      positions.fill(0);
      alphas.fill(0);

      trailHistory.current.forEach((point, i) => {
        if (i < 30) {
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
          alphas[i] = (1.0 - point.age) * 0.6;
        }
      });

      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.alpha.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Simple mouse trail */}
      <points ref={trailPointsRef} geometry={trailGeometry}>
        <pointsMaterial
          size={3}
          sizeAttenuation={true}
          color="#00ff88"
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={useMemo(() => {
              const positions = new Float32Array(50 * 3);
              for (let i = 0; i < 50; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 80;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
              }
              return positions;
            }, [])}
            count={50}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation={true}
          color="#88aaff"
          transparent={true}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};