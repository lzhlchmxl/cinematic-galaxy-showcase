import { useState, useEffect } from 'react';

export const LoadingScreen: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #000011 0%, #001133 50%, #000022 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 1000
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '2rem',
        background: 'linear-gradient(45deg, #00ff88, #0088ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        KW Constellation
      </h1>

      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #00ff88, #0088ff)',
          transition: 'width 0.3s ease',
          borderRadius: '2px'
        }} />
      </div>

      <p style={{
        marginTop: '1rem',
        opacity: 0.7,
        fontSize: '1.1rem'
      }}>
        Initializing constellation...
      </p>
    </div>
  );
};