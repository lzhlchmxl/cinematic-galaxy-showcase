import { Vector3 } from 'three';

export const createFaviconFromConstellation = (size: number = 32): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Dark space background
  ctx.fillStyle = '#000011';
  ctx.fillRect(0, 0, size, size);

  // Create a circular constellation pattern inspired by "KW CONSTELLATION"
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  // Create constellation points in a circular pattern
  const points: Vector3[] = [];
  const numPoints = 12; // 12 points for a nice circular constellation

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push(new Vector3(x, y, 0));
  }

  // Add some inner constellation points
  const innerPoints = 6;
  for (let i = 0; i < innerPoints; i++) {
    const angle = (i / innerPoints) * Math.PI * 2 + Math.PI / innerPoints;
    const x = centerX + Math.cos(angle) * (radius * 0.6);
    const y = centerY + Math.sin(angle) * (radius * 0.6);
    points.push(new Vector3(x, y, 0));
  }

  // Add center point
  points.push(new Vector3(centerX, centerY, 0));

  // Draw constellation lines (connecting outer points)
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = size > 32 ? 2 : 1;
  ctx.globalAlpha = 0.6;

  // Draw outer circle connection
  ctx.beginPath();
  for (let i = 0; i < numPoints; i++) {
    const current = points[i];
    const next = points[(i + 1) % numPoints];

    if (i === 0) {
      ctx.moveTo(current.x, current.y);
    }
    ctx.lineTo(next.x, next.y);
  }
  ctx.stroke();

  // Draw inner connections to center
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = size > 32 ? 1 : 0.5;
  for (let i = 0; i < numPoints; i += 2) {
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
  }

  // Draw constellation stars
  ctx.globalAlpha = 1;
  points.forEach((point, index) => {
    const starSize = index < numPoints ? (size > 32 ? 3 : 2) : (size > 32 ? 2 : 1.5);

    // Create glowing star effect
    const gradient = ctx.createRadialGradient(
      point.x, point.y, 0,
      point.x, point.y, starSize * 2
    );
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.5, '#FFD700');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, starSize * 2, 0, Math.PI * 2);
    ctx.fill();

    // Bright star center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(point.x, point.y, starSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas.toDataURL('image/png');
};

export const generateAllFaviconSizes = (): { [key: string]: string } => {
  const sizes = [16, 32, 48, 64, 128, 192, 512];
  const favicons: { [key: string]: string } = {};

  sizes.forEach(size => {
    favicons[`${size}x${size}`] = createFaviconFromConstellation(size);
  });

  return favicons;
};

// Utility to download favicon files
export const downloadFavicon = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Create and save all favicon sizes to public directory (for development use)
export const generateFaviconFiles = () => {
  const favicons = generateAllFaviconSizes();

  // This would typically be done build-time or server-side
  // For now, we'll just return the data URLs for manual saving
  console.log('Generated favicon data URLs:', favicons);

  // Download the main favicon
  downloadFavicon(favicons['32x32'], 'favicon-32x32.png');
  downloadFavicon(favicons['16x16'], 'favicon-16x16.png');
  downloadFavicon(favicons['192x192'], 'android-chrome-192x192.png');
  downloadFavicon(favicons['512x512'], 'android-chrome-512x512.png');

  return favicons;
};