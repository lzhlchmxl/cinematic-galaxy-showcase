## Technical Brief: Cinematic Visual Refinements
To the Implementation Agent: The following is a prioritized plan to elevate the existing "Cinematic Galaxy Showcase" from its current state to a more professional and visually immersive experience. The goal is subtlety and realism, not over-the-top effects. Please follow these phases in order, as each step builds upon the last.

### Phase 1: Foundational Lighting & Color (Highest Priority)
This phase will provide the largest visual improvement and correct any "flatness" in the scene.

Implement ACES Filmic Tone Mapping: This is the top priority. In the main R3F <Canvas> component, set the gl prop to enable ACESFilmicToneMapping. This will provide a cinematic color grade and prevent bright, emissive objects from looking blown out.

Establish a Lighting Hierarchy:

Temporarily disable all lights except for the Main Directional Light from DynamicLighting.tsx.

Adjust this single light's position and intensity (0.8 - 1.0) until it creates compelling highlights and shadows on the planets.

Change its color from pure white to a slightly warm, off-white (e.g., #fff8f0) for realism.

Re-introduce Accent Lighting: One by one, re-enable the other lights (Rim Light, Point Lights, etc.) but set their intensities to be very low (0.1 - 0.25). Their purpose is to gently fill in shadows or add a subtle colored edge, not to compete with the main light.

### Phase 2: Enhancing Planets & Atmosphere
With the lighting corrected, we'll make the core objects feel more dynamic and realistic.

Add Surface Imperfection: In EnhancedPlanet.tsx, modify the meshStandardMaterial. Apply a subtle, tiling noise or cloud texture to the roughnessMap property. This will break up the uniform "plastic" look by creating variations in how the surface reflects light.

Implement a Fresnel Atmosphere: The current layered-sphere approach for the atmosphere should be replaced.

Implement a Fresnel effect on a single sphere surrounding the planet core. This will create a much more organic glow that realistically hugs the planet's edge.

Recommendation: The lamina library for R3F is highly optimized and stable for this exact purpose.

### Phase 3: Post-Processing Polish (The "Wow" Factor)
This phase adds the final layer of cinematic quality. These effects should be subtle.

Integrate Post-Processing: Add the react-postprocessing library and set up an <EffectComposer> that wraps your scene.

Apply a Subtle Bloom: Add a <Bloom /> effect.

Configuration: Start with a low intensity (e.g., 0.3), a high luminanceThreshold (so only the brightest parts glow), and a moderate mipmapBlur radius. This should make the planet cores and rings pop without washing out the scene.

Add Depth of Field: Add a <DepthOfField /> effect to simulate a camera lens.

Configuration: Set the focusDistance and focalLength to create a shallow depth of field. The goal is to have the foreground planet in sharp focus while the distant starfield and other planets are slightly blurred. This can be dynamically updated to focus on the hovered planet.

(Optional) Add a Vignette: A <Vignette /> effect can help darken the edges of the screen, focusing the user's eye on the galaxy in the center.

