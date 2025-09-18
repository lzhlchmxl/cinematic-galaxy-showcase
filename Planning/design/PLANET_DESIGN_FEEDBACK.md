## Development Brief: Thematic Planets & Founder Showcase
To the Implementation Agent:

This brief outlines a significant enhancement to the planet rendering and interactivity. The goal is to transform each planet into a unique visual representation of its founder's company, complete with dynamic hover effects displaying founder portraits and company branding.

Key Principle: Differentiation and Narrative. Each planet should be distinct, reflecting its company's theme. The hover states should seamlessly provide context.

### Phase 1: Data Structure Enhancement (founders.ts)
The first step is to enrich our data to drive these visual changes.

Add type property: Introduce a type: string property for each founder to categorize the planet's visual theme (e.g., 'Robotics', 'Restaurant', 'Drone', 'BioTech', etc.).

Add portraitUrl property: Include portraitUrl: string for the founder's image. These should be high-resolution, transparent PNGs.

Add logoUrl property: Include logoUrl: string for the company's logo. These should be high-resolution SVG or transparent PNGs.

Add planetScale property (Optional but Recommended): While type can imply scale, explicit planetScale: number (e.g., 0.8 to 1.2) offers finer control over size variation.

TypeScript

// Example entry in founders.ts
export const founders = [
  {
    id: 'founder1',
    name: 'Alex Innovate',
    company: 'RoboDynamics',
    color: '#00ccff', // Base color for theme accent
    type: 'Robotics',
    portraitUrl: '/assets/founders/alex_innovate.png',
    logoUrl: '/assets/logos/robodynamics_logo.svg',
    planetScale: 1.1
  },
  // ... other founders
];
### Phase 2: Thematic Planet Rendering (EnhancedPlanet.tsx)
Modify EnhancedPlanet.tsx to conditionally render planet features based on the type property.

PlanetTypeFactory Function: Create a helper function or a switch statement within EnhancedPlanet.tsx that receives the type prop and returns specific MeshStandardMaterial properties and optional child components (e.g., rings).

Generic Defaults: Start with a default material (e.g., a basic rocky texture with a normalMap) if no specific type match is found.

Material Map Loading: Use useTexture from @react-three/drei to load .png or .jpg image files for map, normalMap, roughnessMap, and emissiveMap based on the planet's type.

Robotics Type:

map: Dark, metallic texture or abstract geometric pattern.

normalMap: Hard-edged geometric patterns (circuitry, plating).

roughnessMap: Low roughness for metallic/smooth surfaces.

emissiveMap: A subtle circuit pattern texture. Its intensity should be controlled (e.g., emissiveIntensity: 0.1 normally, 0.5 on hover/select).

Optional: Add a few thin, fast-rotating rings using TorusGeometry and MeshBasicMaterial.

Restaurant Type:

map: Earth-like, lush, or rich organic textures (e.g., stylized farmlands, coffee bean patterns).

normalMap: Soft, rolling hills or subtle organic bumps.

roughnessMap: Varying roughness for land/water features.

emissiveMap: Consider very subtle, warm glowing "city lights" if appropriate.

Optional: Perhaps a single, very subtle, slow-orbiting asteroid belt (using InstancedMesh for performance).

Drone Type:

map: Smooth, slightly reflective surfaces, possibly with embedded light lines.

normalMap: Subtle, aerodynamic paneling or smooth contours.

roughnessMap: Mid-level roughness.

emissiveMap: Clean, bright lines or glowing vent patterns.

Key Feature: Rings should be prominent, possibly multiple, very thin, and slightly transparent, rotating quickly to evoke motion.

Other Types: Apply similar logic for other company types (e.g., 'BioTech' could have organic, bioluminescent textures, 'FinTech' could have abstract data flow patterns).

Dynamic Scale Application: Apply the planetScale property directly to the Group containing the planet mesh to adjust its size.

JavaScript

// EnhancedPlanet.tsx snippet
const { type, planetScale } = props;
const { materialProps, customRings } = getPlanetTypeConfig(type); // Helper function
return (
  <group scale={planetScale} {...events}>
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
    {customRings} {/* Render conditional rings */}
    {/* ... other elements */}
  </group>
);
### Phase 3: Interactive Hover & Founder Showcase
Implement the hover functionality for displaying founder portraits and company logos.

Hover State Management:

Utilize onPointerOver and onPointerOut events on the main planet mesh.

Manage an isHovered state (e.g., using useState or useRef for performance-critical scenarios if needed) to control the visibility and animation of the hover elements.

Company Logo & Name (Below Planet):

Component: Use the <Html> component from @react-three/drei.

Positioning: Position it dynamically slightly below the planet's base using CSS or transform properties within the <Html> component. You'll need to account for the planetScale.

Content: Inside <Html>, render an <img> tag for logoUrl and a <span> or <div> for company.name.

Styling: Use standard CSS to style the text (font, size, color) and the image (max-width, height). Apply a subtle backdrop-filter: blur() if the design calls for it.

Visibility: Control its opacity and visibility based on the isHovered state. Use CSS transitions for a smooth fade-in/out.

JavaScript

// EnhancedPlanet.tsx snippet
{isHovered && (
  <Html position={[0, -1.5 * planetScale, 0]} center> {/* Adjust Y position based on scale */}
    <div style={{ /* Your CSS for the info panel */ }}>
      <img src={logoUrl} alt={company} style={{ /* Logo CSS */ }} />
      <p style={{ color: 'white', fontSize: '1.2rem', marginTop: '0.5rem' }}>{company}</p>
    </div>
  </Html>
)}
Founder Portrait (Above Planet):

Components: Use <Billboard> and <Image> from @react-three/drei.

Purpose of <Billboard>: Ensures the image always faces the camera, creating a floating, holographic effect regardless of camera orbit.

Positioning: Place the <Billboard> containing the <Image> just above the planet (e.g., position={[0, 1.2 * planetScale, 0]}).

Image Properties:

url: Set to portraitUrl.

transparent: true

blending: THREE.AdditiveBlending (crucial for the "glowing" effect).

opacity: Control based on isHovered (e.g., 0 when not hovered, 1 when hovered).

scale: Adjust the visual size of the portrait (e.g., [1.5, 1.5]).

Visibility/Animation: Control the opacity of the <Image> based on the isHovered state, using useSpring from react-spring or similar for smooth fade transitions.

JavaScript

// EnhancedPlanet.tsx snippet
{isHovered && (
  <Billboard position={[0, 1.2 * planetScale, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
    <Image
      url={portraitUrl}
      transparent
      blending={THREE.AdditiveBlending}
      opacity={isHovered ? 1 : 0} // Animate this with spring
      scale={[1.5, 1.5]}
    />
  </Billboard>
)}
### Phase 4: Asset Collection & Organization
Before starting implementation, ensure all necessary assets are prepared.

Gather Textures: Collect or create map, normalMap, roughnessMap, and emissiveMap textures for each planet type. Organize them in an /assets/planets/ folder.

Gather Portraits: Ensure all portraitUrl images are transparent PNGs and stored in /assets/founders/.

Gather Logos: Ensure all logoUrl images are SVG or transparent PNGs and stored in /assets/logos/.