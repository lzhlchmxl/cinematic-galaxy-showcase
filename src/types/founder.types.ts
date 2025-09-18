import { Vector3 } from 'three';

export interface Founder {
  id: string;
  name: string;
  company: string;
  description: string;
  position: Vector3;
  color: string;
  type: string;
  portraitUrl: string;
  logoUrl: string;
  planetScale?: number;
  links: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface PlanetProps {
  founder: Founder;
  onHover: (founder: Founder | null) => void;
  onClick: (founder: Founder) => void;
  isHovered: boolean;
  isSelected: boolean;
}