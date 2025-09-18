import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { galaxyConfig } from '../../data/founders';

interface CameraControllerProps {
  autoRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  autoRotate = true,
  enableZoom = true,
  enablePan = false
}) => {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera, gl } = useThree();

  // Auto-rotation when not interacting
  useFrame(() => {
    if (controlsRef.current && autoRotate) {
      // Only auto-rotate if user isn't actively interacting
      if (!controlsRef.current.autoRotate) {
        const timeSinceLastInteraction = Date.now() - (controlsRef.current as any).lastInteraction;
        if (timeSinceLastInteraction > 3000) { // 3 seconds of inactivity
          controlsRef.current.autoRotate = true;
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      autoRotate={autoRotate}
      autoRotateSpeed={galaxyConfig.autoRotationSpeed * 100}
      enableZoom={enableZoom}
      enablePan={enablePan}
      minDistance={galaxyConfig.minZoom}
      maxDistance={galaxyConfig.maxZoom}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      dampingFactor={0.05}
      enableDamping={true}
      onStart={() => {
        // Disable auto-rotation when user starts interacting
        if (controlsRef.current) {
          controlsRef.current.autoRotate = false;
          (controlsRef.current as any).lastInteraction = Date.now();
        }
      }}
      onChange={() => {
        // Update last interaction time
        if (controlsRef.current) {
          (controlsRef.current as any).lastInteraction = Date.now();
        }
      }}
    />
  );
};