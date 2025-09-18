import { CanvasTexture, RepeatWrapping } from 'three';

// Create procedural Saturn surface texture with cloud bands
export const createSaturnTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Saturn's golden color palette
  const colors = [
    '#F4E4BC',  // Light cream
    '#E6D2A3',  // Pale gold
    '#D9C18A',  // Medium gold
    '#CCB071',  // Dark gold
    '#BF9F58',  // Deep gold
    '#B28E3F'   // Bronze gold
  ];

  // Create horizontal bands (latitude-based)
  const bandHeight = canvas.height / colors.length;

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
  });

  // Add subtle noise and variations
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const variation = (Math.random() - 0.5) * 10;
    data[i] = Math.max(0, Math.min(255, data[i] + variation));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation)); // B
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
};

// Create procedural ring texture with gaps
export const createSaturnRingTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Ring colors from inner to outer
  const ringData = [
    { start: 0.0, end: 0.2, color: '#C4A484', opacity: 0.9 },    // D Ring (sparse)
    { start: 0.2, end: 0.3, color: '#D4B594', opacity: 0.95 },   // C Ring
    { start: 0.3, end: 0.32, color: '#E4C5A4', opacity: 0.3 },   // Cassini Division (gap)
    { start: 0.32, end: 0.6, color: '#D4B594', opacity: 0.98 },  // B Ring (densest)
    { start: 0.6, end: 0.62, color: '#C4A484', opacity: 0.4 },   // Cassini Division outer
    { start: 0.62, end: 0.85, color: '#E4C5A4', opacity: 0.9 },  // A Ring
    { start: 0.85, end: 0.87, color: '#B8967B', opacity: 0.2 },  // Encke Gap
    { start: 0.87, end: 1.0, color: '#D4B594', opacity: 0.6 }    // F Ring
  ];

  // Fill with transparent background
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw rings
  ringData.forEach(ring => {
    const startX = ring.start * canvas.width;
    const endX = ring.end * canvas.width;

    ctx.fillStyle = ring.color;
    ctx.globalAlpha = ring.opacity;
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

    // Add some texture variation
    ctx.globalAlpha = ring.opacity * 0.3;
    for (let x = startX; x < endX; x += 2) {
      if (Math.random() > 0.7) {
        ctx.fillRect(x, 0, 1, canvas.height);
      }
    }
  });

  ctx.globalAlpha = 1.0;

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
};

// Create ring alpha map for transparency
export const createSaturnRingAlphaTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Alpha values for different ring regions
  const alphaData = [
    { start: 0.0, end: 0.2, alpha: 0.3 },    // D Ring (very sparse)
    { start: 0.2, end: 0.3, alpha: 0.7 },    // C Ring
    { start: 0.3, end: 0.32, alpha: 0.1 },   // Cassini Division (major gap)
    { start: 0.32, end: 0.6, alpha: 0.95 },  // B Ring (very dense)
    { start: 0.6, end: 0.62, alpha: 0.2 },   // Cassini Division outer
    { start: 0.62, end: 0.85, alpha: 0.8 },  // A Ring
    { start: 0.85, end: 0.87, alpha: 0.05 }, // Encke Gap (major gap)
    { start: 0.87, end: 1.0, alpha: 0.4 }    // F Ring (sparse)
  ];

  // Fill with transparent
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw alpha regions
  alphaData.forEach(region => {
    const startX = region.start * canvas.width;
    const endX = region.end * canvas.width;
    const alpha = Math.floor(region.alpha * 255);

    ctx.fillStyle = `rgba(${alpha},${alpha},${alpha},1)`;
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

    // Add variation for realism
    for (let x = startX; x < endX; x++) {
      if (Math.random() > 0.8) {
        const variation = (Math.random() - 0.5) * 0.3 * alpha;
        const newAlpha = Math.max(0, Math.min(255, alpha + variation));
        ctx.fillStyle = `rgba(${newAlpha},${newAlpha},${newAlpha},1)`;
        ctx.fillRect(x, 0, 1, canvas.height);
      }
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
};