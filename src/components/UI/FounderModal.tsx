import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Founder } from '../../types/founder.types';
import { CosmicPanel, HolographicButton } from './CosmicUI';
import { createPlaceholderPortrait, createPlaceholderLogo } from '../../utils/createPlaceholderImage';

interface FounderModalProps {
  founder: Founder | null;
  onClose: () => void;
}

export const FounderModal: React.FC<FounderModalProps> = ({ founder, onClose }) => {
  const [imageMode, setImageMode] = useState<'portrait' | 'logo' | 'planet'>('portrait');

  // Generate fallback images
  const placeholderPortrait = founder ? createPlaceholderPortrait(founder.name, founder.color) : '';
  const placeholderLogo = founder ? createPlaceholderLogo(founder.company, founder.color) : '';

  // Reset image mode when founder changes
  useEffect(() => {
    setImageMode('portrait');
  }, [founder]);

  const handleImageError = () => {
    if (imageMode === 'portrait') {
      setImageMode('logo');
    } else if (imageMode === 'logo') {
      setImageMode('planet');
    }
  };

  const getCurrentImageSrc = () => {
    if (!founder) return '';

    switch (imageMode) {
      case 'portrait':
        return founder.portraitUrl || '';
      case 'logo':
        return founder.logoUrl || '';
      case 'planet':
        return ''; // Will show the animated planet
      default:
        return '';
    }
  };
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (founder) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent all scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overflow = '';
    };
  }, [founder, onClose]);

  return (
    <AnimatePresence>
      {founder && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflow: 'hidden'
            }}
          >
            {/* Cosmic Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CosmicPanel
                variant="primary"
                style={{
                  padding: '40px',
                  position: 'relative',
                  overflow: 'hidden',
                  maxHeight: 'inherit'
                }}
              >
                {/* Holographic Close Button */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                  <HolographicButton
                    onClick={onClose}
                    variant="danger"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      padding: '0',
                      fontSize: '18px',
                      minWidth: 'unset'
                    }}
                  >
                    ×
                  </HolographicButton>
                </div>

                {/* Enhanced Avatar with Fallback System */}
                <div style={{ position: 'relative', margin: '0 auto 32px', width: '100px', height: '100px' }}>
                  {imageMode === 'planet' ? (
                    // Fallback to animated planet
                    <motion.div
                      animate={{
                        rotate: 360,
                        boxShadow: [
                          `0 0 30px ${founder.color}66`,
                          `0 0 50px ${founder.color}88`,
                          `0 0 30px ${founder.color}66`
                        ]
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `
                          radial-gradient(circle at 30% 30%, ${founder.color}ff 0%, ${founder.color}aa 40%, ${founder.color}66 100%),
                          conic-gradient(from 45deg, ${founder.color}, transparent, ${founder.color})
                        `,
                        border: `2px solid ${founder.color}88`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Inner cosmic glow */}
                      <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '20%',
                        width: '30%',
                        height: '30%',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${founder.color}ff 0%, transparent 70%)`,
                        filter: 'blur(4px)'
                      }} />
                    </motion.div>
                  ) : (
                    // Photo or Logo with cosmic effects
                    <motion.div
                      animate={{
                        boxShadow: [
                          `0 0 30px ${founder.color}66`,
                          `0 0 50px ${founder.color}88`,
                          `0 0 30px ${founder.color}66`
                        ]
                      }}
                      transition={{
                        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: `2px solid ${founder.color}88`,
                        position: 'relative',
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${founder.color}22, ${founder.color}11)`
                      }}
                    >
                      <img
                        src={getCurrentImageSrc() || (imageMode === 'portrait' ? placeholderPortrait : placeholderLogo)}
                        alt={imageMode === 'portrait' ? `${founder.name} portrait` : `${founder.company} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: imageMode === 'portrait' ? 'cover' : 'contain',
                          borderRadius: '50%',
                          padding: imageMode === 'logo' ? '15px' : '0'
                        }}
                        onError={handleImageError}
                      />
                    </motion.div>
                  )}

                  {/* Orbital ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      width: '120px',
                      height: '120px',
                      border: `1px solid ${founder.color}44`,
                      borderRadius: '50%',
                      borderStyle: 'dashed',
                      borderDasharray: '5px 10px'
                    }}
                  />
                </div>

              {/* Founder Info */}
              <div style={{ textAlign: 'center' }}>
                <h2
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: '0 0 8px',
                    background: `linear-gradient(135deg, ${founder.color} 0%, #ffffff 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {founder.name}
                </h2>

                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '500',
                    margin: '0 0 24px',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {founder.company}
                </h3>

                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: '0 0 32px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'left'
                  }}
                >
                  {founder.description}
                </p>

                {/* Holographic Social Links */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {founder.links.website && (
                    <a
                      href={founder.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <HolographicButton variant="secondary">
                        <span style={{ marginRight: '8px' }}>🌐</span>
                        Website
                      </HolographicButton>
                    </a>
                  )}

                  {founder.links.linkedin && (
                    <a
                      href={founder.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <HolographicButton variant="primary">
                        <span style={{ marginRight: '8px' }}>💼</span>
                        LinkedIn
                      </HolographicButton>
                    </a>
                  )}

                  {founder.links.twitter && (
                    <a
                      href={founder.links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <HolographicButton variant="secondary">
                        <span style={{ marginRight: '8px' }}>🐦</span>
                        Twitter
                      </HolographicButton>
                    </a>
                  )}
                </div>
              </div>
              </CosmicPanel>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};