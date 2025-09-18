import { useState, useEffect } from 'react';

interface PerformanceSettings {
  starCount: number;
  enableDynamicLighting: boolean;
  enableAtmosphericEffects: boolean;
  enableSatellites: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  renderQuality: 'low' | 'medium' | 'high';
}

interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  supportsWebGL2: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
}

export const usePerformanceOptimization = () => {
  const [settings, setSettings] = useState<PerformanceSettings>({
    starCount: 8000,
    enableDynamicLighting: true,
    enableAtmosphericEffects: true,
    enableSatellites: true,
    particleQuality: 'high',
    renderQuality: 'high'
  });

  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isLowEnd: false,
    supportsWebGL2: true,
    hardwareConcurrency: 4
  });

  useEffect(() => {
    const detectDeviceCapabilities = (): DeviceCapabilities => {
      // Detect mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Hardware concurrency (CPU cores)
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;

      // Device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;

      // WebGL2 support
      const canvas = document.createElement('canvas');
      const supportsWebGL2 = !!canvas.getContext('webgl2');

      // Determine if device is low-end
      const isLowEnd =
        hardwareConcurrency <= 2 ||
        (deviceMemory && deviceMemory <= 2) ||
        !supportsWebGL2;

      return {
        isMobile,
        isLowEnd,
        supportsWebGL2,
        hardwareConcurrency,
        deviceMemory
      };
    };

    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Optimize settings based on device capabilities
    const optimizeSettings = (capabilities: DeviceCapabilities): PerformanceSettings => {
      if (capabilities.isLowEnd) {
        return {
          starCount: 2000,
          enableDynamicLighting: false,
          enableAtmosphericEffects: false,
          enableSatellites: false,
          particleQuality: 'low',
          renderQuality: 'low'
        };
      }

      if (capabilities.isMobile) {
        return {
          starCount: 4000,
          enableDynamicLighting: true,
          enableAtmosphericEffects: false,
          enableSatellites: false,
          particleQuality: 'medium',
          renderQuality: 'medium'
        };
      }

      // Desktop with good performance
      return {
        starCount: 8000,
        enableDynamicLighting: true,
        enableAtmosphericEffects: true,
        enableSatellites: true,
        particleQuality: 'high',
        renderQuality: 'high'
      };
    };

    setSettings(optimizeSettings(capabilities));
  }, []);

  // Frame rate monitoring
  const [averageFPS, setAverageFPS] = useState(60);
  const fpsHistory = useState<number[]>(() => [])[0];

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) { // Every second
        const fps = (frameCount * 1000) / (currentTime - lastTime);

        fpsHistory.push(fps);
        if (fpsHistory.length > 10) fpsHistory.shift(); // Keep last 10 measurements

        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        setAverageFPS(avgFPS);

        // Auto-adjust quality if FPS drops
        if (avgFPS < 30 && settings.renderQuality !== 'low') {
          setSettings(prev => ({
            ...prev,
            starCount: Math.max(prev.starCount * 0.7, 1000),
            enableAtmosphericEffects: false,
            particleQuality: prev.particleQuality === 'high' ? 'medium' : 'low'
          }));
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, [settings, fpsHistory]);

  return {
    settings,
    deviceCapabilities,
    averageFPS,
    updateSettings: setSettings
  };
};