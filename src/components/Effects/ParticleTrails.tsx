import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, PointsMaterial, BufferAttribute, ShaderMaterial, AdditiveBlending } from 'three';
import * as THREE from 'three';

interface ParticleTrailsProps {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  selectedPlanetId: string | null;
}

export const ParticleTrails: React.FC<ParticleTrailsProps> = ({
  mousePosition,
  isHovering,
  selectedPlanetId
}) => {
  const trailPointsRef = useRef<Points>(null);
  const interactionPointsRef = useRef<Points>(null);
  const trailHistory = useRef<{ x: number; y: number; z: number; age: number }[]>([]);

  // Enhanced particle trail shader
  const trailMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0.5 },
        mousePos: { value: new THREE.Vector3() }
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        attribute vec3 customColor;

        varying float vAlpha;
        varying vec3 vColor;

        uniform float time;
        uniform vec3 mousePos;

        void main() {
          vAlpha = alpha;
          vColor = customColor;

          // Dynamic size based on distance to mouse
          float distToMouse = distance(position, mousePos);
          float sizeMultiplier = 1.0 + (1.0 / (1.0 + distToMouse * 0.1));

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * sizeMultiplier * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          // Create soft circular particles
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);

          if (dist > 0.5) discard;

          // Soft falloff
          float alpha = (1.0 - dist * 2.0) * vAlpha;

          // Add sparkle effect
          float sparkle = sin(time * 10.0 + dist * 20.0) * 0.3 + 0.7;

          gl_FragColor = vec4(vColor * sparkle, alpha);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Generate mouse trail particles
  const trailGeometry = useMemo(() => {
    const maxTrailPoints = 100;
    const positions = new Float32Array(maxTrailPoints * 3);
    const sizes = new Float32Array(maxTrailPoints);
    const alphas = new Float32Array(maxTrailPoints);
    const colors = new Float32Array(maxTrailPoints * 3);

    for (let i = 0; i < maxTrailPoints; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      sizes[i] = Math.random() * 3 + 1;
      alphas[i] = 0;

      // Rainbow trail colors
      const hue = (i / maxTrailPoints) * 0.3 + 0.5;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('size', new BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new BufferAttribute(alphas, 1));
    geo.setAttribute('customColor', new BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Generate interaction burst particles
  const interactionGeometry = useMemo(() => {
    const burstCount = 50;
    const positions = new Float32Array(burstCount * 3);
    const sizes = new Float32Array(burstCount);
    const alphas = new Float32Array(burstCount);
    const colors = new Float32Array(burstCount * 3);

    for (let i = 0; i < burstCount; i++) {
      // Spherical distribution around origin
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 5 + 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      sizes[i] = Math.random() * 4 + 2;
      alphas[i] = Math.random() * 0.8 + 0.2;

      // Gold and blue burst colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 1.0;      // Gold
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.2;
      } else {
        colors[i * 3] = 0.2;      // Blue
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('size', new BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new BufferAttribute(alphas, 1));
    geo.setAttribute('customColor', new BufferAttribute(colors, 3));
    return geo;
  }, [selectedPlanetId]); // Regenerate when planet selection changes

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update shader uniforms
    if (trailMaterial) {
      trailMaterial.uniforms.time.value = time;
      trailMaterial.uniforms.mousePos.value.set(
        mousePosition.x * 15,
        mousePosition.y * 15,
        8
      );
      trailMaterial.uniforms.intensity.value = isHovering ? 2.0 : 1.0;
    }

    // Update mouse trail
    if (trailPointsRef.current) {
      // Add new trail point
      trailHistory.current.push({
        x: mousePosition.x * 15,
        y: mousePosition.y * 15,
        z: 8 + Math.sin(time * 2) * 2,
        age: 0
      });

      // Age existing points and remove old ones
      trailHistory.current = trailHistory.current
        .map(point => ({ ...point, age: point.age + 0.02 }))
        .filter(point => point.age < 1.0);

      // Keep only recent points
      if (trailHistory.current.length > 100) {
        trailHistory.current = trailHistory.current.slice(-100);
      }

      // Update geometry
      const positions = trailGeometry.attributes.position.array as Float32Array;
      const alphas = trailGeometry.attributes.alpha.array as Float32Array;

      trailHistory.current.forEach((point, i) => {
        if (i < 100) {
          positions[i * 3] = point.x;
          positions[i * 3 + 1] = point.y;
          positions[i * 3 + 2] = point.z;
          alphas[i] = (1.0 - point.age) * (isHovering ? 0.8 : 0.4);
        }
      });

      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.alpha.needsUpdate = true;
    }

    // Animate interaction burst
    if (interactionPointsRef.current && selectedPlanetId) {
      const positions = interactionGeometry.attributes.position.array as Float32Array;
      const alphas = interactionGeometry.attributes.alpha.array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        // Expand particles outward
        positions[i * 3] *= 1.02;
        positions[i * 3 + 1] *= 1.02;
        positions[i * 3 + 2] *= 1.02;

        // Fade out
        alphas[i] *= 0.98;
      }

      interactionGeometry.attributes.position.needsUpdate = true;
      interactionGeometry.attributes.alpha.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Mouse trail particles */}
      <points ref={trailPointsRef} geometry={trailGeometry}>
        <primitive object={trailMaterial} />
      </points>

      {/* Interaction burst particles */}
      {selectedPlanetId && (
        <points ref={interactionPointsRef} geometry={interactionGeometry}>
          <primitive object={trailMaterial} />
        </points>
      )}

      {/* Additional floating particles for ambiance */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={useMemo(() => {
              const positions = new Float32Array(50 * 3);
              for (let i = 0; i < 50; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
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
          opacity={0.3}
          blending={AdditiveBlending}
        />
      </points>
    </>
  );
};