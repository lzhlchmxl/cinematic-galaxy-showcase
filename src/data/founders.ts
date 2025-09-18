import { Vector3 } from 'three';
import type { Founder } from '../types/founder.types';

// Helper function to create 3D positions in a sphere
const createSpherePosition = (radius: number, theta: number, phi: number): Vector3 => {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new Vector3(x, y, z);
};

// Updated with real ParentZ logo
export const founders: Founder[] = [
  {
    id: 'founder-1',
    name: '???',
    company: '???',
    description: 'Mysterious founder working on something amazing. Stay tuned for the big reveal!',
    position: createSpherePosition(16, 0.8, Math.PI / 3),
    color: '#666666',
    type: 'Mystery',
    portraitUrl: '/assets/founders/mystery.png',
    logoUrl: '/assets/logos/mystery.svg',
    planetScale: 1.2,
    links: {
      website: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'founder-2',
    name: 'Nick Sabamehr',
    company: 'ParentZ',
    description: 'Building the future of family connections and parenting support through innovative technology solutions.',
    position: createSpherePosition(13, Math.PI / 2.2, Math.PI / 2.1),
    color: '#DAA520',
    type: 'Saturn',
    portraitUrl: '/assets/founders/Nick_S_founder_photo.jpg',
    logoUrl: '/assets/logos/ParentZ_Logo.png',
    planetScale: 1.4,
    links: {
      website: 'https://d1cgzledorbwj9.cloudfront.net/login',
      linkedin: 'https://www.linkedin.com/in/sabamehrm/'
    }
  },
  {
    id: 'founder-3',
    name: 'Wuga Tech',
    company: 'Wuga Tech',
    description: 'Revolutionary technology solutions with advanced transport systems and cutting-edge infrastructure. Building the future of connected worlds.',
    position: createSpherePosition(19, Math.PI * 0.9, Math.PI / 4.2),
    color: '#23a6ff',
    type: 'WugaTech',
    portraitUrl: '/assets/founders/wuga_tech.png',
    logoUrl: '/assets/logos/wuga_tech.svg',
    planetScale: 1.3,
    links: {
      website: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'founder-4',
    name: '???',
    company: '???',
    description: 'Mysterious founder working on something amazing. Stay tuned for the big reveal!',
    position: createSpherePosition(15, 3 * Math.PI / 2.1, 2 * Math.PI / 2.8),
    color: '#666666',
    type: 'Mystery',
    portraitUrl: '/assets/founders/mystery.png',
    logoUrl: '/assets/logos/mystery.svg',
    planetScale: 1.0,
    links: {
      website: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'founder-5',
    name: '???',
    company: '???',
    description: 'Mysterious founder working on something amazing. Stay tuned for the big reveal!',
    position: createSpherePosition(17, Math.PI / 3.8, 5 * Math.PI / 5.5),
    color: '#666666',
    type: 'Mystery',
    portraitUrl: '/assets/founders/mystery.png',
    logoUrl: '/assets/logos/mystery.svg',
    planetScale: 0.8,
    links: {
      website: '#',
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 'founder-6',
    name: 'Tomiwa Olajide',
    company: 'MissionSync',
    description: 'Building AI-powered solutions to revolutionize project management and team collaboration. Focused on creating innovative technologies that help teams sync their missions and achieve breakthrough results.',
    position: createSpherePosition(14, Math.PI / 6, Math.PI / 1.8),
    color: '#4A90E2',
    type: 'Earth',
    portraitUrl: '/assets/founders/tomiwa_olajide.jpg',
    logoUrl: '/assets/logos/missionsync_logo.jpg',
    planetScale: 1.2,
    links: {
      website: 'https://mission-sync.com/',
      linkedin: 'https://www.linkedin.com/in/tomiwaolajide/',
    }
  }
];

export const galaxyConfig = {
  radius: 20,
  planetCount: founders.length,
  autoRotationSpeed: 0.005,
  cameraDistance: 30,
  minZoom: 15,
  maxZoom: 50
};