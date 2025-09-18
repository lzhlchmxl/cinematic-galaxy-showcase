import { Vector3 } from 'three';

export const generateSpherePosition = (
  radius: number,
  index: number,
  total: number,
  randomFactor: number = 0.3
): Vector3 => {
  // Use golden ratio for optimal sphere distribution
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const theta = 2 * Math.PI * index / goldenRatio;
  const phi = Math.acos(1 - 2 * index / total);

  // Add some randomness for organic feel
  const radiusVariation = radius * (1 + (Math.random() - 0.5) * randomFactor);

  const x = radiusVariation * Math.sin(phi) * Math.cos(theta);
  const y = radiusVariation * Math.cos(phi);
  const z = radiusVariation * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
};

export const calculateOptimalCameraPosition = (
  targetPosition: Vector3,
  distance: number = 30
): Vector3 => {
  const direction = targetPosition.clone().normalize();
  return direction.multiplyScalar(-distance);
};

export const smoothLerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const calculatePlanetScale = (
  baseScale: number,
  distance: number,
  maxDistance: number
): number => {
  // Scale planets based on distance from camera
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  return baseScale * (0.5 + 0.5 * (1 - normalizedDistance));
};

export const getConstellationPoints = (): Vector3[] => {
  // Simple constellation points for "BILL LIANG"
  // This would be expanded with actual letter coordinates
  const points: Vector3[] = [];

  // Basic letter shapes (simplified)
  const letterSpacing = 8;
  const startX = -20;

  // B
  points.push(new Vector3(startX, 5, 0));
  points.push(new Vector3(startX, 0, 0));
  points.push(new Vector3(startX, -5, 0));
  points.push(new Vector3(startX + 3, 5, 0));
  points.push(new Vector3(startX + 3, 0, 0));

  // I
  points.push(new Vector3(startX + letterSpacing, 5, 0));
  points.push(new Vector3(startX + letterSpacing, 0, 0));
  points.push(new Vector3(startX + letterSpacing, -5, 0));

  // L
  points.push(new Vector3(startX + letterSpacing * 2, 5, 0));
  points.push(new Vector3(startX + letterSpacing * 2, 0, 0));
  points.push(new Vector3(startX + letterSpacing * 2, -5, 0));
  points.push(new Vector3(startX + letterSpacing * 2 + 3, -5, 0));

  // L
  points.push(new Vector3(startX + letterSpacing * 3, 5, 0));
  points.push(new Vector3(startX + letterSpacing * 3, 0, 0));
  points.push(new Vector3(startX + letterSpacing * 3, -5, 0));
  points.push(new Vector3(startX + letterSpacing * 3 + 3, -5, 0));

  return points;
};