import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface CosmicPanelProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
  style?: React.CSSProperties;
}

export const CosmicPanel: React.FC<CosmicPanelProps> = ({
  children,
  variant = 'primary',
  className,
  style
}) => {
  const variants = {
    primary: {
      background: `
        radial-gradient(ellipse at top left, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(0, 136, 255, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at center, rgba(136, 68, 255, 0.05) 0%, transparent 70%),
        linear-gradient(135deg, rgba(0, 0, 17, 0.9) 0%, rgba(0, 17, 51, 0.8) 100%)
      `,
      border: '1px solid rgba(0, 255, 136, 0.3)',
      boxShadow: `
        0 0 20px rgba(0, 255, 136, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 255, 136, 0.1)
      `
    },
    secondary: {
      background: `
        radial-gradient(ellipse at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%),
        linear-gradient(135deg, rgba(0, 0, 17, 0.8) 0%, rgba(17, 17, 34, 0.7) 100%)
      `,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: `
        0 0 15px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    },
    accent: {
      background: `
        radial-gradient(ellipse at center, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, rgba(17, 0, 17, 0.9) 0%, rgba(51, 0, 17, 0.8) 100%)
      `,
      border: '1px solid rgba(255, 107, 107, 0.4)',
      boxShadow: `
        0 0 25px rgba(255, 107, 107, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `
    }
  };

  return (
    <div
      className={className}
      style={{
        ...variants[variant],
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Animated border glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '16px',
          background: `conic-gradient(from 0deg, transparent, ${variant === 'primary' ? 'rgba(0, 255, 136, 0.3)' : variant === 'accent' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.2)'}, transparent)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          pointerEvents: 'none',
          animation: 'spin 8s linear infinite'
        }}
      />

      {/* Holographic scan lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 136, 0.03) 2px,
            rgba(0, 255, 136, 0.03) 4px
          )`,
          pointerEvents: 'none'
        }}
      />

      {children}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

interface HolographicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isActive?: boolean;
}

export const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isActive = false
}) => {
  const colors = {
    primary: {
      base: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.4)',
      bg: 'rgba(0, 255, 136, 0.1)'
    },
    secondary: {
      base: '#0088ff',
      glow: 'rgba(0, 136, 255, 0.4)',
      bg: 'rgba(0, 136, 255, 0.1)'
    },
    danger: {
      base: '#ff6b6b',
      glow: 'rgba(255, 107, 107, 0.4)',
      bg: 'rgba(255, 107, 107, 0.1)'
    }
  };

  const color = colors[variant];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${color.bg} 0%, rgba(0, 0, 17, 0.8) 100%)`
          : `linear-gradient(135deg, rgba(0, 0, 17, 0.6) 0%, rgba(17, 17, 34, 0.4) 100%)`,
        border: `1px solid ${isActive ? color.base : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '12px',
        padding: '12px 24px',
        color: isActive ? color.base : 'rgba(255, 255, 255, 0.9)',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        boxShadow: isActive
          ? `0 0 20px ${color.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
          : '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Energy pulse effect for active state */}
      {isActive && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${color.glow}, transparent)`,
            pointerEvents: 'none'
          }}
          animate={{
            left: ['−100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </motion.button>
  );
};

interface CosmicTooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const CosmicTooltip: React.FC<CosmicTooltipProps> = ({
  children,
  content,
  position = 'bottom'
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute',
          [position]: '100%',
          left: position === 'left' || position === 'right' ? undefined : '50%',
          top: position === 'top' || position === 'bottom' ? undefined : '50%',
          transform: position === 'left' || position === 'right'
            ? 'translateY(-50%)'
            : 'translateX(-50%)',
          marginTop: position === 'bottom' ? '8px' : position === 'top' ? '-8px' : 0,
          marginLeft: position === 'right' ? '8px' : position === 'left' ? '-8px' : 0,
          zIndex: 1000,
          pointerEvents: 'none'
        }}
      >
        <CosmicPanel variant="secondary" style={{ padding: '12px 16px', minWidth: '200px' }}>
          {content}
        </CosmicPanel>
      </motion.div>
    </div>
  );
};