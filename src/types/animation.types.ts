export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
}

export interface PlanetAnimationState {
  scale: number;
  rotation: number;
  glowIntensity: number;
  pulsePhase: number;
}

export interface ConstellationPoint {
  x: number;
  y: number;
  z: number;
  delay: number;
  isActive: boolean;
}