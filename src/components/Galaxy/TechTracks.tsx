import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Group, Mesh, Vector3, CatmullRomCurve3, TextureLoader, RepeatWrapping, Color } from 'three';
import { MeshPhysicalMaterial } from 'three';

interface TechTracksProps {
  lanes?: number;
  radius?: number;
  planetRadius?: number;
}

export const TechTracks: React.FC<TechTracksProps> = ({
  lanes = 4,
  radius = 7,
  planetRadius = 5
}) => {
  const groupRef = useRef<Group>(null);

  // Create a simple stripe texture procedurally
  const stripeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(35, 166, 255, 0)');
    gradient.addColorStop(0.3, 'rgba(35, 166, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(113, 255, 204, 0.8)');
    gradient.addColorStop(1, 'rgba(113, 255, 204, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add bright streaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(canvas.width * 0.1, canvas.height * 0.4, canvas.width * 0.05, canvas.height * 0.2);
    ctx.fillRect(canvas.width * 0.6, canvas.height * 0.4, canvas.width * 0.03, canvas.height * 0.2);

    const texture = new TextureLoader().load(canvas.toDataURL());
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 1);

    return texture;
  }, []);

  // Generate lane curves with variations
  const curves = useMemo(() => {
    const trackCurves: CatmullRomCurve3[] = [];

    for (let i = 0; i < lanes; i++) {
      const laneRadius = radius + i * 0.5 + (i % 2 ? 0.15 : -0.15); // Slight variation
      const points: Vector3[] = [];

      // Generate points around the equator with slight vertical noise
      for (let k = 0; k < 200; k++) {
        const t = (k / 200) * Math.PI * 2;
        // Add tiny vertical noise so lanes don't look perfectly flat
        const y = Math.sin(t * 3 + i) * 0.08;
        const x = Math.cos(t) * laneRadius;
        const z = Math.sin(t) * laneRadius;

        points.push(new Vector3(x, y, z));
      }

      trackCurves.push(new CatmullRomCurve3(points, true, 'catmullrom', 0.0));
    }

    return trackCurves;
  }, [lanes, radius]);

  // Animate stripe flow
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshPhysicalMaterial) {
          if (child.material.map) {
            child.material.map.offset.x += delta * 0.15;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, index) => (
        <mesh key={index} castShadow receiveShadow>
          <tubeGeometry args={[curve, 800, 0.18, 24, true]} />
          <meshPhysicalMaterial
            transmission={0.9}
            thickness={0.25}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            ior={1.2}
            map={stripeTexture}
            transparent={true}
            envMapIntensity={1.2}
            color={new Color('#e8f4ff')}
          />
        </mesh>
      ))}
    </group>
  );
};