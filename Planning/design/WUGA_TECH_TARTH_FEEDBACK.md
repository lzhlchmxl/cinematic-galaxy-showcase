Planet Material Properties

Base Material: meshStandardMaterial with custom shader modifications.

Geometry: Oblate scaling [1, 0.97, 1] + 23.5° axial tilt (retained for interesting shape/rotation, but lighting won't emphasize a "day/night" divide).

Textures: NONE (.png files are explicitly excluded). All surface features, normals, and specular highlights will be generated procedurally within custom shaders.

Lighting Model: Implement a uniform, non-directional lighting model or a perpetually lit appearance within the shader, so all parts of the planet are clearly visible without distinct dark areas.

Complex Color Blending System (Primary Orange & Blue Focus, Procedural Surface, Always Visible)

Main Planet Surface (Procedural Orange & Blue Features):

Implementation: Custom GLSL shader for meshStandardMaterial.

Logic:

Generate a noise function (e.g., Perlin, Simplex noise) or fractal patterns to create abstract "landmasses" or regions.

Use the noise output to blend between a dominant Deep Blue (#2C5D7F) and a vibrant Dark Orange (#FF8C00). The blend factor (e.g., 0.7 for blue dominance) will be directly applied in the shader based on noise thresholds.

The "drivable" feel will be suggested by the smooth, undulating nature of these procedural patterns, implying expansive plains or gentle slopes.

No Day/Night Color Shift: The base colors will remain consistent across the entire planet surface.

Surface Glow (Procedural Emission for Features):

Implementation: Integrated into the custom planet shader's emissive component.

Logic: Generate secondary, finer noise patterns or specific coordinates within the shader to create glowing elements on the planet's surface (e.g., energy conduits, stylized city grids that are always visible). These would primarily match the billboard's blue/cyan glow or the track's glowing elements.

Color: The procedural lights/glow should be integrated with the orange and blue surface, enhancing visibility and adding futuristic detail.

Procedural Normal Map (Surface Detail):

Implementation: Custom GLSL shader, calculating normals on the fly from the same noise functions used for the main surface.

Logic: Derive height variations from the noise function, then calculate the normal vector at each fragment to simulate bumps and depressions (e.g., stylized canyons, ridges, or glowing energy conduits).

Procedural Specular Map (Shininess):

Implementation: Custom GLSL shader.

Logic: Use the noise patterns or specific coordinates to define areas of varying glossiness or reflectivity, such as smooth, reflective blue surfaces versus rougher orange terrain.

Emissive Glow (Planet Aura, Fiery, aligned with the orange tones):

JavaScript

// Orange-Red → Gold (60%) for a warm, energetic glow.
new Color('#FF4500').lerp(new Color('#FFD700'), 0.6);
// Intensity: 0.7 (strong glow) - This external glow will still be present around the fully lit planet.
Specular Hotspot Position:

Adjustment: Initial planetMesh.rotation.x = Math.PI; on the base geometry to effectively orient the procedural "top" of the planet.