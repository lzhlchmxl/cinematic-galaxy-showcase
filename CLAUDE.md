# CLAUDE.md

## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

## MANDATORY: Definition of Done for Every Feature

**CRITICAL**: After implementing ANY feature or change, you MUST complete these validation steps before considering the task done:

### 1. Static Analysis (Required)
```bash
# Run linting and fix all issues
npm run lint

# Run type checking and fix all TypeScript errors
npm run type-check
```

### 2. Test Execution (Required)
```bash
# Run full test suite and ensure all tests pass
npm run test
```

### 3. Full System Validation (Required)
```bash
# Execute the comprehensive validation script
./validate-survey-tool.sh
```

**The validation script MUST complete successfully with "VALIDATION SUCCEEDED" message.**

### 4. Response Format (Required)
In your response, you MUST provide:
1. **Code changes made** (what you implemented)
2. **Full output** from `./validate-survey-tool.sh` proving the system works
3. **Confirmation** that lint, type-check, and tests all passed

### Validation Script Details
The `validate-survey-tool.sh` script performs:
- ✅ Full environment startup (Docker services + API + Frontend)
- ✅ Health checks for all services (MongoDB, Redis, API, Admin)
- ✅ API endpoint testing (auth, templates, surveys, analytics)
- ✅ Critical user journey validation
- ✅ Static analysis (lint, type-check, tests)
- ✅ Frontend accessibility verification
- ✅ Clean shutdown and resource cleanup

**This validation is NON-NEGOTIABLE. No feature is considered complete without successful validation.**




This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Cinematic Galaxy Showcase** - a 3D interactive web experience built to showcase founder friends and their projects as planets in a cosmic environment. The project serves as a personal branding piece for Bill Liang, designed for maximum LinkedIn shareability.

**Core Concept:** Each founder is represented as a glowing planet in a 3D galaxy that users can navigate using orbital controls. Clicking planets reveals founder spotlights, and the experience concludes with stars aligning to form "Crafted by Bill Liang" in constellation form.

## Technology Stack & Architecture

### Primary Stack
- **React 18** + **TypeScript 5.3+** + **Vite 6**
- **React Three Fiber 8.2.2** + **@react-three/drei 10.7.6**
- **Three.js 0.160+** (WebGPU-ready with full TypeScript definitions)
- **Framer Motion v11** (3D animation support)
- **@react-three/postprocessing** (selective bloom effects)

### Architecture Patterns
The project follows a component-based 3D architecture:

- **Galaxy/** components handle 3D scene management and planet rendering
- **UI/** components manage overlays, modals, and navigation with Framer Motion
- **Effects/** components control post-processing and particle systems
- **types/** directory contains TypeScript interfaces for founder data, 3D positioning, and animations
- **utils/galaxyMath.ts** handles complex 3D positioning calculations
- **hooks/useGalaxyInteraction.ts** manages mouse/touch interaction logic

### Key TypeScript Interfaces
```typescript
interface Founder {
  id: string;
  name: string;
  company: string;
  description: string;
  position: Vector3;
  color: string;
  links: { website?: string; linkedin?: string; twitter?: string; };
}
```

## Development Commands

**Note:** This project is currently in the planning phase. The following commands will be available once the Vite setup is complete:

### Setup & Development
```bash
npm install                    # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm run preview               # Preview production build locally
```

### Code Quality
```bash
npm run lint                  # Run ESLint
npm run type-check           # Run TypeScript compiler check
npm run test                 # Run test suite (when implemented)
```

## Performance Considerations

### 3D Optimization Strategy
- **Lazy loading**: 3D components load after initial page render to improve perceived performance
- **Conditional effects**: Heavy post-processing (bloom, particles) disabled on low-end devices based on `navigator.hardwareConcurrency`
- **Mobile responsiveness**: Reduced particle counts and simplified shaders for mobile devices
- **Code splitting**: Separate chunks for 3D scene vs UI components

### Bundle Optimization
- Use Vite's automatic tree-shaking for Three.js modules
- Compress textures and optimize particle counts
- Progressive loading: start with basic scene, enhance with effects

## 3D Scene Architecture

### Core 3D Components
- **GalaxyScene.tsx**: Main scene container with camera, lights, and controls
- **FounderPlanet.tsx**: Individual planet with hover/click interactions and emissive materials for bloom
- **StarField.tsx**: Background particle system using custom shaders
- **CameraController.tsx**: OrbitControls wrapper with auto-rotation and zoom limits

### Interaction Patterns
- **Orbital Navigation**: Users orbit around galaxy using mouse/trackpad (planetarium-style)
- **Planet Interactions**: Hover for pulse animations, click for modal spotlights
- **Constellation Finale**: Animated star alignment spelling "Bill Liang"

## Visual Effects System

### Selective Bloom Implementation
Uses `@react-three/postprocessing` with `luminanceThreshold=1` - only materials with emissive values > 1 will glow. Founder planets use emissive materials to create the glowing effect.

### Particle Systems
- Starfield background with 5000+ particles
- Mouse-following particle effects
- Animated twinkling using custom shaders
- Performance scaling based on device capabilities

## Data Management

### Founder Data Structure
Founder information stored in `src/data/founders.ts` as typed objects with 3D positioning calculated algorithmically for optimal viewing angles and distribution throughout the galaxy space.

### 3D Positioning
The `utils/galaxyMath.ts` module handles complex calculations for:
- Optimal planet placement in 3D space
- Camera positioning for constellation finale
- Orbital mechanics for satellite elements

## Development Phases

The project is structured in 4 phases:
1. **Foundation**: Vite + React + TypeScript setup with basic 3D scene
2. **Visual Polish**: Particle systems, bloom effects, planet designs
3. **Interactivity**: Modal system, mouse interactions, constellation animation
4. **Optimization**: Performance testing, mobile optimization, AWS deployment

## Deployment Target

**AWS** - Static site deployment optimized for social media sharing, particularly LinkedIn engagement targeting 30+ likes from the founder and tech community.