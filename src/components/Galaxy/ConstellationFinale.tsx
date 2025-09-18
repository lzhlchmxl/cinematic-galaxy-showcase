import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointsMaterial, Vector3 } from 'three';
import * as THREE from 'three';

interface ConstellationFinaleProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const ConstellationFinale: React.FC<ConstellationFinaleProps> = ({
  isActive,
  onComplete
}) => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const { camera } = useThree();

  // Define constellation points for "BILL LIANG"
  const { positions, targetPositions, colors } = useMemo(() => {
    const letterSpacing = 6;
    const startX = -20;
    const startY = 0;

    const allPoints: Vector3[] = [];

    // B
    const bPoints = [
      new Vector3(startX, startY + 4, 0),
      new Vector3(startX, startY + 2, 0),
      new Vector3(startX, startY, 0),
      new Vector3(startX, startY - 2, 0),
      new Vector3(startX, startY - 4, 0),
      new Vector3(startX + 2, startY + 4, 0),
      new Vector3(startX + 3, startY + 3, 0),
      new Vector3(startX + 3, startY + 1, 0),
      new Vector3(startX + 2, startY, 0),
      new Vector3(startX + 3, startY - 1, 0),
      new Vector3(startX + 3, startY - 3, 0),
      new Vector3(startX + 2, startY - 4, 0)
    ];

    // I
    const iPoints = [
      new Vector3(startX + letterSpacing, startY + 4, 0),
      new Vector3(startX + letterSpacing + 1, startY + 4, 0),
      new Vector3(startX + letterSpacing + 2, startY + 4, 0),
      new Vector3(startX + letterSpacing + 1, startY + 2, 0),
      new Vector3(startX + letterSpacing + 1, startY, 0),
      new Vector3(startX + letterSpacing + 1, startY - 2, 0),
      new Vector3(startX + letterSpacing, startY - 4, 0),
      new Vector3(startX + letterSpacing + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing + 2, startY - 4, 0)
    ];

    // L
    const l1Points = [
      new Vector3(startX + letterSpacing * 2, startY + 4, 0),
      new Vector3(startX + letterSpacing * 2, startY + 2, 0),
      new Vector3(startX + letterSpacing * 2, startY, 0),
      new Vector3(startX + letterSpacing * 2, startY - 2, 0),
      new Vector3(startX + letterSpacing * 2, startY - 4, 0),
      new Vector3(startX + letterSpacing * 2 + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing * 2 + 2, startY - 4, 0),
      new Vector3(startX + letterSpacing * 2 + 3, startY - 4, 0)
    ];

    // L
    const l2Points = [
      new Vector3(startX + letterSpacing * 3, startY + 4, 0),
      new Vector3(startX + letterSpacing * 3, startY + 2, 0),
      new Vector3(startX + letterSpacing * 3, startY, 0),
      new Vector3(startX + letterSpacing * 3, startY - 2, 0),
      new Vector3(startX + letterSpacing * 3, startY - 4, 0),
      new Vector3(startX + letterSpacing * 3 + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing * 3 + 2, startY - 4, 0),
      new Vector3(startX + letterSpacing * 3 + 3, startY - 4, 0)
    ];

    // L
    const l3Points = [
      new Vector3(startX + letterSpacing * 5, startY + 4, 0),
      new Vector3(startX + letterSpacing * 5, startY + 2, 0),
      new Vector3(startX + letterSpacing * 5, startY, 0),
      new Vector3(startX + letterSpacing * 5, startY - 2, 0),
      new Vector3(startX + letterSpacing * 5, startY - 4, 0),
      new Vector3(startX + letterSpacing * 5 + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing * 5 + 2, startY - 4, 0),
      new Vector3(startX + letterSpacing * 5 + 3, startY - 4, 0)
    ];

    // I
    const i2Points = [
      new Vector3(startX + letterSpacing * 6, startY + 4, 0),
      new Vector3(startX + letterSpacing * 6 + 1, startY + 4, 0),
      new Vector3(startX + letterSpacing * 6 + 2, startY + 4, 0),
      new Vector3(startX + letterSpacing * 6 + 1, startY + 2, 0),
      new Vector3(startX + letterSpacing * 6 + 1, startY, 0),
      new Vector3(startX + letterSpacing * 6 + 1, startY - 2, 0),
      new Vector3(startX + letterSpacing * 6, startY - 4, 0),
      new Vector3(startX + letterSpacing * 6 + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing * 6 + 2, startY - 4, 0)
    ];

    // A
    const aPoints = [
      new Vector3(startX + letterSpacing * 7.5, startY + 4, 0),
      new Vector3(startX + letterSpacing * 7, startY + 2, 0),
      new Vector3(startX + letterSpacing * 7, startY, 0),
      new Vector3(startX + letterSpacing * 7, startY - 2, 0),
      new Vector3(startX + letterSpacing * 7, startY - 4, 0),
      new Vector3(startX + letterSpacing * 8, startY + 2, 0),
      new Vector3(startX + letterSpacing * 8, startY, 0),
      new Vector3(startX + letterSpacing * 8, startY - 2, 0),
      new Vector3(startX + letterSpacing * 8, startY - 4, 0),
      new Vector3(startX + letterSpacing * 7 + 1, startY, 0)
    ];

    // N
    const nPoints = [
      new Vector3(startX + letterSpacing * 9, startY + 4, 0),
      new Vector3(startX + letterSpacing * 9, startY + 2, 0),
      new Vector3(startX + letterSpacing * 9, startY, 0),
      new Vector3(startX + letterSpacing * 9, startY - 2, 0),
      new Vector3(startX + letterSpacing * 9, startY - 4, 0),
      new Vector3(startX + letterSpacing * 9 + 1, startY + 3, 0),
      new Vector3(startX + letterSpacing * 9 + 2, startY + 2, 0),
      new Vector3(startX + letterSpacing * 9 + 2, startY + 1, 0),
      new Vector3(startX + letterSpacing * 9 + 3, startY + 4, 0),
      new Vector3(startX + letterSpacing * 9 + 3, startY + 2, 0),
      new Vector3(startX + letterSpacing * 9 + 3, startY, 0),
      new Vector3(startX + letterSpacing * 9 + 3, startY - 2, 0),
      new Vector3(startX + letterSpacing * 9 + 3, startY - 4, 0)
    ];

    // G
    const gPoints = [
      new Vector3(startX + letterSpacing * 10.5, startY + 4, 0),
      new Vector3(startX + letterSpacing * 10.5 + 1, startY + 4, 0),
      new Vector3(startX + letterSpacing * 10.5 + 2, startY + 4, 0),
      new Vector3(startX + letterSpacing * 10.5, startY + 2, 0),
      new Vector3(startX + letterSpacing * 10.5, startY, 0),
      new Vector3(startX + letterSpacing * 10.5, startY - 2, 0),
      new Vector3(startX + letterSpacing * 10.5, startY - 4, 0),
      new Vector3(startX + letterSpacing * 10.5 + 1, startY - 4, 0),
      new Vector3(startX + letterSpacing * 10.5 + 2, startY - 4, 0),
      new Vector3(startX + letterSpacing * 10.5 + 2, startY - 2, 0),
      new Vector3(startX + letterSpacing * 10.5 + 2, startY, 0),
      new Vector3(startX + letterSpacing * 10.5 + 1, startY, 0)
    ];

    // Combine all letters
    allPoints.push(...bPoints, ...iPoints, ...l1Points, ...l2Points, ...l3Points,
                   ...i2Points, ...aPoints, ...nPoints, ...gPoints);

    const count = allPoints.length;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start positions (scattered)
      const spherical = new THREE.Spherical(
        50 + Math.random() * 100,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      const startPos = new Vector3().setFromSpherical(spherical);

      positions[i * 3] = startPos.x;
      positions[i * 3 + 1] = startPos.y;
      positions[i * 3 + 2] = startPos.z;

      // Target positions (constellation)
      targetPositions[i * 3] = allPoints[i].x;
      targetPositions[i * 3 + 1] = allPoints[i].y;
      targetPositions[i * 3 + 2] = allPoints[i].z;

      // Golden color
      colors[i * 3] = 1.0;     // R
      colors[i * 3 + 1] = 0.8; // G
      colors[i * 3 + 2] = 0.2; // B
    }

    return { positions, targetPositions, colors };
  }, []);

  // Animation progress
  const animationProgress = useRef(0);
  const animationSpeed = useRef(0);

  useEffect(() => {
    if (isActive) {
      animationSpeed.current = 1;
      // Move camera to optimal viewing position
      camera.position.set(0, 0, 40);
      camera.lookAt(0, 0, 0);
    } else {
      animationSpeed.current = 0;
      animationProgress.current = 0;
    }
  }, [isActive, camera]);

  useFrame((state, delta) => {
    if (pointsRef.current && isActive) {
      const positions = pointsRef.current.geometry.attributes.position;
      animationProgress.current += delta * animationSpeed.current;

      // Smooth easing function
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const progress = Math.min(animationProgress.current / 3, 1); // 3 second animation
      const easedProgress = easeInOutCubic(progress);

      for (let i = 0; i < positions.count; i++) {
        const startX = positions.array[i * 3];
        const startY = positions.array[i * 3 + 1];
        const startZ = positions.array[i * 3 + 2];

        const targetX = targetPositions[i * 3];
        const targetY = targetPositions[i * 3 + 1];
        const targetZ = targetPositions[i * 3 + 2];

        positions.array[i * 3] = startX + (targetX - startX) * easedProgress;
        positions.array[i * 3 + 1] = startY + (targetY - startY) * easedProgress;
        positions.array[i * 3 + 2] = startZ + (targetZ - startZ) * easedProgress;
      }

      positions.needsUpdate = true;

      // Sparkle effect when animation completes
      if (progress >= 1 && materialRef.current) {
        const time = state.clock.getElapsedTime();
        materialRef.current.opacity = 0.8 + Math.sin(time * 4) * 0.2;

        if (onComplete && animationProgress.current > 4) {
          onComplete();
        }
      }
    }
  });

  if (!isActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={3}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};