Stack & addons

react-three-fiber, @react-three/drei

@react-three/postprocessing (Bloom, ChromaticAberration)

Optional textures/HDRIs: PolyHaven studio/space HDRI; Earth day/night, normal, clouds

Visual recipe (what sells the look)

Planet (stylized-Earth sphere)

meshStandardMaterial or meshPhysicalMaterial

Maps: day (albedo), night (emissiveMap), normal/bump (subtle), roughness (water vs land)

Slight oblate scaling (Y ~ 0.97) and axial tilt (~23°) for realism

Atmosphere rim: thin BackSide sphere with transparent blue; or <EffectComposer><Bloom/></EffectComposer> for glow

Orbiting “tracks” (rings)

Not a flat ring: use multiple TubeGeometry lanes (3–6) around the equator with slightly different radii/noise → reads as “transport tracks”.

Material: MeshPhysicalMaterial glass/tech vibe
transmission: 0.9, thickness: 0.2, roughness: 0.15, clearcoat: 1, ior: 1.2
Add moving light streaks by scrolling a thin stripe texture: animate map.offset.x += speed * dt.

For extra tech: sprinkle instanced “pods” (small capsules) that orbit; cheap wow.

Billboard

Physical sign (panel + struts) tilted/anchored near the north hemisphere.

Text via <Text> (drei) or a CanvasTexture so you can stylize “Wuga Tech” dynamically.

Material with emissive + bloom to get that neon pop.

Optional: use <Billboard> (drei) if you want it to always face the camera; otherwise keep it fixed like the mock.

Lighting

One strong DirectionalLight (“sun”) for day/night; low AmbientLight.

Environment: space or studio HDRI for nice reflections on the glassy tracks.

Post-FX: Bloom (low threshold), ChromaticAberration (very subtle).

Drop-in R3F components (TypeScript)
// Scene.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stars, Text, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { MathUtils, Vector3, CatmullRomCurve3 } from 'three'

export default function Scene() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 55, position: [0, 0, 16] }}>
      <color attach="background" args={['#000']} />
      <Lights />
      <Environment files="/hdris/space_small.hdr" intensity={0.7} />
      <Stars radius={200} depth={50} count={5000} factor={3} saturation={0} fade />
      <group rotation-x={MathUtils.degToRad(23.5)}>
        <Planet />
        <Tracks lanes={5} />
        <Billboard text="Wuga Tech" />
      </group>
      <OrbitControls enablePan={false} minDistance={10} maxDistance={40} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.8} luminanceThreshold={0.35} />
        <ChromaticAberration offset={[0.0007, 0.0005]} />
      </EffectComposer>
    </Canvas>
  )
}

function Lights() {
  return (
    <>
      <directionalLight position={[6, 3, 4]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
      <ambientLight intensity={0.05} />
    </>
  )
}

Planet (stylized Earth + atmosphere)
function Planet() {
  const [day, night, normal, rough] = useTexture([
    '/textures/earth_day_8k.jpg',
    '/textures/earth_night_8k.jpg',
    '/textures/earth_normal_4k.jpg',
    '/textures/earth_roughness_4k.jpg'
  ])
  day.colorSpace = night.colorSpace = THREE.SRGBColorSpace
  const earthRef = React.useRef<THREE.Mesh>(null!)

  // slow rotation for life
  useFrame((_, dt) => (earthRef.current.rotation.y += dt * 0.02))

  return (
    <group scale={[1, 0.97, 1]}>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[5, 128, 128]} />
        <meshStandardMaterial
          map={day}
          normalMap={normal}
          roughnessMap={rough}
          roughness={0.85}
          metalness={0}
          emissiveMap={night}
          emissiveIntensity={0.7}
          emissive={new THREE.Color('#ffedc2')}
        />
      </mesh>

      {/* simple rim-atmosphere */}
      <mesh>
        <sphereGeometry args={[5.15, 64, 64]} />
        <meshBasicMaterial color="#4aa8ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

Tracks (multi-lane glass tubes with scrolling highlights)
type TracksProps = { lanes?: number }
function Tracks({ lanes = 4 }: TracksProps) {
  const group = React.useRef<THREE.Group>(null!)
  // thin stripe texture that we will scroll
  const stripe = useTexture('/textures/stripe_glow.png')
  stripe.wrapS = stripe.wrapT = THREE.RepeatWrapping
  stripe.repeat.set(20, 1)

  // prebuild lane curves
  const curves = React.useMemo(() => {
    const arr: CatmullRomCurve3[] = []
    for (let i = 0; i < lanes; i++) {
      const r = 7 + i * 0.5 + (i % 2 ? 0.15 : -0.15) // slight variation
      const pts = Array.from({ length: 200 }, (_, k) => {
        const t = (k / 200) * Math.PI * 2
        // tiny vertical noise so lanes don’t look perfectly flat
        const y = Math.sin(t * 3 + i) * 0.08
        return new Vector3(Math.cos(t) * r, y, Math.sin(t) * r)
      })
      arr.push(new CatmullRomCurve3(pts, true, 'catmullrom', 0.0))
    }
    return arr
  }, [lanes])

  useFrame((_, dt) => {
    // animate stripe flow on all materials
    group.current.traverse(obj => {
      const m = (obj as THREE.Mesh).material as THREE.MeshPhysicalMaterial
      if (m?.map) { m.map.offset.x += dt * 0.15 }
    })
  })

  return (
    <group ref={group}>
      {curves.map((curve, i) => (
        <mesh key={i} castShadow receiveShadow>
          <tubeGeometry args={[curve, 800, 0.18, 24, true]} />
          <meshPhysicalMaterial
            transmission={0.9}
            thickness={0.25}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.2}
            map={stripe}
            transparent
            envMapIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  )
}

Billboard (glowing sign + strut)
function Billboard({ text }: { text: string }) {
  // dynamic texture from canvas so agents can change copy easily
  const canvas = React.useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024; c.height = 256
    const g = c.getContext('2d')!
    const grad = g.createLinearGradient(0, 0, c.width, 0)
    grad.addColorStop(0, '#23a6ff'); grad.addColorStop(1, '#71ffcc')
    g.fillStyle = '#0b1020'; g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = grad
    g.font = 'bold 140px Inter, sans-serif'
    g.textAlign = 'center'; g.textBaseline = 'middle'
    g.fillText(text, c.width / 2, c.height / 2 + 10)
    return new THREE.CanvasTexture(c)
  }, [text])
  canvas.colorSpace = THREE.SRGBColorSpace

  return (
    <group position={[0, 6.4, 0]} rotation={[MathUtils.degToRad(-20), MathUtils.degToRad(25), 0]}>
      {/* pole */}
      <mesh position={[0, -1.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 3.2, 12]} />
        <meshStandardMaterial metalness={0.9} roughness={0.3} color="#9fb2c8" />
      </mesh>
      {/* panel */}
      <mesh castShadow>
        <planeGeometry args={[6, 1.6]} />
        <meshStandardMaterial
          map={canvas}
          emissiveMap={canvas}
          emissiveIntensity={1.6}
          emissive={'#7fe7ff'}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* little braces */}
      <mesh position={[0, -0.9, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.03, 8, 24]} />
        <meshStandardMaterial metalness={0.8} roughness={0.3} color="#9fb2c8" />
      </mesh>
    </group>
  )
}

Asset notes

HDRI: space_small.hdr (or a studio HDRI for shinier tracks) from PolyHaven.

Stripe texture: a 1024×64 PNG with a few thin bright lines on transparent bg.

Earth maps: day, night, normal, roughness (4–8K). Downscale to 4K if VRAM spikes.

Tweaks for that “promo image” feel

Increase Bloom intensity slightly and lower luminanceThreshold until billboard and track streaks glow just right.

Add a faint FogExp2 with small density to get that glossy “rendered” depth.

If you want perfectly camera-facing billboard, wrap the panel with <Billboard> from drei. If you want it fixed like the mock, keep as-is.

Performance tips (desktop first, but smooth)

Tube segments (800) and sphere segments (128) are lavish; drop to 400 / 96 if needed.

If you add dozens of pods on lanes, use InstancedMesh.

Use <Preload all /> from drei to upload textures before reveal.