# Eclipse Project Setup Design
**Date:** April 20, 2026
**Status:** Approved

## Overview
Initialize a Next.js 15+ project with TypeScript, Tailwind CSS, GSAP + ScrollTrigger, and Three.js for the Eclipse cocktail bar website. Focus on minimal, clean structure that scales incrementally.

## Project Structure

```
eclipse/
├── app/
│   ├── layout.tsx           # Root layout with Tailwind setup, metadata
│   ├── page.tsx             # Main scrollytelling page
│   ├── globals.css          # Global styles + Tailwind directives
│   └── error.tsx            # Error boundary
├── components/
│   ├── sections/            # PRD sections (added incrementally)
│   ├── ui/                  # Reusable UI components (Button, Text, etc.)
│   └── three/               # Three.js interactive components
├── hooks/
│   └── useScrollTrigger.ts  # GSAP ScrollTrigger React hook
├── lib/
│   ├── gsap-config.ts       # GSAP initialization, animation utilities
│   └── three-config.ts      # Three.js scene factory, helpers
├── public/
│   └── videos/              # 4K video assets, images
├── docs/
│   └── superpowers/         # Design specs
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## Dependencies

**Production:**
- `next@latest` — App Router, React 19
- `react@19`, `react-dom@19`
- `typescript@latest` — Type safety
- `tailwindcss@latest` — Styling (black & white theme)
- `postcss`, `autoprefixer` — CSS processing
- `gsap` — Animations, ScrollTrigger
- `three` — 3D rendering

**Development:**
- `@types/node`, `@types/react`, `@types/react-dom`
- Standard Next.js tooling

## Configuration Files

### `tailwind.config.js`
- **Colors:** Strict black & white palette with semantic variables (primary, secondary, accent)
- **Extend:** No additional utilities; keep minimal
- **Theme:** Standard breakpoints (mobile-first)

### `next.config.js`
- Standard Next.js config; no optimizations yet (can be added per-feature)
- Image optimization enabled by default

### `tsconfig.json`
- Strict mode enabled
- JSX: react-jsx (React 19)
- Target: ES2020+

### `.env.local` (added during deployment)
- `NEXT_PUBLIC_VERCEL_URL` for dynamic OG images
- Environment variables for third-party services (when needed)

## GSAP Integration

**`lib/gsap-config.ts`**
- Register ScrollTrigger plugin on import
- Reusable animation utilities:
  - `scrubVideo(videoRef, scrollTriggerProps)` — Map scroll to video playback
  - `revealOnScroll(ref, options)` — Fade/slide reveals on scroll
  - `parallaxLayer(ref, speed)` — Parallax depth effect
  - `textReveal(ref, stagger)` — Staggered text animations
- Consistent easing functions (cubic-bezier presets)

**`hooks/useScrollTrigger.ts`**
- Wrapper hook for GSAP ScrollTrigger
- Handles cleanup on unmount
- Responsive: disable animations on mobile if needed
- Example usage: `useScrollTrigger(ref, { trigger, animation: () => gsap.to(...) })`

## Three.js Integration

**`lib/three-config.ts`**
- Scene factory: `createScene(container)`
- Default lighting setup (key light, fill light, backlight)
- Camera setup (PerspectiveCamera with aspect ratio fix)
- Material presets (glass, metallic, etc.)
- No global state; each component manages its own scene

**`components/three/CocktailGlass.tsx`**
- Isolated component that initializes Three.js scene
- Handles mouse/touch interaction for rotation
- Cleanup on unmount
- No external animation state

## Initial Setup Steps

1. Initialize Next.js with `create-next-app@latest` (pnpm)
2. Install GSAP, Three.js, and types
3. Configure Tailwind (black & white theme)
4. Create folder structure
5. Write GSAP config and custom hook
6. Write Three.js config
7. Create root layout with basic styling
8. Create blank `page.tsx` (ready for sections)
9. Initialize git, create initial commit

## Git Strategy

- **Initial commit:** "chore: initialize Next.js with GSAP and Three.js"
- Subsequent steps (building sections) are separate commits
- References folder (added later by user) will be included in `.gitignore` if needed

## Notes

- **No premature optimization:** Features like image optimization, caching headers, CDN config added per-need
- **Animations added incrementally:** GSAP utilities exist, but animations are tied to section components
- **Three.js is isolated:** Only the cocktail component uses 3D; no global Three.js state
- **Black & white strict:** Colors only in video/image assets, not CSS (per PRD)

## Success Criteria

- [ ] Fresh git repo initialized
- [ ] Next.js 15+ with App Router running locally
- [ ] TypeScript strict mode configured
- [ ] Tailwind CSS with black & white theme
- [ ] GSAP + ScrollTrigger integrated and accessible
- [ ] Three.js available for components
- [ ] Folder structure matches design above
- [ ] All dependencies pinned in pnpm-lock.yaml
- [ ] Ready to build first section (EventHorizon)
