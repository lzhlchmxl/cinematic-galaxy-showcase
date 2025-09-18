Earth Implementation Spec (Refined for Classic Appearance)
Core Structure & Geometry
Shape: Oblate spheroid with [1, 0.97, 1] scaling. (No change)

Axial Tilt: 23.5° rotation. (No change)

Geometry: High-resolution sphere (64x64 segments). (No change)

Material Properties
Base Color: #FFFFFF (Pure white, allows procedural texture to show true colors). (No change)

Material Type: meshStandardMaterial. (No change)

Roughness & Metalness:

Continents (Procedural): Roughness: 0.8, Metalness: 0.0

Oceans (Procedural): Roughness: 0.1, Metalness: 0.05

(Rationale: This distinction is key. Oceans should be much smoother and more reflective than land. This will be controlled in the shader.)

Procedural Texture System (Shader-Driven)
Day Texture (Procedural Logic):

Oceans: A deep, rich blue (#4A729D). A less saturated tone feels more natural.

Continents: A blend of natural greens and subtle earth tones.

Base Green: #67945A

Arid/Mountain Tones: Use a noise function to lightly blend in a touch of brown/yellow (#B5A642) in some areas to break up the uniform green.

Features: Stylized continent shapes (North America, etc.) remain the base.

Polar Ice: White gradients at poles with soft transitions. (No change)

Additional Procedural Maps (Shader-Driven):

Normal Map:

Continents: Use a low-frequency noise function to create large, gentle bumps suggesting mountain ranges and varied elevation.

Oceans: Remain perfectly smooth (normal vector points straight out).

Specular/Roughness Map:

Oceans: Procedurally set to be very smooth/low roughness to create a clear specular highlight from the light source.

Continents: Procedurally set to be very rough/high roughness.

Lighting & Emissive Effects
Emissive Color: A very subtle, soft white (#FFFFFF).

Emissive Intensity: 0.05 (Reduced to let the procedural colors and specular highlight be the main features).

Lighting Model: Uniform lighting across the entire surface. (No change)

Cloud Layer
Separate Sphere: At 1.01 radius. (No change)

Scaling & Animation: Matches Earth's scaling and rotates 1.2x faster. (No change)

Transparency: 70% opacity (90% on hover). (No change)

Atmospheric Effects
Two-layer Glow:

Inner Glow: Light, sky blue (#A0C0F0) at 1.15 radius.

Outer Glow: Same color at 1.25 radius.

(Rationale: A more sky-like blue for the atmosphere feels more traditional than the previous electric blue.)

Rendering: BackSide with AdditiveBlending. (No change)

Animation & Interactivity
Planet/Cloud Rotation & Hover/Bobbing Effects: (No change)