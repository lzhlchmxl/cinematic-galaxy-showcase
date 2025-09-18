import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, DirectionalLight, SpotLight, ShaderMaterial, AdditiveBlending, Mesh } from 'three';
import * as THREE from 'three';
import type { InteractionState } from '../../types/galaxy.types';

interface DynamicLightingProps {
  mousePosition: { x: number; y: number };
  interactionState: InteractionState;
  earthPosition?: { x: number; y: number; z: number };
}

export const DynamicLighting: React.FC<DynamicLightingProps> = ({
  mousePosition,
  interactionState,
  earthPosition
}) => {
  const mouseLightRef = useRef<PointLight>(null);
  const mainLightRef = useRef<DirectionalLight>(null);
  const rimLightRef = useRef<DirectionalLight>(null);
  const spotLightRef = useRef<SpotLight>(null);
  const volumetricRayRef = useRef<Mesh>(null);

  // Volumetric ray shader material
  const volumetricMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        lightPosition: { value: new THREE.Vector3(0, 0, 0) },
        rayIntensity: { value: 0.3 },
        rayColor: { value: new THREE.Color('#88aaff') }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        uniform vec3 lightPosition;

        void main() {
          vPosition = position;
          vNormal = normal;

          // Add subtle vertex displacement for organic feel
          vec3 displaced = position + normal * sin(position.y * 0.1 + time) * 0.1;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 lightPosition;
        uniform float rayIntensity;
        uniform vec3 rayColor;

        varying vec3 vPosition;
        varying vec3 vNormal;

        float noise(vec3 p) {
          return sin(p.x * 3.0 + time) * sin(p.y * 2.0 + time * 0.7) * sin(p.z * 1.5 + time * 0.3);
        }

        void main() {
          // Calculate distance to light for falloff
          float dist = distance(vPosition, lightPosition);
          float falloff = 1.0 / (1.0 + dist * 0.02);

          // Create volumetric ray effect
          float ray = abs(dot(normalize(vPosition - lightPosition), vNormal));
          ray = pow(ray, 2.0);

          // Add noise for organic movement
          float n = noise(vPosition + time * 0.5) * 0.3 + 0.7;

          // Final intensity
          float intensity = ray * falloff * rayIntensity * n;

          gl_FragColor = vec4(rayColor, intensity);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Mouse-following point light
    if (mouseLightRef.current) {
      mouseLightRef.current.position.x = mousePosition.x * 15;
      mouseLightRef.current.position.y = mousePosition.y * 15;
      mouseLightRef.current.position.z = 8;

      // Enhanced intensity based on interaction
      const baseIntensity = interactionState.isHovering ? 1.2 : 0.6;
      mouseLightRef.current.intensity = baseIntensity + Math.sin(time * 3) * 0.3;

      // Dynamic color shifts
      const hue = (time * 0.05 + mousePosition.x * 0.1) % 1;
      mouseLightRef.current.color.setHSL(hue, 0.4, 1);
    }

    // Main directional light with cinematic movement
    if (mainLightRef.current) {
      mainLightRef.current.position.x = 20 + Math.sin(time * 0.15) * 8;
      mainLightRef.current.position.y = 20 + Math.cos(time * 0.12) * 6;
      mainLightRef.current.position.z = 10 + Math.sin(time * 0.1) * 4;
      mainLightRef.current.intensity = 0.9 + Math.sin(time * 0.25) * 0.1;
    }

    // Enhanced rim light with color cycling
    if (rimLightRef.current) {
      rimLightRef.current.position.x = -15 + Math.cos(time * 0.08) * 5;
      rimLightRef.current.position.y = 10 + Math.sin(time * 0.06) * 4;
      rimLightRef.current.position.z = -15 + Math.cos(time * 0.1) * 3;

      // Color shifting between blue and purple
      const rimHue = 0.6 + Math.sin(time * 0.2) * 0.1;
      rimLightRef.current.color.setHSL(rimHue, 0.8, 1);
    }

    // Dramatic spotlight with sweeping motion
    if (spotLightRef.current) {
      const sweepAngle = time * 0.1;
      spotLightRef.current.position.x = Math.cos(sweepAngle) * 25;
      spotLightRef.current.position.y = 15 + Math.sin(time * 0.3) * 5;
      spotLightRef.current.position.z = Math.sin(sweepAngle) * 25;

      // Point towards center with slight offset
      spotLightRef.current.target.position.set(
        Math.sin(time * 0.05) * 5,
        Math.cos(time * 0.05) * 5,
        0
      );

      // Intensity pulses
      spotLightRef.current.intensity = 0.8 + Math.sin(time * 2) * 0.4;
    }

    // Update volumetric ray material
    if (volumetricMaterial) {
      volumetricMaterial.uniforms.time.value = time;
      volumetricMaterial.uniforms.lightPosition.value.set(
        mousePosition.x * 15,
        mousePosition.y * 15,
        8
      );
      volumetricMaterial.uniforms.rayIntensity.value =
        interactionState.isHovering ? 0.6 : 0.2;
    }

    // Animate volumetric ray geometry
    if (volumetricRayRef.current) {
      volumetricRayRef.current.rotation.y = time * 0.1;
      volumetricRayRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <>
      {/* Reduced ambient for better contrast */}
      <ambientLight intensity={0.08} color="#001122" />

      {/* Enhanced main directional light - cinematic warm white */}
      <directionalLight
        ref={mainLightRef}
        position={[15, 15, 5]}
        intensity={earthPosition ? 1.2 : 0.9}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />

      {/* Subtle rim light for depth - reduced intensity */}
      <directionalLight
        ref={rimLightRef}
        position={[-10, 5, -10]}
        intensity={0.15}
        color="#4488ff"
      />

      {/* Subtle mouse-following point light */}
      <pointLight
        ref={mouseLightRef}
        position={[0, 0, 8]}
        intensity={0.25}
        distance={30}
        decay={2}
        color="#fff8f0"
      />

      {/* Reduced atmospheric lights */}
      <pointLight
        position={[0, 20, 0]}
        intensity={0.1}
        distance={40}
        decay={2}
        color="#ff6600"
      />

      <pointLight
        position={[0, -20, 0]}
        intensity={0.08}
        distance={35}
        decay={2}
        color="#0066ff"
      />

      {/* Subtle cinematic spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[25, 15, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.2}
        distance={60}
        decay={2}
        color="#ffaa44"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Temporarily disabled volumetric rays to debug flickering */}
      {/* <mesh ref={volumetricRayRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 1, 20, 12, 1, true]} />
        <primitive object={volumetricMaterial} />
      </mesh> */}

      {/* Cosmic background light */}
      <hemisphereLight
        args={["#001155", "#000022", 0.15]}
      />

      {/* Minimal atmospheric point lights */}
      <pointLight
        position={[30, 0, 15]}
        intensity={0.12}
        distance={50}
        decay={2}
        color="#aa44ff"
      />

      <pointLight
        position={[-25, 15, -10]}
        intensity={0.1}
        distance={45}
        decay={2}
        color="#44ffaa"
      />

      {/* Minimal fill light */}
      <directionalLight
        position={[0, -20, 10]}
        intensity={0.08}
        color="#4488aa"
      />
    </>
  );
};