import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Color, AdditiveBlending, BackSide, type MeshStandardMaterialParameters } from 'three';
import { Sphere, Html } from '@react-three/drei';
// import { Fresnel } from 'lamina';
import type { PlanetProps } from '../../types/founder.types';
import { createPlaceholderPortrait, createPlaceholderLogo } from '../../utils/createPlaceholderImage';
import { createSaturnTexture, createSaturnRingTexture, createSaturnRingAlphaTexture } from '../../utils/createSaturnTextures';
import { createEarthDayTexture, createEarthNightTexture, createEarthNormalTexture, createEarthSpecularTexture, createEarthCloudTexture } from '../../utils/createEarthTextures';
import { SaturnRing } from './SaturnRing';
import { TechTracks } from './TechTracks';
import { Billboard } from './Billboard';

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
    case 'WugaTech':
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

  // Create Earth textures (used by both Earth and WugaTech)
  const earthTextures = useMemo(() => {
    if (founder.type === 'Earth' || founder.type === 'WugaTech') {
      return {
        dayTexture: createEarthDayTexture(),
        nightTexture: createEarthNightTexture(),
        normalTexture: createEarthNormalTexture(),
        specularTexture: createEarthSpecularTexture(),
        cloudTexture: createEarthCloudTexture()
      };
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

      // Earth/WugaTech cloud rotation (slightly faster than planet)
      if (cloudRef.current && (founder.type === 'Earth' || founder.type === 'WugaTech')) {
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

      // Shader material updates removed for stability
    }
  });

  return (
    <group
      ref={groupRef}
      position={founder.position}
      scale={planetScale}
      rotation={
        founder.type === 'Saturn' ? [Math.PI * 26.7 / 180, 0, 0] :
        (founder.type === 'Earth' || founder.type === 'WugaTech') ? [Math.PI * 23.5 / 180, 0, 0] : // Axial tilt for Earth/WugaTech
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
          (founder.type === 'Earth' || founder.type === 'WugaTech') ? [1, 0.97, 1] : // Oblate scaling for Earth/WugaTech
          [1, 1, 1]
        }
      >
        <meshStandardMaterial
          color={planetColor}
          map={
            saturnTextures?.planetTexture ||
            earthTextures?.dayTexture ||
            undefined
          }
          emissive={
            (founder.type === 'Earth' || founder.type === 'WugaTech') ? new Color('#DDDDDD') : emissiveColor
          }
          emissiveMap={earthTextures?.nightTexture || undefined}
          emissiveIntensity={
            (founder.type === 'Earth' || founder.type === 'WugaTech') ? 0.7 :
            (isHovered ? 0.4 : 0.15)
          }
          normalMap={earthTextures?.normalTexture || undefined}
          roughnessMap={earthTextures?.specularTexture || undefined}
          {...((founder.type === 'Earth' || founder.type === 'WugaTech') ? {
            roughness: 0.22,
            metalness: 0.15
          } : typeConfig.materialProps)}
          transparent
          opacity={0.98}
        />
      </Sphere>

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


      {/* Earth/WugaTech cloud layer with oblate scaling */}
      {(founder.type === 'Earth' || founder.type === 'WugaTech') && earthTextures && (
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

      {/* WugaTech Transport Tracks */}
      {founder.type === 'WugaTech' && (
        <TechTracks
          lanes={5}
          radius={1.4}
          planetRadius={1.0}
        />
      )}

      {/* WugaTech Billboard */}
      {founder.type === 'WugaTech' && (
        <Billboard
          text="Wuga Tech"
          position={[0, 1.8, 0]}
          scale={0.8}
        />
      )}

      {/* Earth-specific lighting removed - using material properties for brightness */}

      {/* Enhanced atmospheric glow - multiple layers for depth */}
      <Sphere args={[1.15, 24, 24]}>
        <meshBasicMaterial
          color={(founder.type === 'Earth' || founder.type === 'WugaTech') ? new Color('#B0E0E6') : planetColor}
          transparent
          opacity={
            (founder.type === 'Earth' || founder.type === 'WugaTech') ?
              (isHovered ? 0.18 : 0.12) :
              (isHovered ? 0.15 : 0.08)
          }
          side={BackSide}
          blending={AdditiveBlending}
        />
      </Sphere>

      {/* Outer atmospheric glow */}
      <Sphere args={[1.25, 24, 24]}>
        <meshBasicMaterial
          color={(founder.type === 'Earth' || founder.type === 'WugaTech') ? new Color('#B0E0E6') : planetColor}
          transparent
          opacity={
            (founder.type === 'Earth' || founder.type === 'WugaTech') ?
              (isHovered ? 0.15 : 0.15) :
              (isHovered ? 0.08 : 0.04)
          }
          side={BackSide}
          blending={AdditiveBlending}
        />
      </Sphere>


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