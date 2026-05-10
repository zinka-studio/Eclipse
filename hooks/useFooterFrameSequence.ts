'use client';
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap-config';

const FRAME_COUNT  = 151;  // 5.03 s × 30 fps
const FRAME_START  = 1;    // frames are 0001 – 0151
const SCRUB        = 0.5;  // lerp factor (matches hero)

// Fraction of previous section height at which the reveal begins
const PRE_START_FRACTION = 0.8;

export function useFooterFrameSequence(
  canvasRef:  React.RefObject<HTMLCanvasElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  panelRef:   React.RefObject<HTMLDivElement | null>,
  blackRef:   React.RefObject<HTMLDivElement | null>,
  blurRef:    React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
) {
  const framesRef      = useRef<HTMLImageElement[]>([]);
  const frameIndexRef  = useRef(0);
  const targetFrameRef = useRef(0);
  const needsDrawRef   = useRef(false);
  const settledRef     = useRef(false);

  // ── Draw a specific frame ─────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const x = (cw - img.naturalWidth  * scale) / 2;
    const y = (ch - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, [canvasRef]);

  // ── RAF loop with scrub lerp (identical to hero) ──────────
  useEffect(() => {
    let current = 0;
    const loop = () => {
      const target = targetFrameRef.current;
      current += (target - current) * (1 - Math.pow(1 - SCRUB, 0.15));
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current)));
      if (idx !== frameIndexRef.current || needsDrawRef.current) {
        frameIndexRef.current = idx;
        drawFrame(idx);
        needsDrawRef.current = false;
      }
      requestAnimationFrame(loop);
    };
    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [drawFrame]);

  // ── Canvas resize ─────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      needsDrawRef.current = true;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef]);

  // ── Preload all frames ────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = images;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => { if (idx === 0) needsDrawRef.current = true; };
      img.src = `/frames/footer/frame_${String(i + FRAME_START).padStart(4, '0')}.webp`;
      images[i] = img;
    }
  }, []);

  // ── GSAP ticker: two-phase scroll → frame + overlays ─────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let smoothBlack = 0; // 0→1: black fades during menu phase
    let smoothScrub = 0; // 0→1: frame index during footer scroll phase

    const tick = () => {
      const section = sectionRef.current;
      const panel   = panelRef.current;
      if (!section || !panel) return;

      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const sectionTop = section.getBoundingClientRect().top;

      // preOffset: start revealing when user has scrolled PRE_START_FRACTION of prev section
      const prev      = section.previousElementSibling as HTMLElement | null;
      const preOffset = prev
        ? prev.offsetHeight * PRE_START_FRACTION
        : window.innerHeight * 0.5;

      // ── Show panel when within preOffset ──
      const active = sectionTop <= preOffset;
      panel.style.visibility    = active ? 'visible' : 'hidden';
      panel.style.pointerEvents = active ? 'auto'    : 'none';

      // ── Phase 1: black dissolve (sectionTop: preOffset → 0) ──
      const rawBlack = preOffset > 0
        ? Math.min(1, Math.max(0, (preOffset - sectionTop) / preOffset))
        : 1;
      smoothBlack += (rawBlack - smoothBlack) * 0.09;

      if (blackRef.current) {
        blackRef.current.style.opacity = String(1 - smoothBlack);
      }

      // ── Phase 2: frame scrub (sectionTop: preOffset → -scrollable) ──
      const rawScrub = Math.min(1, Math.max(0, (preOffset - sectionTop) / (preOffset + scrollable)));
      smoothScrub += (rawScrub - smoothScrub) * 0.09;

      targetFrameRef.current = smoothScrub * (FRAME_COUNT - 1);

      // ── Phase 3: settle — blur + text via CSS transition ──
      if (smoothScrub >= 0.97 && !settledRef.current) {
        settledRef.current = true;
        if (blurRef.current) {
          blurRef.current.style.transition = 'opacity 0.9s ease';
          blurRef.current.style.opacity    = '1';
        }
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 1.1s ease 0.5s';
          contentRef.current.style.opacity    = '1';
        }
      }
      if (smoothScrub < 0.85 && settledRef.current) {
        settledRef.current = false;
        if (blurRef.current) {
          blurRef.current.style.transition = 'opacity 0.9s ease';
          blurRef.current.style.opacity    = '0';
        }
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.7s ease';
          contentRef.current.style.opacity    = '0';
        }
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [canvasRef, sectionRef, panelRef, blackRef, blurRef, contentRef]);
}
