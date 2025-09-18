import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveLoaderProps {
  onLoadingComplete: () => void;
}

interface LoadingStep {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  onLoadingComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps: LoadingStep[] = [
    { id: 'core', label: 'Initializing core systems', duration: 800, completed: false },
    { id: 'three', label: 'Loading 3D engine', duration: 600, completed: false },
    { id: 'stars', label: 'Generating starfield', duration: 500, completed: false },
    { id: 'planets', label: 'Positioning founder planets', duration: 400, completed: false },
    { id: 'lighting', label: 'Setting up dynamic lighting', duration: 300, completed: false },
    { id: 'interactions', label: 'Enabling interactions', duration: 200, completed: false }
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const executeStep = (stepIndex: number) => {
      if (stepIndex >= loadingSteps.length) {
        // All steps completed
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
        return;
      }

      const step = loadingSteps[stepIndex];
      const stepProgress = (stepIndex / loadingSteps.length) * 100;

      // Animate progress within the step
      let startTime = performance.now();
      const animateProgress = () => {
        const elapsed = performance.now() - startTime;
        const stepProgressPercent = Math.min(elapsed / step.duration, 1);
        const totalProgress = stepProgress + (stepProgressPercent * (100 / loadingSteps.length));

        setProgress(totalProgress);

        if (stepProgressPercent < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          step.completed = true;
          setCurrentStep(stepIndex + 1);
          timeoutId = setTimeout(() => executeStep(stepIndex + 1), 100);
        }
      };

      animateProgress();
    };

    // Start loading sequence
    executeStep(0);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onLoadingComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at center, #001133 0%, #000011 70%, #000000 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 2000
    }}>
      {/* Animated background stars */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(2px 2px at 20px 30px, #fff, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, #fff, transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(2px 2px at 160px 30px, #fff, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        opacity: 0.3,
        animation: 'twinkle 3s ease-in-out infinite alternate'
      }} />

      {/* Main logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ marginBottom: '3rem', textAlign: 'center' }}
      >
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          margin: '0 0 0.5rem',
          background: 'linear-gradient(135deg, #00ff88 0%, #0088ff 50%, #8844ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px'
        }}>
          KW Constellation
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: 0,
          opacity: 0.8,
          letterSpacing: '1px'
        }}>
          Founder Showcase
        </p>
      </motion.div>

      {/* Progress bar */}
      <div style={{
        width: '400px',
        maxWidth: '80vw',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00ff88 0%, #0088ff 50%, #8844ff 100%)',
              borderRadius: '2px',
              transformOrigin: 'left'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Progress percentage */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          opacity: 0.7,
          marginBottom: '1rem'
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Current step */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          opacity: 0.8,
          marginBottom: '2rem'
        }}
      >
        {currentStep < loadingSteps.length ? loadingSteps[currentStep].label : 'Ready to launch...'}
      </motion.div>

      {/* Loading steps visualization */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '2rem'
      }}>
        {loadingSteps.map((step, index) => (
          <div
            key={step.id}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index < currentStep
                ? '#00ff88'
                : index === currentStep
                  ? '#0088ff'
                  : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          fontSize: '0.9rem',
          textAlign: 'center',
          maxWidth: '300px',
          lineHeight: '1.4',
          margin: 0
        }}
      >
        Preparing...
      </motion.p>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};