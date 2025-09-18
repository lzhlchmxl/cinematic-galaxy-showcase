import { CanvasTexture, LinearFilter, MirroredRepeatWrapping } from 'three';

// Create realistic Earth day texture with continents and oceans
export const createEarthDayTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // High resolution for quality
  canvas.width = 2048;
  canvas.height = 1024;

  // Create stylized ocean base - brighter and more saturated for material enhancement
  ctx.fillStyle = '#5BA3F5'; // Brighter, more saturated ocean blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stylized continent shapes - brighter blue-green for enhanced vibrancy
  ctx.fillStyle = '#52D195'; // Brighter, more saturated blue-green continents

  // North America - more realistic shape
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.05, canvas.height * 0.25);
  ctx.bezierCurveTo(canvas.width * 0.08, canvas.height * 0.2, canvas.width * 0.15, canvas.height * 0.22, canvas.width * 0.22, canvas.height * 0.3);
  ctx.bezierCurveTo(canvas.width * 0.25, canvas.height * 0.35, canvas.width * 0.2, canvas.height * 0.45, canvas.width * 0.15, canvas.height * 0.5);
  ctx.bezierCurveTo(canvas.width * 0.1, canvas.height * 0.48, canvas.width * 0.05, canvas.height * 0.4, canvas.width * 0.05, canvas.height * 0.25);
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.15, canvas.height * 0.55);
  ctx.bezierCurveTo(canvas.width * 0.18, canvas.height * 0.5, canvas.width * 0.22, canvas.height * 0.58, canvas.width * 0.24, canvas.height * 0.65);
  ctx.bezierCurveTo(canvas.width * 0.22, canvas.height * 0.8, canvas.width * 0.18, canvas.height * 0.85, canvas.width * 0.16, canvas.height * 0.9);
  ctx.bezierCurveTo(canvas.width * 0.14, canvas.height * 0.85, canvas.width * 0.13, canvas.height * 0.7, canvas.width * 0.15, canvas.height * 0.55);
  ctx.fill();

  // Africa/Europe - elongated
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.4, canvas.height * 0.2);
  ctx.bezierCurveTo(canvas.width * 0.45, canvas.height * 0.15, canvas.width * 0.52, canvas.height * 0.18, canvas.width * 0.55, canvas.height * 0.25);
  ctx.bezierCurveTo(canvas.width * 0.58, canvas.height * 0.4, canvas.width * 0.56, canvas.height * 0.6, canvas.width * 0.52, canvas.height * 0.75);
  ctx.bezierCurveTo(canvas.width * 0.48, canvas.height * 0.8, canvas.width * 0.42, canvas.height * 0.75, canvas.width * 0.4, canvas.height * 0.6);
  ctx.bezierCurveTo(canvas.width * 0.38, canvas.height * 0.4, canvas.width * 0.4, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.2);
  ctx.fill();

  // Asia - large irregular shape
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.58, canvas.height * 0.15);
  ctx.bezierCurveTo(canvas.width * 0.75, canvas.height * 0.1, canvas.width * 0.85, canvas.height * 0.2, canvas.width * 0.9, canvas.height * 0.35);
  ctx.bezierCurveTo(canvas.width * 0.88, canvas.height * 0.5, canvas.width * 0.8, canvas.height * 0.55, canvas.width * 0.7, canvas.height * 0.5);
  ctx.bezierCurveTo(canvas.width * 0.65, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.25, canvas.width * 0.58, canvas.height * 0.15);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.82, canvas.height * 0.72, 60, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Simplified stylized terrain - remove hyper-realistic features per designer feedback
  // Focus on broad landmass shapes only, no specific terrain features
  ctx.globalAlpha = 1.0; // Keep full opacity for clean stylized look

  // Softened polar ice caps - ethereal transitions per designer feedback
  const polarGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.2);
  polarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  polarGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  polarGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

  ctx.fillStyle = polarGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.12);

  const southPolarGradient = ctx.createLinearGradient(0, canvas.height * 0.8, 0, canvas.height);
  southPolarGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  southPolarGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  southPolarGradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

  ctx.fillStyle = southPolarGradient;
  ctx.fillRect(0, canvas.height * 0.88, canvas.width, canvas.height * 0.12);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;

  return texture;
};

// Create Earth night texture with city lights
export const createEarthNightTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = 2048;
  canvas.height = 1024;

  // Dark base
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Realistic city light distribution
  ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
  ctx.shadowBlur = 4;

  // Create realistic urban corridors and megalopolises
  const urbanAreas = [
    // North American East Coast (BosWash corridor)
    { x: 0.08, y: 0.33, w: 0.04, h: 0.08, intensity: 0.9 },
    // California
    { x: 0.02, y: 0.37, w: 0.015, h: 0.06, intensity: 0.7 },
    // Great Lakes region
    { x: 0.10, y: 0.35, w: 0.03, h: 0.04, intensity: 0.6 },

    // European megalopolis
    { x: 0.42, y: 0.25, w: 0.08, h: 0.06, intensity: 0.8 },
    // UK
    { x: 0.41, y: 0.22, w: 0.02, h: 0.03, intensity: 0.7 },

    // East Asia - Japan
    { x: 0.84, y: 0.32, w: 0.02, h: 0.05, intensity: 0.9 },
    // China east coast
    { x: 0.72, y: 0.32, w: 0.05, h: 0.08, intensity: 0.8 },
    // Korea
    { x: 0.81, y: 0.31, w: 0.01, h: 0.02, intensity: 0.7 },

    // India
    { x: 0.62, y: 0.42, w: 0.04, h: 0.06, intensity: 0.6 },

    // Australia east coast
    { x: 0.81, y: 0.71, w: 0.02, h: 0.04, intensity: 0.5 },

    // South America - Brazil
    { x: 0.16, y: 0.62, w: 0.03, h: 0.08, intensity: 0.5 },
    // Argentina
    { x: 0.15, y: 0.78, w: 0.02, h: 0.04, intensity: 0.4 },

    // Africa - Nigeria
    { x: 0.44, y: 0.52, w: 0.02, h: 0.03, intensity: 0.3 },
    // South Africa
    { x: 0.47, y: 0.78, w: 0.02, h: 0.02, intensity: 0.4 },

    // Middle East
    { x: 0.52, y: 0.35, w: 0.03, h: 0.04, intensity: 0.5 },
  ];

  urbanAreas.forEach(area => {
    const gradient = ctx.createRadialGradient(
      canvas.width * (area.x + area.w/2),
      canvas.height * (area.y + area.h/2),
      0,
      canvas.width * (area.x + area.w/2),
      canvas.height * (area.y + area.h/2),
      Math.max(canvas.width * area.w, canvas.height * area.h) / 2
    );

    gradient.addColorStop(0, `rgba(255, 220, 120, ${area.intensity})`);
    gradient.addColorStop(0.3, `rgba(255, 180, 80, ${area.intensity * 0.7})`);
    gradient.addColorStop(0.6, `rgba(255, 140, 60, ${area.intensity * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 120, 40, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(
      canvas.width * area.x,
      canvas.height * area.y,
      canvas.width * area.w,
      canvas.height * area.h
    );

    // Add individual bright spots within urban areas
    ctx.fillStyle = `rgba(255, 255, 255, ${area.intensity * 0.8})`;
    const spotCount = Math.floor(area.w * area.h * 1000);

    for (let i = 0; i < spotCount; i++) {
      const x = canvas.width * (area.x + Math.random() * area.w);
      const y = canvas.height * (area.y + Math.random() * area.h);
      const size = Math.random() * 2 + 0.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Add transportation corridors (highways, railways)
  ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
  ctx.lineWidth = 1;

  // Major transportation lines
  const corridors = [
    // Trans-continental US
    [[0.02, 0.4], [0.22, 0.38]],
    // European network
    [[0.40, 0.28], [0.50, 0.30]],
    // Trans-Siberian
    [[0.50, 0.20], [0.85, 0.25]],
    // China coast
    [[0.72, 0.30], [0.78, 0.42]],
  ];

  corridors.forEach(corridor => {
    ctx.beginPath();
    ctx.moveTo(canvas.width * corridor[0][0], canvas.height * corridor[0][1]);
    ctx.lineTo(canvas.width * corridor[1][0], canvas.height * corridor[1][1]);
    ctx.stroke();
  });

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;

  return texture;
};

// Create Earth normal/bump map for terrain
export const createEarthNormalTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = 1024;
  canvas.height = 512;

  // Base gray (no displacement)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mountain ranges (brighter = higher elevation)
  ctx.fillStyle = '#b0b0b0';

  // Himalayas
  ctx.fillRect(canvas.width * 0.6, canvas.height * 0.25, canvas.width * 0.15, canvas.height * 0.05);

  // Rockies
  ctx.fillRect(canvas.width * 0.08, canvas.height * 0.25, canvas.width * 0.03, canvas.height * 0.3);

  // Andes
  ctx.fillRect(canvas.width * 0.15, canvas.height * 0.5, canvas.width * 0.02, canvas.height * 0.4);

  // Alps
  ctx.fillRect(canvas.width * 0.42, canvas.height * 0.25, canvas.width * 0.04, canvas.height * 0.03);

  // Ocean trenches (darker = lower)
  ctx.fillStyle = '#404040';

  // Pacific trench
  ctx.fillRect(canvas.width * 0.9, canvas.height * 0.3, canvas.width * 0.02, canvas.height * 0.4);

  // Atlantic ridge
  ctx.fillRect(canvas.width * 0.25, canvas.height * 0.1, canvas.width * 0.02, canvas.height * 0.8);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;

  return texture;
};

// Create Earth specular/roughness map (water vs land)
export const createEarthSpecularTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = 1024;
  canvas.height = 512;

  // Ocean base (white = shiny/low roughness for water)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Land masses (black = rough/no reflection) - match the day texture exactly
  ctx.fillStyle = '#000000';

  // North America - more realistic shape matching day texture
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.05, canvas.height * 0.25);
  ctx.bezierCurveTo(canvas.width * 0.08, canvas.height * 0.2, canvas.width * 0.15, canvas.height * 0.22, canvas.width * 0.22, canvas.height * 0.3);
  ctx.bezierCurveTo(canvas.width * 0.25, canvas.height * 0.35, canvas.width * 0.2, canvas.height * 0.45, canvas.width * 0.15, canvas.height * 0.5);
  ctx.bezierCurveTo(canvas.width * 0.1, canvas.height * 0.48, canvas.width * 0.05, canvas.height * 0.4, canvas.width * 0.05, canvas.height * 0.25);
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.15, canvas.height * 0.55);
  ctx.bezierCurveTo(canvas.width * 0.18, canvas.height * 0.5, canvas.width * 0.22, canvas.height * 0.58, canvas.width * 0.24, canvas.height * 0.65);
  ctx.bezierCurveTo(canvas.width * 0.22, canvas.height * 0.8, canvas.width * 0.18, canvas.height * 0.85, canvas.width * 0.16, canvas.height * 0.9);
  ctx.bezierCurveTo(canvas.width * 0.14, canvas.height * 0.85, canvas.width * 0.13, canvas.height * 0.7, canvas.width * 0.15, canvas.height * 0.55);
  ctx.fill();

  // Africa/Europe - elongated
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.4, canvas.height * 0.2);
  ctx.bezierCurveTo(canvas.width * 0.45, canvas.height * 0.15, canvas.width * 0.52, canvas.height * 0.18, canvas.width * 0.55, canvas.height * 0.25);
  ctx.bezierCurveTo(canvas.width * 0.58, canvas.height * 0.4, canvas.width * 0.56, canvas.height * 0.6, canvas.width * 0.52, canvas.height * 0.75);
  ctx.bezierCurveTo(canvas.width * 0.48, canvas.height * 0.8, canvas.width * 0.42, canvas.height * 0.75, canvas.width * 0.4, canvas.height * 0.6);
  ctx.bezierCurveTo(canvas.width * 0.38, canvas.height * 0.4, canvas.width * 0.4, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.2);
  ctx.fill();

  // Asia - large irregular shape
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.58, canvas.height * 0.15);
  ctx.bezierCurveTo(canvas.width * 0.75, canvas.height * 0.1, canvas.width * 0.85, canvas.height * 0.2, canvas.width * 0.9, canvas.height * 0.35);
  ctx.bezierCurveTo(canvas.width * 0.88, canvas.height * 0.5, canvas.width * 0.8, canvas.height * 0.55, canvas.width * 0.7, canvas.height * 0.5);
  ctx.bezierCurveTo(canvas.width * 0.65, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.25, canvas.width * 0.58, canvas.height * 0.15);
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.82, canvas.height * 0.72, 60, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Add some coastal variation (gray = medium roughness for beaches/coasts)
  ctx.fillStyle = '#808080';
  ctx.lineWidth = 3;

  // Create coastal outlines for major continents
  const coastlines = [
    // North America coast
    { x: 0.05, y: 0.25, w: 0.17, h: 0.25 },
    // South America coast
    { x: 0.13, y: 0.55, w: 0.11, h: 0.35 },
    // Africa coast
    { x: 0.38, y: 0.2, w: 0.2, h: 0.55 },
    // Asia coast
    { x: 0.56, y: 0.15, w: 0.34, h: 0.4 },
  ];

  coastlines.forEach(coast => {
    // Create rough coastal edge
    for (let i = 0; i < 20; i++) {
      const x = coast.x * canvas.width + Math.random() * coast.w * canvas.width;
      const y = coast.y * canvas.height + Math.random() * coast.h * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Ice caps - very reflective (white)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.08);
  ctx.fillRect(0, canvas.height * 0.92, canvas.width, canvas.height * 0.08);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;

  return texture;
};

// Create realistic cloud texture for atmosphere layer
export const createEarthCloudTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = 2048;
  canvas.height = 1024;

  // Transparent base
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Create realistic weather patterns

  // Skip equatorial convergence zone to avoid white horizontal line

  // Trade wind cloud bands
  const tradeWinds = [
    { y: canvas.height * 0.3, opacity: 0.4 },
    { y: canvas.height * 0.7, opacity: 0.4 }
  ];

  tradeWinds.forEach(band => {
    const bandGradient = ctx.createLinearGradient(0, band.y - 20, 0, band.y + 20);
    bandGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    bandGradient.addColorStop(0.5, `rgba(255, 255, 255, ${band.opacity})`);
    bandGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = bandGradient;
    ctx.fillRect(0, band.y - 20, canvas.width, 40);
  });

  // Hurricane/cyclone systems
  const storms = [
    { x: canvas.width * 0.15, y: canvas.height * 0.35, size: 80, intensity: 0.8 },
    { x: canvas.width * 0.85, y: canvas.height * 0.25, size: 60, intensity: 0.7 },
    { x: canvas.width * 0.75, y: canvas.height * 0.65, size: 70, intensity: 0.6 },
  ];

  storms.forEach(storm => {
    // Create spiral pattern
    ctx.fillStyle = `rgba(255, 255, 255, ${storm.intensity})`;

    for (let spiral = 0; spiral < 3; spiral++) {
      for (let angle = 0; angle < Math.PI * 6; angle += 0.05) {
        const radius = (angle / (Math.PI * 6)) * storm.size;
        const spiralOffset = spiral * (Math.PI * 2 / 3);
        const x = storm.x + Math.cos(angle + spiralOffset) * radius;
        const y = storm.y + Math.sin(angle + spiralOffset) * radius * 0.8;

        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const size = Math.max(1, storm.size / 40 - (radius / storm.size) * 5);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  });

  // Frontal systems with organic cloud patches
  const frontSystems = [
    { x: canvas.width * 0.1, y: canvas.height * 0.25, w: canvas.width * 0.3, h: canvas.height * 0.05 },
    { x: canvas.width * 0.45, y: canvas.height * 0.28, w: canvas.width * 0.25, h: canvas.height * 0.04 },
    { x: canvas.width * 0.6, y: canvas.height * 0.75, w: canvas.width * 0.2, h: canvas.height * 0.04 },
  ];

  frontSystems.forEach(front => {
    // Create organic cloud patches instead of lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    for (let i = 0; i < 30; i++) {
      const x = front.x + Math.random() * front.w;
      const y = front.y + Math.random() * front.h + (Math.random() - 0.5) * 20;
      const size = Math.random() * 18 + 8;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Monsoon clouds (Asia)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const monsoonRegion = {
    x: canvas.width * 0.6,
    y: canvas.height * 0.35,
    w: canvas.width * 0.25,
    h: canvas.height * 0.3
  };

  for (let i = 0; i < 150; i++) {
    const x = monsoonRegion.x + Math.random() * monsoonRegion.w;
    const y = monsoonRegion.y + Math.random() * monsoonRegion.h;
    const size = Math.random() * 12 + 3;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar cloud coverage
  const polarOpacity = 0.9;

  // Arctic clouds
  const arcticGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.2);
  arcticGradient.addColorStop(0, `rgba(255, 255, 255, ${polarOpacity})`);
  arcticGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = arcticGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15);

  // Antarctic clouds
  const antarcticGradient = ctx.createLinearGradient(0, canvas.height * 0.8, 0, canvas.height);
  antarcticGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  antarcticGradient.addColorStop(1, `rgba(255, 255, 255, ${polarOpacity})`);
  ctx.fillStyle = antarcticGradient;
  ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;

  return texture;
};