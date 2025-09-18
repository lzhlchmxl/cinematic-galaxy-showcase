import { useRef, useEffect, forwardRef } from 'react';
import { Mesh, RingGeometry, Vector3, CanvasTexture } from 'three';

interface SaturnRingProps {
  innerRadius: number;
  outerRadius: number;
  segments?: number;
  texture?: CanvasTexture;
  alphaTexture?: CanvasTexture;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  isHovered?: boolean;
  color?: string;
}

export const SaturnRing = forwardRef<Mesh, SaturnRingProps>(({
  innerRadius,
  outerRadius,
  segments = 128,
  texture,
  alphaTexture,
  opacity = 0.6,
  roughness = 0.5,
  metalness = 0.0,
  castShadow = true,
  receiveShadow = true,
  isHovered = false,
  color = '#FFFFFF'
}, ref) => {
  const topMeshRef = useRef<Mesh>(null);
  const bottomMeshRef = useRef<Mesh>(null);

  // Fix UV mapping for radial textures
  const fixUVMapping = (mesh: Mesh) => {
    if (!mesh) return;

    const geometry = mesh.geometry as RingGeometry;
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    const v3 = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const radius = v3.length();

      // Map radius to U coordinate (0 = inner, 1 = outer)
      const u = (radius - innerRadius) / (outerRadius - innerRadius);
      uv.setX(i, u);
      uv.setY(i, 0.5);
    }

    uv.needsUpdate = true;
  };

  useEffect(() => {
    if (topMeshRef.current) fixUVMapping(topMeshRef.current);
    if (bottomMeshRef.current) fixUVMapping(bottomMeshRef.current);
  }, [innerRadius, outerRadius, segments]);

  return (
    <group>
      {/* Top ring face */}
      <mesh
        ref={ref || topMeshRef}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ringGeometry args={[innerRadius, outerRadius, segments, 1]} />
        <meshStandardMaterial
          color={color}
          map={texture}
          alphaMap={alphaTexture}
          transparent={true}
          opacity={isHovered ? Math.min(opacity * 1.3, 1.0) : opacity}
          side={0} // FrontSide
          roughness={roughness}
          metalness={metalness}
          alphaTest={0.1}
        />
      </mesh>

      {/* Bottom ring face */}
      <mesh
        ref={bottomMeshRef}
        rotation={[Math.PI / 2, Math.PI, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ringGeometry args={[innerRadius, outerRadius, segments, 1]} />
        <meshStandardMaterial
          color={color}
          map={texture}
          alphaMap={alphaTexture}
          transparent={true}
          opacity={isHovered ? Math.min(opacity * 1.3, 1.0) : opacity}
          side={0} // FrontSide
          roughness={roughness}
          metalness={metalness}
          alphaTest={0.1}
        />
      </mesh>
    </group>
  );
});

SaturnRing.displayName = 'SaturnRing';