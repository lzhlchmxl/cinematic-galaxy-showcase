import { motion } from 'framer-motion';
import { CosmicPanel, HolographicButton } from './CosmicUI';

interface NavigationProps {
  onConstellationMode: () => void;
  isConstellationMode: boolean;
  foundersCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  onConstellationMode,
  isConstellationMode,
  foundersCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        flexWrap: 'wrap',
        gap: '12px'
      }}
    >
      {/* Logo/Title with Cosmic Theme */}
      <CosmicPanel
        variant="primary"
        style={{
          pointerEvents: 'auto',
          padding: '12px 16px',
          background: `
            radial-gradient(ellipse at center, rgba(0, 255, 136, 0.2) 0%, transparent 60%),
            linear-gradient(135deg, rgba(0, 0, 17, 0.95) 0%, rgba(0, 17, 51, 0.9) 100%)
          `,
          '@media (min-width: 768px)': {
            padding: '16px 24px'
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Animated logo icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #00ff88, #0088ff, #8844ff, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 17, 0.8)'
            }} />
          </motion.div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #00ff88 0%, #0088ff 50%, #8844ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: 'clamp(0.5px, 1.5vw, 1px)',
                lineHeight: '1.1',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              KW CONSTELLATION
            </h1>
            <p style={{
              margin: 0,
              fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
              color: 'rgba(0, 255, 136, 0.8)',
              letterSpacing: 'clamp(0.5px, 1vw, 2px)',
              textTransform: 'uppercase',
              lineHeight: '1',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Founder Showcase
            </p>
          </div>
        </div>
      </CosmicPanel>

      {/* Controls with Cosmic Theme */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        {/* Founder Counter with holographic effect */}
        <CosmicPanel
          variant="secondary"
          style={{
            pointerEvents: 'auto',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0088ff',
              boxShadow: '0 0 10px #0088ff'
            }}
          />
          <span style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            {foundersCount} ENTITIES
          </span>
        </CosmicPanel>

        {/* Enhanced Constellation Toggle */}
        <div style={{ pointerEvents: 'auto' }}>
          <HolographicButton
            onClick={onConstellationMode}
            variant={isConstellationMode ? 'primary' : 'secondary'}
            isActive={isConstellationMode}
          >
            {isConstellationMode ? (
              <>
                <span style={{ marginRight: '8px' }}>◄</span>
                RETURN TO GALAXY
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>✦</span>
                SIGNATURE MODE
              </>
            )}
          </HolographicButton>
        </div>
      </div>
    </motion.div>
  );
};