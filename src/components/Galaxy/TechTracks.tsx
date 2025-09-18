import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, CatmullRomCurve3, CanvasTexture, RepeatWrapping, Color } from 'three';

interface TechTracksProps {
  lanes?: number;
  radius?: number;
  planetRadius?: number;
}

export const TechTracks: React.FC<TechTracksProps> = ({
  lanes = 4,
  radius = 1.4
}) => {
  const groupRef = useRef<Group>(null);

  // Create asphalt race track texture with animated flowing dashed lines
  const { raceTrackTexture, emissiveTexture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Dark asphalt background
    ctx.fillStyle = '#181A1F'; // Very dark gray/black for asphalt
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create the base track texture
    const baseTexture = new CanvasTexture(canvas);
    baseTexture.wrapS = baseTexture.wrapT = RepeatWrapping;
    baseTexture.repeat.set(1, 1);

    // Create emissive texture for dashed lines
    const emissiveCanvas = document.createElement('canvas');
    emissiveCanvas.width = 1024;
    emissiveCanvas.height = 64;
    const emissiveCtx = emissiveCanvas.getContext('2d')!;

    // Transparent background
    emissiveCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    emissiveCtx.fillRect(0, 0, emissiveCanvas.width, emissiveCanvas.height);

    // White dashed center line
    emissiveCtx.strokeStyle = '#ffffff';
    emissiveCtx.lineWidth = 4;
    emissiveCtx.setLineDash([30, 20]); // Longer dashes for race track effect

    // Draw center line
    emissiveCtx.beginPath();
    emissiveCtx.moveTo(0, emissiveCanvas.height / 2);
    emissiveCtx.lineTo(emissiveCanvas.width, emissiveCanvas.height / 2);
    emissiveCtx.stroke();

    // Optional: Add subtle blue-cyan glow around dashes
    emissiveCtx.globalCompositeOperation = 'source-over';
    emissiveCtx.strokeStyle = 'rgba(35, 166, 255, 0.6)';
    emissiveCtx.lineWidth = 6;
    emissiveCtx.setLineDash([30, 20]);
    emissiveCtx.beginPath();
    emissiveCtx.moveTo(0, emissiveCanvas.height / 2);
    emissiveCtx.lineTo(emissiveCanvas.width, emissiveCanvas.height / 2);
    emissiveCtx.stroke();

    const emissiveTexture = new CanvasTexture(emissiveCanvas);
    emissiveTexture.wrapS = emissiveTexture.wrapT = RepeatWrapping;
    emissiveTexture.repeat.set(100, 1); // High repetition for flowing effect

    return { raceTrackTexture: baseTexture, emissiveTexture };
  }, []);

  // Generate 4 lane curves at 1.4 radius from planet center
  const curves = useMemo(() => {
    const trackCurves: CatmullRomCurve3[] = [];

    for (let i = 0; i < lanes; i++) {
      // Space lanes out more to prevent overlapping
      const laneRadius = radius + i * 0.25; // Increased spacing between lanes
      const points: Vector3[] = [];

      // Generate points around the equator for smooth continuous paths
      for (let k = 0; k < 800; k++) { // 800 segments as specified
        const t = (k / 800) * Math.PI * 2;
        // Minimal vertical variation to keep tracks orbital
        const y = Math.sin(t * 2 + i) * 0.02;
        const x = Math.cos(t) * laneRadius;
        const z = Math.sin(t) * laneRadius;

        points.push(new Vector3(x, y, z));
      }

      trackCurves.push(new CatmullRomCurve3(points, true, 'catmullrom', 0.0));
    }

    return trackCurves;
  }, [lanes, radius]);

  // Animate flowing dashed lines
  useFrame((_, delta) => {
    if (emissiveTexture) {
      emissiveTexture.offset.x += delta * 0.15; // Continuous horizontal scroll as specified
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, index) => (
        <mesh key={index} castShadow receiveShadow>
          <tubeGeometry
            args={[
              curve,
              800, // 800 segments as specified
              0.08, // Reduced radius to make tracks thinner
              16,  // Reduced radial segments for performance
              false
            ]}
          />
          <meshStandardMaterial
            map={raceTrackTexture}
            emissiveMap={emissiveTexture}
            color={new Color('#181A1F')} // Dark asphalt color as specified
            emissive={new Color('#ffffff')} // White emissive for dashed lines
            emissiveIntensity={0.8}
            roughness={0.8} // High roughness for asphalt (0.7-0.9 range)
            metalness={0.02} // Very low metalness (0.0-0.05 range)
          />
        </mesh>
      ))}
    </group>
  );
};