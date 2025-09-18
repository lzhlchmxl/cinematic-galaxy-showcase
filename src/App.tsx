import { useState, useEffect } from 'react'
import { GalaxyScene } from './components/Galaxy/GalaxyScene'
import { ProgressiveLoader } from './components/UI/ProgressiveLoader'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showGalaxy, setShowGalaxy] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay before showing galaxy for smooth transition
    setTimeout(() => {
      setShowGalaxy(true)
    }, 300)
  }

  // Error boundary for 3D fallback
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) {
      setHasError(true)
      setIsLoading(false)
    }

    // Preload critical resources
    const preloadResources = async () => {
      try {
        // Preload fonts
        await document.fonts.load('400 16px Orbitron')
        await document.fonts.load('700 32px Orbitron')
      } catch (error) {
        console.warn('Font preloading failed:', error)
      }
    }

    preloadResources()
  }, [])

  if (hasError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #001133 0%, #000011 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          WebGL Not Supported
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>
          This experience requires WebGL support. Please update your browser or enable hardware acceleration.
        </p>
        <a
          href="https://get.webgl.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00ff88',
            textDecoration: 'none',
            padding: '12px 24px',
            border: '1px solid #00ff88',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          Learn More About WebGL
        </a>
      </div>
    )
  }

  return (
    <>
      {isLoading && <ProgressiveLoader onLoadingComplete={handleLoadingComplete} />}
      {showGalaxy && <GalaxyScene />}
    </>
  )
}

export default App
