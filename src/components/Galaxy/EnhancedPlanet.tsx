import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Color, AdditiveBlending, BackSide, CanvasTexture, RepeatWrapping, type MeshStandardMaterialParameters } from 'three';
import { Sphere, Html } from '@react-three/drei';
// import { Fresnel } from 'lamina';
import type { PlanetProps } from '../../types/founder.types';
import { createPlaceholderPortrait, createPlaceholderLogo } from '../../utils/createPlaceholderImage';
import { createSaturnTexture, createSaturnRingTexture, createSaturnRingAlphaTexture } from '../../utils/createSaturnTextures';
import { createEarthDayTexture, createEarthNormalTexture, createEarthSpecularTexture, createEarthCloudTexture } from '../../utils/createEarthTextures';
import { SaturnRing } from './SaturnRing';
import { TechTracks } from './TechTracks';
import { Billboard } from './Billboard';
import { EarthPlanetMaterial } from './EarthPlanetMaterial';

// Helper function to get planet type configuration
const getPlanetTypeConfig = (type: string): {
  materialProps: Partial<MeshStandardMaterialParameters>;
  hasRings: boolean;
  ringCount?: number;
} => {
  switch (type) {
    case 'Saturn':
      return {
        materialProps: {
          roughness: 0.9,
          metalness: 0.0,
        },
        hasRings: true,
        ringCount: 5 // Multiple rings like Saturn
      };
    case 'Mystery':
      return {
        materialProps: {
          roughness: 0.8,
          metalness: 0.1,
        },
        hasRings: false
      };
    case 'Robotics':
      return {
        materialProps: {
          roughness: 0.4,
          metalness: 0.6,
        },
        hasRings: true,
        ringCount: 3
      };
    case 'BioTech':
      return {
        materialProps: {
          roughness: 0.9,
          metalness: 0.0,
        },
        hasRings: false
      };
    case 'Aerospace':
      return {
        materialProps: {
          roughness: 0.6,
          metalness: 0.4,
        },
        hasRings: true,
        ringCount: 2
      };
    case 'QuantumTech':
      return {
        materialProps: {
          roughness: 0.5,
          metalness: 0.5,
        },
        hasRings: true,
        ringCount: 1
      };
    case 'NeuroTech':
      return {
        materialProps: {
          roughness: 0.8,
          metalness: 0.2,
        },
        hasRings: false
      };
    case 'CleanTech':
      return {
        materialProps: {
          roughness: 0.9,
          metalness: 0.1,
        },
        hasRings: false
      };
    case 'Earth':
      return {
        materialProps: {
          roughness: 0.6,
          metalness: 0.1,
        },
        hasRings: false
      };
    case 'Tarth':
      return {
        materialProps: {
          roughness: 0.22,
          metalness: 0.15,
        },
        hasRings: false // Uses TechTracks instead
      };
    default:
      return {
        materialProps: {
          roughness: 0.8,
          metalness: 0.1,
        },
        hasRings: false
      };
  }
};

export const EnhancedPlanet: React.FC<PlanetProps> = ({
  founder,
  onHover,
  onClick,
  isHovered,
  isSelected
}) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);

  const [rotationSpeed] = useState(() => 0.01 + Math.random() * 0.02);
  const [ringRotationSpeed] = useState(() => 0.005 + Math.random() * 0.01);
  const [shaderTime, setShaderTime] = useState(0);

  // Get planet type configuration
  const typeConfig = useMemo(() => getPlanetTypeConfig(founder.type), [founder.type]);

  // Create enhanced color variations
  const planetColor = useMemo(() => new Color(founder.color), [founder.color]);
  const emissiveColor = useMemo(() => new Color(founder.color).multiplyScalar(0.3), [founder.color]);
  const ringColor = useMemo(() => new Color(founder.color).multiplyScalar(0.8), [founder.color]);

  // Planet scale from founder data
  const planetScale = founder.planetScale || 1.0;

  // Create placeholder images for testing
  const placeholderPortrait = useMemo(() =>
    createPlaceholderPortrait(founder.name, founder.color),
    [founder.name, founder.color]
  );

  const placeholderLogo = useMemo(() =>
    createPlaceholderLogo(founder.company, founder.color),
    [founder.company, founder.color]
  );

  // Create Saturn textures
  const saturnTextures = useMemo(() => {
    if (founder.type === 'Saturn') {
      return {
        planetTexture: createSaturnTexture(),
        ringTexture: createSaturnRingTexture(),
        ringAlphaTexture: createSaturnRingAlphaTexture()
      };
    }
    return null;
  }, [founder.type]);

  // Create Earth textures (Earth only, no night textures)
  const earthTextures = useMemo(() => {
    if (founder.type === 'Earth') {
      return {
        dayTexture: createEarthDayTexture(),
        normalTexture: createEarthNormalTexture(),
        specularTexture: createEarthSpecularTexture(),
        cloudTexture: createEarthCloudTexture()
      };
    }
    return null;
  }, [founder.type]);

  // Create Tarth red pattern texture
  const tarthPatternTexture = useMemo(() => {
    if (founder.type === 'Tarth') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Clear with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set red color
      ctx.strokeStyle = '#FF0000';
      ctx.fillStyle = '#CC0000';
      ctx.lineWidth = 2;

      // Draw hexagons lined up around the equator
      const equatorY = canvas.height / 2; // Middle of the texture (equator)
      const hexagonCount = 12; // Number of hexagons around equator
      const hexagonSize = 20; // Fixed size for uniformity
      const spacing = canvas.width / hexagonCount; // Even spacing

      for (let i = 0; i < hexagonCount; i++) {
        const x = i * spacing + spacing / 2; // Center each hexagon in its space
        const y = equatorY; // Align on equator

        // Draw filled hexagons
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI * 2) / 6;
          const px = x + Math.cos(angle) * hexagonSize;
          const py = y + Math.sin(angle) * hexagonSize;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill(); // Fill the hexagon
        ctx.stroke(); // Add outline for definition
      }

      // Draw grid lines
      ctx.strokeStyle = '#FF3333';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw diagonal stripes
      ctx.strokeStyle = '#FF6666';
      for (let i = 0; i < canvas.width + canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - canvas.height, canvas.height);
        ctx.stroke();
      }

      const texture = new CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(3, 2);
      return texture;
    }
    return null;
  }, [founder.type]);

  // Shader materials removed - using standard materials for stability

  // Separate refs for Earth cloud layer
  const cloudRef = useRef<Mesh>(null);

  // Animate planet rotation and hover effects
  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current && ringRef.current && outerRingRef.current) {
      // Base rotation
      meshRef.current.rotation.y += rotationSpeed * delta;

      // Earth cloud rotation (slightly faster than planet, Earth only)
      if (cloudRef.current && founder.type === 'Earth') {
        cloudRef.current.rotation.y += rotationSpeed * 1.2 * delta;
      }

      // Ring rotations (different speeds for orbital effect)
      ringRef.current.rotation.z += ringRotationSpeed * delta;
      outerRingRef.current.rotation.z -= ringRotationSpeed * 0.7 * delta;

      // Hover scale animation with easing
      const targetScale = isHovered ? 1.3 : 1.0;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.08;
      groupRef.current.scale.setScalar(newScale);

      // Subtle bobbing animation
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = founder.position.y + Math.sin(time * 0.5 + founder.position.x) * 0.2;

      // Update shader time for Earth
      if (founder.type === 'Earth') {
        setShaderTime(time);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={founder.position}
      scale={planetScale}
      rotation={
        founder.type === 'Saturn' ? [Math.PI * 26.7 / 180, 0, 0] :
        (founder.type === 'Earth' || founder.type === 'Tarth') ? [Math.PI * 23.5 / 180, 0, 0] : // Axial tilt for Earth/Tarth
        [0, 0, 0]
      }
      onClick={() => onClick(founder)}
      onPointerOver={() => onHover(founder)}
      onPointerOut={() => onHover(null)}
    >
      {/* Enhanced planet with thematic surface properties */}
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]}
        scale={
          founder.type === 'Saturn' ? [1, 0.9, 1] :
          (founder.type === 'Earth' || founder.type === 'Tarth') ? [1, 0.97, 1] : // Oblate scaling for Earth/Tarth
          [1, 1, 1]
        }
      >
        {founder.type === 'Earth' ? (
          <EarthPlanetMaterial
            dayTexture={earthTextures?.dayTexture}
            normalTexture={earthTextures?.normalTexture}
            specularTexture={earthTextures?.specularTexture}
            time={shaderTime}
          />
        ) : (
          <meshStandardMaterial
            color={
              founder.type === 'Tarth' ?
                new Color('#FF8C00') : // Rich orange color
                planetColor
            }
            map={saturnTextures?.planetTexture || undefined}
            emissive={
              founder.type === 'Tarth' ?
                new Color('#FF6B47').multiplyScalar(0.3) : // Warm orange-red emissive for Tarth
                emissiveColor
            }
            emissiveIntensity={
              founder.type === 'Tarth' ? 0.4 : // Tarth gets emissive
              (isHovered ? 0.4 : 0.15) // Others use standard emissive
            }
            {...(founder.type === 'Tarth' ? {
              roughness: 0.8, // Higher roughness for matte surface
              metalness: 0.05 // Very low metalness to avoid plastic look
            } : typeConfig.materialProps)}
            transparent={founder.type === 'Tarth' ? false : true} // Remove transparency for Tarth only
            opacity={founder.type === 'Tarth' ? 1.0 : 0.98} // Full opacity for Tarth
          />
        )}
      </Sphere>

      {/* Tarth red decoration patterns - separate layer */}
      {founder.type === 'Tarth' && tarthPatternTexture && (
        <Sphere
          args={[1.015, 64, 64]} // Slightly larger to avoid z-fighting
          scale={[1, 0.97, 1]} // Match planet oblate scaling
        >
          <meshStandardMaterial
            map={tarthPatternTexture}
            color={new Color('#FF0000')} // Bright red color
            transparent
            opacity={0.8}
            alphaTest={0.1}
            roughness={0.9}
            metalness={0.0}
            emissive={new Color('#CC0000')}
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}

      {/* Thematic orbital rings - rendered conditionally based on planet type */}
      {typeConfig.hasRings && (
        <>
          {founder.type === 'Saturn' ? (
            // Saturn ring system with realistic textures
            <SaturnRing
              ref={ringRef}
              innerRadius={1.3}
              outerRadius={3.2}
              segments={256}
              texture={saturnTextures?.ringTexture}
              alphaTexture={saturnTextures?.ringAlphaTexture}
              opacity={0.8}
              roughness={0.4}
              metalness={0.0}
              isHovered={isHovered}
              color="#FFFFFF"
            />
          ) : (
            // Regular ring system for other planets
            <>
              <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <ringGeometry args={[1.6, 1.8, 64]} />
                <meshStandardMaterial
                  color={ringColor}
                  transparent
                  opacity={isHovered ? 0.7 : 0.4}
                  side={2}
                  emissive={ringColor}
                  emissiveIntensity={isHovered ? 0.15 : 0.08}
                  roughness={0.6}
                  metalness={0.0}
                />
              </mesh>

              {typeConfig.ringCount && typeConfig.ringCount > 1 && (
                <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                  <ringGeometry args={[2.2, 2.3, 64]} />
                  <meshStandardMaterial
                    color={ringColor}
                    transparent
                    opacity={isHovered ? 0.5 : 0.2}
                    side={2}
                    emissive={ringColor}
                    emissiveIntensity={isHovered ? 0.1 : 0.05}
                    roughness={0.6}
                    metalness={0.0}
                  />
                </mesh>
              )}

              {typeConfig.ringCount && typeConfig.ringCount > 2 && (
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                  <ringGeometry args={[2.8, 2.9, 64]} />
                  <meshStandardMaterial
                    color={ringColor}
                    transparent
                    opacity={isHovered ? 0.3 : 0.15}
                    side={2}
                    emissive={ringColor}
                    emissiveIntensity={isHovered ? 0.08 : 0.04}
                    roughness={0.6}
                    metalness={0.0}
                  />
                </mesh>
              )}
            </>
          )}
        </>
      )}


      {/* Earth cloud layer with oblate scaling (Earth only, not Tarth) */}
      {founder.type === 'Earth' && earthTextures && (
        <Sphere
          ref={cloudRef}
          args={[1.01, 48, 48]}
          scale={[1, 0.97, 1]} // Match Earth's oblate scaling
        >
          <meshStandardMaterial
            map={earthTextures.cloudTexture}
            transparent
            opacity={isHovered ? 0.9 : 0.7}
            alphaTest={0.1}
            side={2}
          />
        </Sphere>
      )}

      {/* Tarth Transport Tracks */}
      {founder.type === 'Tarth' && (
        <TechTracks
          lanes={4}
          radius={1.4}
          planetRadius={1.0}
        />
      )}

      {/* Tarth Billboard Only */}
      {founder.type === 'Tarth' && (
        <Billboard
          text="Vuga Tech"
          position={[0, 1.8, 0]}
          scale={0.8}
        />
      )}

      {/* Earth-specific lighting removed - using material properties for brightness */}

      {/* Enhanced atmospheric glow - Earth only */}
      {founder.type === 'Earth' && (
        <Sphere args={[1.15, 24, 24]}>
          <meshBasicMaterial
            color={new Color('#A0C0F0')} // Sky blue for more natural atmosphere
            transparent
            opacity={isHovered ? 0.18 : 0.12}
            side={BackSide}
            blending={AdditiveBlending}
          />
        </Sphere>
      )}

      {/* Outer atmospheric glow - Earth only */}
      {founder.type === 'Earth' && (
        <Sphere args={[1.25, 24, 24]}>
          <meshBasicMaterial
            color={new Color('#A0C0F0')} // Sky blue for more natural atmosphere
            transparent
            opacity={isHovered ? 0.15 : 0.15}
            side={BackSide}
            blending={AdditiveBlending}
          />
        </Sphere>
      )}



      {/* Interactive Hover System - Founder Portrait */}
      {isHovered && !isSelected && (
        <Html position={[2.5 * planetScale, 0.8 * planetScale, 0]} center>
          <div
            onClick={() => onClick(founder)}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              background: 'rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
            }}
          >
            <img
              src={founder.portraitUrl || placeholderPortrait}
              alt={`${founder.name} portrait`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== placeholderPortrait) {
                  target.src = placeholderPortrait;
                }
              }}
            />
          </div>
        </Html>
      )}

      {/* Interactive Hover System - Company Logo & Name */}
      {isHovered && !isSelected && (
        <Html position={[-2.5 * planetScale, -0.8 * planetScale, 0]} center>
          <div
            onClick={() => onClick(founder)}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center',
              color: 'white',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              minWidth: '200px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            }}
          >
            <img
              src={founder.logoUrl || placeholderLogo}
              alt={`${founder.company} logo`}
              style={{
                maxWidth: '60px',
                maxHeight: '40px',
                marginBottom: '8px',
                filter: 'brightness(1.2)'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== placeholderLogo) {
                  target.src = placeholderLogo;
                }
              }}
            />
            <p style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 4px',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              {founder.company}
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
              margin: '0',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {founder.name}
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.8rem',
              margin: '4px 0 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {founder.type}
            </p>
          </div>
        </Html>
      )}

      {/* Satellite/moon for some planets */}
      {founder.id === 'founder-1' && (
        <group>
          <mesh position={[3, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#888888"
              emissive="#222222"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};