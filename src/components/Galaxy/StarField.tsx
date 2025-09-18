import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, PointsMaterial, BufferAttribute, Mesh, CanvasTexture } from 'three';
import * as THREE from 'three';
// PNG nebula textures replaced with 3D volumetric particle clouds
import { founders } from '../../data/founders';

interface StarFieldProps {
  count?: number;
  radius?: number;
  enableTwinkling?: boolean;
}

// Individual asteroid component with independent rotation
const AsteroidMesh: React.FC<{
  asteroid: {
    position: [number, number, number];
    size: number;
    color: string;
    rotation: [number, number, number];
    rotationSpeed: [number, number, number];
    roughness: number;
    metalness: number;
  };
  geometry: React.ReactNode;
}> = ({ asteroid, geometry }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Apply individual rotation speeds
      meshRef.current.rotation.x += asteroid.rotationSpeed[0] * delta;
      meshRef.current.rotation.y += asteroid.rotationSpeed[1] * delta;
      meshRef.current.rotation.z += asteroid.rotationSpeed[2] * delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={asteroid.position}
      rotation={asteroid.rotation}
      scale={asteroid.size}
    >
      {geometry}
      <meshStandardMaterial
        color={asteroid.color}
        roughness={asteroid.roughness}
        metalness={asteroid.metalness}
        emissive={asteroid.color}
        emissiveIntensity={0.01}
      />
    </mesh>
  );
};

export const StarField: React.FC<StarFieldProps> = ({
  count = 8000,
  radius = 400,
  enableTwinkling = true
}) => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);

  // Create procedural star texture with guaranteed transparency
  const starTextureMap = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Clear to transparent
    ctx.clearRect(0, 0, size, size);

    // Create radial gradient from center
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,    // Inner circle (center)
      size / 2, size / 2, size / 2  // Outer circle (edge)
    );

    // Gradient from solid white center to transparent edge
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  }, []);

  // Create procedural nebula particle texture
  const nebulaTextureMap = useMemo(() => {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Clear to transparent
    ctx.clearRect(0, 0, size, size);

    // Create soft circular gradient for nebula particles
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  }, []);

  // Nebula shader material removed - using texture-based planes instead

  // Generate nebula particle clouds
  const nebulaClouds = useMemo(() => {
    const clouds: any[] = [];

    // Create 3 major nebula regions - closer and more visible
    const nebulaRegions = [
      { center: [-40, 0, -80], color: [0.4, 0.2, 0.6], size: 40 }, // Purple - closer and brighter
      { center: [60, -15, -100], color: [0.1, 0.4, 0.5], size: 35 }, // Blue-teal - closer and brighter
      { center: [25, 20, -120], color: [0.3, 0.15, 0.45], size: 45 }    // Deep purple - closer and brighter
    ];

    nebulaRegions.forEach((region, regionIndex) => {
      // Create multiple layers for volumetric effect
      for (let layer = 0; layer < 4; layer++) {
        const particleCount = 800 - (layer * 150); // Fewer particles in outer layers
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          // Spherical distribution around region center
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = Math.pow(Math.random(), 0.6) * (region.size + layer * 15);

          const x = region.center[0] + r * Math.sin(phi) * Math.cos(theta);
          const y = region.center[1] + r * Math.cos(phi) * 0.3; // Flatten slightly
          const z = region.center[2] + r * Math.sin(phi) * Math.sin(theta);

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          // Color with some variation
          const colorVariation = 0.7 + Math.random() * 0.3;
          colors[i * 3] = region.color[0] * colorVariation;
          colors[i * 3 + 1] = region.color[1] * colorVariation;
          colors[i * 3 + 2] = region.color[2] * colorVariation;

          // Much larger particles for visibility
          const distanceFromCenter = r / (region.size + layer * 15);
          sizes[i] = (8 + Math.random() * 15) * (1.5 - distanceFromCenter) * (1 + layer * 0.5);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(positions, 3));
        geometry.setAttribute('color', new BufferAttribute(colors, 3));
        geometry.setAttribute('size', new BufferAttribute(sizes, 1));

        clouds.push({
          geometry,
          opacity: 0.4 - layer * 0.08, // Much more opaque for visibility
          regionIndex,
          layer
        });
      }
    });

    return clouds;
  }, []);

  // Generate star positions and properties, separating asteroids from distant stars
  const { positions, colors, sizes, asteroids } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const asteroids: Array<{
      position: [number, number, number],
      size: number,
      color: string,
      rotation: [number, number, number],
      rotationSpeed: [number, number, number],
      geometry: string,
      roughness: number,
      metalness: number
    }> = [];

    // Helper function to check if a position is in the inner solar system (asteroid zone)
    const isInAsteroidZone = (x: number, y: number, z: number) => {
      // Check if close to any individual planet
      const planetZone = 10; // Distance threshold around each planet
      const closeToAnyPlanet = founders.some(founder => {
        const dx = x - founder.position.x;
        const dy = y - founder.position.y;
        const dz = z - founder.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance < planetZone;
      });

      // Check if in the central zone between planets (inner galaxy)
      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
      const inInnerGalaxy = distanceFromCenter < 25; // Central asteroid belt

      return closeToAnyPlanet || inInnerGalaxy;
    };

    let starIndex = 0;
    let attempts = 0;
    const maxAttempts = count * 2; // Prevent infinite loop

    while (starIndex < count && attempts < maxAttempts) {
      attempts++;
      // Spiral galaxy distribution instead of spherical
      const spiralArms = 3; // Number of galaxy arms
      const spiralFactor = 0.8; // How tight the spiral is

      // Pick a random arm and position along it
      const armIndex = Math.floor(Math.random() * spiralArms);
      const armAngleOffset = (armIndex * 2 * Math.PI) / spiralArms;

      // Random distance from galactic center (bias toward outer regions)
      const distance = Math.pow(Math.random(), 0.7) * radius * 0.8;

      // Calculate spiral angle
      const angle = armAngleOffset + distance * spiralFactor;

      // Base position on spiral arm
      let x = distance * Math.cos(angle);
      let z = distance * Math.sin(angle);

      // Add significant fuzziness to create thick, organic arms
      const fuzziness = 40 + distance * 0.1; // More fuzziness at outer edges
      x += (Math.random() - 0.5) * fuzziness;
      z += (Math.random() - 0.5) * fuzziness;

      // Y position - flatten the galaxy with some thickness
      const y = (Math.random() - 0.5) * (radius * 0.1); // Much flatter than sphere

      // Check if this position is in the asteroid zone
      if (isInAsteroidZone(x, y, z)) {
        // Create varied asteroid instead of star
        const asteroidSize = 0.03 + Math.random() * 0.2; // More size variation

        // Expanded color palette with more variation
        const rockColors = [
          '#4a4a4a', '#3d3d3d', '#5a5248', '#6b5b3a', '#4a3d32', // Original colors
          '#2d2d2d', '#3a3530', '#4f453b', '#5c5442', '#3f2f25', // Darker variants
          '#6a6a6a', '#5d5d5d', '#6f5f4f', '#7a6a5a', '#524238'  // Lighter variants
        ];
        const asteroidColor = rockColors[Math.floor(Math.random() * rockColors.length)];

        // Random geometry types for variation
        const geometryTypes = ['dodecahedron', 'icosahedron', 'octahedron', 'tetrahedron'];
        const geometryType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];

        // Individual rotation and rotation speeds
        const rotation: [number, number, number] = [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ];

        const rotationSpeed: [number, number, number] = [
          (Math.random() - 0.5) * 0.02, // Very slow rotation
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ];

        // Material variation
        const roughness = 0.8 + Math.random() * 0.2; // 0.8 to 1.0
        const metalness = Math.random() * 0.15; // 0 to 0.15

        asteroids.push({
          position: [x, y, z],
          size: asteroidSize,
          color: asteroidColor,
          rotation,
          rotationSpeed,
          geometry: geometryType,
          roughness,
          metalness
        });
        continue; // Skip adding to star arrays
      }

      // Add as distant star
      positions[starIndex * 3] = x;
      positions[starIndex * 3 + 1] = y;
      positions[starIndex * 3 + 2] = z;

      // Cinematic star colors (refined palette)
      const colorVariation = Math.random();
      if (colorVariation < 0.15) {
        // Pale cool blue for hot stars (#a2c8ff)
        colors[starIndex * 3] = 0.635 + Math.random() * 0.1;    // R: 162/255 ≈ 0.635
        colors[starIndex * 3 + 1] = 0.784 + Math.random() * 0.1; // G: 200/255 ≈ 0.784
        colors[starIndex * 3 + 2] = 1.0;                         // B: 255/255 = 1.0
      } else if (colorVariation < 0.3) {
        // Gentle warm yellow for cool stars (#fff4d8)
        colors[starIndex * 3] = 1.0;                             // R: 255/255 = 1.0
        colors[starIndex * 3 + 1] = 0.957 + Math.random() * 0.04; // G: 244/255 ≈ 0.957
        colors[starIndex * 3 + 2] = 0.847 + Math.random() * 0.1; // B: 216/255 ≈ 0.847
      } else {
        // Soft off-white for majority (#f0f6ff)
        colors[starIndex * 3] = 0.941 + Math.random() * 0.059;   // R: 240/255 ≈ 0.941
        colors[starIndex * 3 + 1] = 0.965 + Math.random() * 0.035; // G: 246/255 ≈ 0.965
        colors[starIndex * 3 + 2] = 1.0;                          // B: 255/255 = 1.0
      }

      // Vary star sizes for depth perception
      sizes[starIndex] = Math.random() * 3 + 1;
      starIndex++;
    }

    // Trim arrays to actual star count (excluding asteroids)
    const finalPositions = new Float32Array(starIndex * 3);
    const finalColors = new Float32Array(starIndex * 3);
    const finalSizes = new Float32Array(starIndex);

    finalPositions.set(positions.subarray(0, starIndex * 3));
    finalColors.set(colors.subarray(0, starIndex * 3));
    finalSizes.set(sizes.subarray(0, starIndex));

    return {
      positions: finalPositions,
      colors: finalColors,
      sizes: finalSizes,
      asteroids
    };
  }, [count, radius]);

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    geo.setAttribute('size', new BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  // Enhanced animation with nebula effects
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (enableTwinkling && pointsRef.current && materialRef.current) {
      // Update material opacity for twinkling effect
      materialRef.current.opacity = 0.6 + Math.sin(time * 0.5) * 0.1;

      // Subtle rotation for dynamic feel
      pointsRef.current.rotation.y += 0.0001;
      pointsRef.current.rotation.x += 0.00005;
    }

    // Nebula shader animation removed - using static texture planes
  });

  return (
    <>
      {/* Main star field */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={materialRef}
          map={starTextureMap}
          size={1.2}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          alphaTest={0.01}
        />
      </points>

      {/* Distant background stars (parallax layer) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={useMemo(() => {
              const positions = new Float32Array(2000 * 3);
              for (let i = 0; i < 2000; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = radius * 1.5;

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.cos(phi);
                positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
              }
              return positions;
            }, [radius])}
            count={2000}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={starTextureMap}
          size={0.5}
          sizeAttenuation={true}
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          alphaTest={0.01}
        />
      </points>

      {/* 3D Volumetric Nebula Clouds */}
      <group>
        {nebulaClouds.map((cloud, index) => (
          <points key={`nebula-${cloud.regionIndex}-${cloud.layer}-${index}`} geometry={cloud.geometry}>
            <pointsMaterial
              map={nebulaTextureMap}
              transparent={true}
              opacity={cloud.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              sizeAttenuation={true}
              vertexColors={true}
              alphaTest={0.01}
            />
          </points>
        ))}

      </group>

      {/* Asteroid field - varied rocks around and between planets */}
      <group>
        {asteroids.map((asteroid, index) => {
          // Create geometry based on type
          const getGeometry = (type: string) => {
            switch (type) {
              case 'icosahedron':
                return <icosahedronGeometry args={[1, 0]} />;
              case 'octahedron':
                return <octahedronGeometry args={[1, 0]} />;
              case 'tetrahedron':
                return <tetrahedronGeometry args={[1, 0]} />;
              default:
                return <dodecahedronGeometry args={[1, 0]} />;
            }
          };

          return (
            <AsteroidMesh
              key={`asteroid-${index}`}
              asteroid={asteroid}
              geometry={getGeometry(asteroid.geometry)}
            />
          );
        })}
      </group>

      {/* Subtle cosmic dust - much smaller and less intrusive */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={useMemo(() => {
              const positions = new Float32Array(300 * 3);
              for (let i = 0; i < 300; i++) {
                // Distributed far from planets
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = radius * (0.7 + Math.random() * 0.3); // Push further out

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.cos(phi) * 0.1; // Much flatter
                positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
              }
              return positions;
            }, [radius])}
            count={300}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          sizeAttenuation={true}
          color="#6644aa"
          transparent={true}
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Minimal interstellar gas - very subtle */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={useMemo(() => {
              const positions = new Float32Array(150 * 3);
              for (let i = 0; i < 150; i++) {
                // Only distant background gas
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = radius * (0.8 + Math.random() * 0.2); // Far background only

                positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.cos(phi) * 0.05; // Very flat
                positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
              }
              return positions;
            }, [radius])}
            count={150}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation={true}
          color="#ff8844"
          transparent={true}
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};