import { Vector3 } from 'three';

export interface GalaxyConfig {
  radius: number;
  planetCount: number;
  autoRotationSpeed: number;
  cameraDistance: number;
  minZoom: number;
  maxZoom: number;
}

export interface CameraState {
  position: Vector3;
  target: Vector3;
  zoom: number;
}

export interface InteractionState {
  isHovering: boolean;
  hoveredPlanetId: string | null;
  selectedPlanetId: string | null;
  mousePosition: { x: number; y: number };
}