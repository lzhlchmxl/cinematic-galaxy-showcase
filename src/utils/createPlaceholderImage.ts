// Utility to create placeholder images for testing
export const createPlaceholderPortrait = (name: string, color: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;

  if (name === '???') {
    // Create mysterious silhouette for unknown founders
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, 2 * Math.PI);
    ctx.fill();

    // Add question marks
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 100, 100);
  } else {
    // Create circular portrait placeholder for known founders
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, 2 * Math.PI);
    ctx.fill();

    // Add initials
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();

    ctx.fillText(initials, 100, 100);
  }

  return canvas.toDataURL('image/png');
};

export const createPlaceholderLogo = (company: string, color: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 60;
  const ctx = canvas.getContext('2d')!;

  if (company === '???') {
    // Create mysterious logo for unknown companies
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.roundRect(0, 0, 120, 60, 8);
    ctx.fill();

    // Add question marks
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('???', 60, 30);
  } else {
    // Create rounded rectangle background for known companies
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, 0, 120, 60, 8);
    ctx.fill();

    // Add company initials
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const initials = company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();

    ctx.fillText(initials, 60, 30);
  }

  return canvas.toDataURL('image/png');
};