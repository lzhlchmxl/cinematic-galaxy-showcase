import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { EnhancedPlanet } from './EnhancedPlanet';
import { StarField } from './StarField';
import { ConstellationFinale } from './ConstellationFinale';
// import { PostProcessing } from '../Effects/PostProcessing';
import { DynamicLighting } from '../Effects/DynamicLighting';
// import { SimpleParticleTrails } from '../Effects/SimpleParticleTrails';
import { FounderModal } from '../UI/FounderModal';
import { Navigation } from '../UI/Navigation';
import { founders } from '../../data/founders';
import { useGalaxyInteraction } from '../../hooks/useGalaxyInteraction';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

export const GalaxyScene: React.FC = () => {
  const [isConstellationMode, setIsConstellationMode] = useState(false);

  const {
    interactionState,
    handlePlanetHover,
    handlePlanetClick,
    handleModalClose,
    handleMouseMove,
    getSelectedFounder
  } = useGalaxyInteraction();

  const { settings } = usePerformanceOptimization();

  const selectedFounder = getSelectedFounder(founders);

  const handleConstellationToggle = () => {
    setIsConstellationMode(!isConstellationMode);
    // Close any open modal when switching modes
    if (selectedFounder) {
      handleModalClose();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #000011 0%, #11001b 100%)'
      }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: 2, // ACESFilmicToneMapping
          toneMappingExposure: 1.4, // Slightly increased for cinematic look
          outputColorSpace: 'srgb',
          powerPreference: 'high-performance',
          alpha: true
        }}
        shadows={{
          enabled: true
        }}
      >
        <Suspense fallback={null}>
          {/* Enhanced dynamic lighting system - conditionally enabled */}
          {settings.enableDynamicLighting && (
            <DynamicLighting
              mousePosition={interactionState.mousePosition}
              interactionState={interactionState}
              earthPosition={founders.find(f => f.type === 'Earth')?.position}
            />
          )}

          {/* Particle trails temporarily disabled due to rendering issues */}

          {/* Advanced starfield with performance-optimized count */}
          <StarField
            count={isConstellationMode ? Math.min(settings.starCount / 2, 2000) : settings.starCount}
            radius={400}
            enableTwinkling={settings.particleQuality !== 'low'}
          />

          {/* Background mesh for clearing hover states */}
          <mesh
            onClick={() => handlePlanetHover(null)}
            position={[0, 0, -50]}
            scale={[200, 200, 1]}
          >
            <planeGeometry />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Enhanced founder planets - hidden in constellation mode */}
          {!isConstellationMode && founders.map(founder => (
            <EnhancedPlanet
              key={founder.id}
              founder={founder}
              onHover={handlePlanetHover}
              onClick={handlePlanetClick}
              isHovered={interactionState.hoveredPlanetId === founder.id}
              isSelected={interactionState.selectedPlanetId === founder.id}
            />
          ))}

          {/* Constellation finale animation */}
          <ConstellationFinale
            isActive={isConstellationMode}
            onComplete={() => {
              // Optional: Auto-return to galaxy after constellation completes
              // setTimeout(() => setIsConstellationMode(false), 5000);
            }}
          />

          {/* Camera controls */}
          <CameraController
            autoRotate={!isConstellationMode}
            enableZoom={true}
            enablePan={false}
          />

          {/* Vuga Tech post-processing effects - temporarily disabled due to runtime error */}
          {/* <PostProcessing
            enableBloom={true}
            enableChromaticAberration={true}
            enableVignette={false}
            bloomIntensity={0.8}
            bloomThreshold={0.35}
            chromaticAberrationOffset={[0.0007, 0.0005]}
          /> */}
        </Suspense>
      </Canvas>

      {/* Navigation */}
      <Navigation
        onConstellationMode={handleConstellationToggle}
        isConstellationMode={isConstellationMode}
        foundersCount={founders.length}
      />

      {/* Hover tooltip for planets - only in galaxy mode */}
      {!isConstellationMode && interactionState.hoveredPlanetId && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '16px 24px',
          color: 'white',
          pointerEvents: 'none',
          textAlign: 'center'
        }}>
          {(() => {
            const hoveredFounder = founders.find(f => f.id === interactionState.hoveredPlanetId);
            return hoveredFounder ? (
              <>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: '600' }}>
                  {hoveredFounder.name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                  {hoveredFounder.company}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.6 }}>
                  Click to learn more
                </p>
              </>
            ) : null;
          })()}
        </div>
      )}

      {/* Founder Modal */}
      <FounderModal
        founder={selectedFounder}
        onClose={handleModalClose}
      />

      {/* Instructions overlay - only show in galaxy mode when no interaction */}
      {!isConstellationMode && !interactionState.hoveredPlanetId && !selectedFounder && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '12px 20px',
          color: 'rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          🖱️ Drag to orbit • 🎯 Hover & click planets
        </div>
      )}
    </div>
  );
};