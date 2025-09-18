import { forwardRef, useMemo } from 'react';
import { ShaderMaterial, Color } from 'three';
import { extend } from '@react-three/fiber';

// Custom shader material for realistic Earth with ocean/continent differentiation
class EarthPlanetShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D normalTexture;
        uniform sampler2D specularTexture;
        uniform float time;
        uniform vec3 emissiveColor;
        uniform float emissiveIntensity;

        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        // Simple noise function for terrain variation
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          // Sample the day texture
          vec4 dayColor = texture2D(dayTexture, vUv);

          // Detect ocean vs land based on color
          // Ocean areas will be blue-ish, land areas will be green-ish
          float oceanMask = step(0.6, dayColor.b); // Blue channel indicates ocean
          float landMask = 1.0 - oceanMask;

          // Generate procedural normal variation for continents
          vec2 noiseUv = vUv * 8.0;
          float heightNoise = noise(noiseUv) * 0.5 + noise(noiseUv * 2.0) * 0.25;

          // Calculate modified normal for land areas
          vec3 normal = vNormal;
          if (landMask > 0.5) {
            // Add subtle height variation to continents
            float normalStrength = 0.3;
            vec3 normalOffset = vec3(
              (noise(noiseUv + vec2(0.1, 0.0)) - 0.5) * normalStrength,
              (noise(noiseUv + vec2(0.0, 0.1)) - 0.5) * normalStrength,
              0.0
            );
            normal = normalize(vNormal + normalOffset);
          }

          // Material properties based on surface type
          float roughness = mix(0.1, 0.8, landMask); // Ocean smooth, land rough
          float metalness = mix(0.05, 0.0, landMask); // Ocean slightly metallic, land not

          // Basic lighting calculation
          vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
          float lightIntensity = max(dot(normal, lightDirection), 0.3); // Minimum ambient

          // Specular highlight for oceans
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          vec3 reflectDirection = reflect(-lightDirection, normal);
          float specular = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0) * oceanMask * 0.5;

          // Final color
          vec3 finalColor = dayColor.rgb * lightIntensity + vec3(specular);
          finalColor += emissiveColor * emissiveIntensity;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        dayTexture: { value: null },
        normalTexture: { value: null },
        specularTexture: { value: null },
        time: { value: 0 },
        emissiveColor: { value: new Color('#FFFFFF') },
        emissiveIntensity: { value: 0.05 }
      }
    });
  }
}

// Extend Three.js for react-three-fiber
extend({ EarthPlanetShaderMaterial });

// TypeScript declaration for the custom material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      earthPlanetShaderMaterial: any;
    }
  }
}

interface EarthPlanetMaterialProps {
  dayTexture?: any;
  normalTexture?: any;
  specularTexture?: any;
  time?: number;
}

export const EarthPlanetMaterial = forwardRef<ShaderMaterial, EarthPlanetMaterialProps>(
  ({ dayTexture, normalTexture, specularTexture, time = 0 }, ref) => {
    const material = useMemo(() => new EarthPlanetShaderMaterial(), []);

    // Update uniforms
    if (material.uniforms.dayTexture && dayTexture) {
      material.uniforms.dayTexture.value = dayTexture;
    }
    if (material.uniforms.normalTexture && normalTexture) {
      material.uniforms.normalTexture.value = normalTexture;
    }
    if (material.uniforms.specularTexture && specularTexture) {
      material.uniforms.specularTexture.value = specularTexture;
    }
    if (material.uniforms.time) {
      material.uniforms.time.value = time;
    }

    return <primitive object={material} ref={ref} />;
  }
);

EarthPlanetMaterial.displayName = 'EarthPlanetMaterial';