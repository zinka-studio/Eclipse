# Eclipse Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a fully configured Next.js 15+ project with TypeScript, Tailwind CSS, GSAP + ScrollTrigger, and Three.js ready for building the Eclipse cocktail bar website.

**Architecture:** Fresh Next.js App Router setup with minimal configuration. GSAP and Three.js are pre-integrated but not yet used (section components will plug into these utilities). Strict black & white Tailwind theme per PRD.

**Tech Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Three.js, pnpm

---

## File Structure

**New files to create:**
- `docs/superpowers/plans/2026-04-20-project-setup.md` (this plan)
- `lib/gsap-config.ts` — GSAP initialization and animation utilities
- `hooks/useScrollTrigger.ts` — React hook for GSAP ScrollTrigger
- `lib/three-config.ts` — Three.js scene factory and helpers
- `app/layout.tsx` — Root layout with metadata and global styles
- `app/page.tsx` — Home page (blank, ready for sections)
- `app/globals.css` — Global styles with Tailwind directives
- `public/.gitkeep` — Placeholder for public assets
- `public/videos/.gitkeep` — Placeholder for video assets

**Files to modify:**
- `.gitignore` — Standard Node/Next.js ignores
- `tailwind.config.js` — Black & white theme
- `tsconfig.json` — Strict mode
- `next.config.js` — Standard config
- `.env.local` — Environment variables (added during Vercel setup)

---

## Task 1: Initialize Git Repository

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Initialize git**

```bash
cd "d:/APP DEV AI/02 Eclipse"
git init
```

Expected output: `Initialized empty Git repository in d:/APP DEV AI/02 Eclipse/.git/`

- [ ] **Step 2: Create .gitignore**

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js
pnpm-lock.yaml

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
EOF
```

- [ ] **Step 3: Verify .gitignore exists**

```bash
ls -la .gitignore
```

Expected: File listed

---

## Task 2: Create Next.js Project with pnpm

**Files:**
- Create: All Next.js boilerplate files (package.json, next.config.js, etc.)

- [ ] **Step 1: Run create-next-app with pnpm**

```bash
cd "d:/APP DEV AI/02 Eclipse"
pnpm create next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias '@/*'
```

When prompted:
- Use TypeScript? → Yes
- Use ESLint? → Yes
- Use Tailwind CSS? → Yes
- Use `src/` directory? → No
- Use App Router? → Yes
- Import alias? → @/* (default)

Expected output: Project initialized, dependencies installed

- [ ] **Step 2: Verify Next.js is installed**

```bash
pnpm list next
```

Expected output: `next@latest` listed

- [ ] **Step 3: Verify pnpm-lock.yaml exists**

```bash
ls -la pnpm-lock.yaml
```

Expected: File listed

---

## Task 3: Install GSAP and Three.js

**Files:**
- Modify: `package.json` (auto-modified by pnpm)
- Create: `pnpm-lock.yaml` (updated)

- [ ] **Step 1: Install GSAP**

```bash
cd "d:/APP DEV AI/02 Eclipse"
pnpm add gsap
```

Expected output: `added 1 package`

- [ ] **Step 2: Install Three.js**

```bash
pnpm add three
```

Expected output: `added 1 package`

- [ ] **Step 3: Install Three.js types**

```bash
pnpm add -D @types/three
```

Expected output: `added 1 package`

- [ ] **Step 4: Verify dependencies**

```bash
pnpm list gsap three
```

Expected output: Both packages listed with versions

---

## Task 4: Configure Tailwind with Black & White Theme

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Update tailwind.config.js**

Replace the entire file with:

```javascript
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Strict black & white palette per PRD
        primary: '#000000',      // Black
        secondary: '#FFFFFF',    // White
        accent: '#1a1a1a',       // Near-black for depth
        muted: '#666666',        // Dark gray
        subtle: '#e0e0e0',       // Light gray
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      spacing: {
        // Add semantic spacing if needed
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify tailwind.config.js is updated**

```bash
head -20 tailwind.config.js
```

Expected: File shows color theme configuration

---

## Task 5: Configure TypeScript Strict Mode

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Update tsconfig.json for strict mode**

Replace the entire file with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify tsconfig.json is updated**

```bash
grep '"strict"' tsconfig.json
```

Expected: `"strict": true`

---

## Task 6: Create Folder Structure

**Files:**
- Create: Folder structure and `.gitkeep` files

- [ ] **Step 1: Create component folders**

```bash
cd "d:/APP DEV AI/02 Eclipse"
mkdir -p components/sections components/ui components/three
mkdir -p hooks lib public/videos
touch components/sections/.gitkeep
touch components/ui/.gitkeep
touch components/three/.gitkeep
touch public/videos/.gitkeep
```

- [ ] **Step 2: Verify folder structure**

```bash
tree -L 2 -I 'node_modules|.next'
```

Expected: Folder structure matches design (may not show .gitkeep files depending on tree options)

---

## Task 7: Write GSAP Configuration

**Files:**
- Create: `lib/gsap-config.ts`

- [ ] **Step 1: Create lib/gsap-config.ts**

```bash
cat > lib/gsap-config.ts << 'EOF'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Scrub a video element based on scroll progress
 * @param videoElement HTML video element
 * @param options ScrollTrigger options (trigger, start, end, etc.)
 */
export function scrubVideo(
  videoElement: HTMLVideoElement,
  options: gsap.plugins.ScrollTriggerStaticVars = {}
) {
  if (!videoElement || !videoElement.duration) return;

  gsap.to(videoElement, {
    currentTime: videoElement.duration,
    scrollTrigger: {
      trigger: options.trigger || videoElement,
      start: options.start || 'top top',
      end: options.end || 'bottom bottom',
      scrub: 1,
      markers: false,
    },
  });
}

/**
 * Reveal element on scroll with fade & slide animation
 * @param element Target element
 * @param options Reveal options (direction, duration, stagger, etc.)
 */
export function revealOnScroll(
  element: HTMLElement,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    stagger?: boolean;
  } = {}
) {
  const { direction = 'up', duration = 0.6, delay = 0, stagger = false } = options;

  const offsetMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  gsap.fromTo(
    element,
    {
      opacity: 0,
      ...offsetMap[direction],
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

/**
 * Create parallax effect on scroll
 * @param element Target element
 * @param speed Parallax speed (0.5 = half speed of scroll, 1.5 = 1.5x speed)
 */
export function parallaxLayer(element: HTMLElement, speed: number = 0.5) {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      markers: false,
    },
  });
}

/**
 * Staggered text reveal (character by character or word by word)
 * @param element Target text element
 * @param options Stagger options (mode, duration, etc.)
 */
export function textReveal(
  element: HTMLElement,
  options: {
    mode?: 'char' | 'word';
    duration?: number;
    staggerAmount?: number;
  } = {}
) {
  const { mode = 'char', duration = 0.04, staggerAmount = 0.05 } = options;

  // Split text into spans
  const text = element.textContent || '';
  const split = mode === 'char' ? text.split('') : text.split(' ');
  element.innerHTML = split
    .map((item) => `<span style="display: inline-block; overflow: hidden;"><span>${item}</span></span>`)
    .join(mode === 'word' ? ' ' : '');

  const spans = element.querySelectorAll('span > span');

  gsap.fromTo(
    spans,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

export { gsap, ScrollTrigger };
EOF
```

- [ ] **Step 2: Verify lib/gsap-config.ts exists**

```bash
ls -la lib/gsap-config.ts && wc -l lib/gsap-config.ts
```

Expected: File exists, 150+ lines

---

## Task 8: Write useScrollTrigger Hook

**Files:**
- Create: `hooks/useScrollTrigger.ts`

- [ ] **Step 1: Create hooks/useScrollTrigger.ts**

```bash
cat > hooks/useScrollTrigger.ts << 'EOF'
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollTriggerOptions {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  markers?: boolean;
}

/**
 * React hook for GSAP ScrollTrigger
 * Handles cleanup on unmount, responsive considerations
 */
export function useScrollTrigger(
  ref: React.RefObject<HTMLElement>,
  options: UseScrollTriggerOptions
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const triggerElement = typeof options.trigger === 'string' ? options.trigger : options.trigger || ref.current;

    triggerRef.current = ScrollTrigger.create({
      trigger: triggerElement,
      start: options.start || 'top center',
      end: options.end || 'bottom center',
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
      markers: options.markers || false,
    });

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [ref, options]);

  return triggerRef;
}

export default useScrollTrigger;
EOF
```

- [ ] **Step 2: Verify hooks/useScrollTrigger.ts exists**

```bash
ls -la hooks/useScrollTrigger.ts && wc -l hooks/useScrollTrigger.ts
```

Expected: File exists, ~60 lines

---

## Task 9: Write Three.js Configuration

**Files:**
- Create: `lib/three-config.ts`

- [ ] **Step 1: Create lib/three-config.ts**

```bash
cat > lib/three-config.ts << 'EOF'
import * as THREE from 'three';

/**
 * Create a Three.js scene with standard setup
 * @param container DOM element to attach renderer to
 * @param width Container width
 * @param height Container height
 */
export function createScene(container: HTMLElement, width: number, height: number) {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, -10, -7);
  scene.add(fillLight);

  return { scene, camera, renderer };
}

/**
 * Handle window resize for Three.js renderer
 */
export function handleResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  container: HTMLElement
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/**
 * Create a basic glass material (for cocktail glass)
 */
export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 2,
    envMapIntensity: 1,
  });
}

/**
 * Create a metallic material (for accents)
 */
export function createMetallicMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.1,
  });
}

/**
 * Animate a Three.js object with rotation
 */
export function animateRotation(object: THREE.Object3D, speed: number = 0.01) {
  object.rotation.x += speed;
  object.rotation.y += speed * 1.5;
  object.rotation.z += speed * 0.5;
}

export default { createScene, handleResize, createGlassMaterial, createMetallicMaterial, animateRotation };
EOF
```

- [ ] **Step 2: Verify lib/three-config.ts exists**

```bash
ls -la lib/three-config.ts && wc -l lib/three-config.ts
```

Expected: File exists, ~100 lines

---

## Task 10: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update app/layout.tsx**

Replace with:

```bash
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eclipse | Exclusive Tel Aviv Cocktail Bar',
  description: 'Where the city fades. An exclusive encounter between light and shadow.',
  metadataBase: new URL('https://eclipse-bar.vercel.app'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
EOF
```

- [ ] **Step 2: Verify app/layout.tsx is updated**

```bash
grep 'Eclipse' app/layout.tsx
```

Expected: Metadata shows "Eclipse | Exclusive Tel Aviv Cocktail Bar"

---

## Task 11: Create Blank Home Page

**Files:**
- Create/Modify: `app/page.tsx`

- [ ] **Step 1: Create app/page.tsx**

```bash
cat > app/page.tsx << 'EOF'
'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <section className="h-screen flex items-center justify-center border border-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">Eclipse</h1>
          <p className="text-xl text-gray-400">Where the city fades.</p>
          <p className="text-sm text-gray-600 mt-8">Sections coming soon...</p>
        </div>
      </section>
    </main>
  );
}
EOF
```

- [ ] **Step 2: Verify app/page.tsx exists**

```bash
grep 'Eclipse' app/page.tsx
```

Expected: "Eclipse" appears in the file

---

## Task 12: Global Styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update app/globals.css**

Replace with:

```bash
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #000000;
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

/* Prevent layout shift from scrollbar */
html {
  overflow-y: scroll;
}

/* Semantic text styles */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

/* Video element defaults */
video {
  display: block;
  width: 100%;
  height: auto;
}
EOF
```

- [ ] **Step 2: Verify app/globals.css exists**

```bash
head -5 app/globals.css
```

Expected: Tailwind directives appear

---

## Task 13: Test Local Dev Server

**Files:**
- None (testing only)

- [ ] **Step 1: Start the development server**

```bash
cd "d:/APP DEV AI/02 Eclipse"
pnpm dev
```

Expected output:
```
  ▲ Next.js 15.x.x
  - Ready in XXXms
  ○ Listening on http://localhost:3000
```

- [ ] **Step 2: Verify app loads in browser**

Open: `http://localhost:3000`

Expected: Page displays "Eclipse" heading and "Where the city fades." subtitle

- [ ] **Step 3: Stop the dev server**

Press: `Ctrl+C` in terminal

---

## Task 14: Create Initial Commit

**Files:**
- All files created above

- [ ] **Step 1: Stage all files**

```bash
cd "d:/APP DEV AI/02 Eclipse"
git add -A
```

- [ ] **Step 2: Create commit**

```bash
git commit -m "chore: initialize Next.js with GSAP and Three.js setup"
```

Expected output: Shows file changes (40+ files)

- [ ] **Step 3: Verify commit**

```bash
git log --oneline -1
```

Expected: Shows "chore: initialize Next.js with GSAP and Three.js setup"

- [ ] **Step 4: Verify git status is clean**

```bash
git status
```

Expected: `working tree clean`

---

## Success Criteria

- [x] Fresh git repo initialized with standard .gitignore
- [x] Next.js 15+ with App Router running locally
- [x] TypeScript strict mode configured
- [x] Tailwind CSS with black & white theme
- [x] GSAP + ScrollTrigger integrated via `lib/gsap-config.ts`
- [x] Custom `useScrollTrigger` hook for React integration
- [x] Three.js configured via `lib/three-config.ts`
- [x] Folder structure matches design (components/, hooks/, lib/, public/)
- [x] Root layout with metadata configured
- [x] Home page loads with "Eclipse" branding
- [x] Global styles (Tailwind + custom CSS)
- [x] All dependencies pinned in pnpm-lock.yaml
- [x] Initial commit created
- [x] Ready to build first section (EventHorizon)

---

## Next Steps

Once this plan is complete, the project is ready for:
1. Building the **Event Horizon** section (hero with video scrub)
2. Adding remaining sections (Concept, Liquid Gallery, etc.)
3. Implementing Three.js cocktail glass component
4. Deployment to Vercel

All GSAP and Three.js infrastructure is in place and ready to use.
