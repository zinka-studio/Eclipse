'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap-config';
import { getLenis } from '@/lib/lenis';

const FRAME_COUNT = 151;
const SCROLL_TRAVEL = 2.4; // viewport heights over which frames 0→150 play (20% faster than 3)
const SCRUB = 0.5;       // smoothing lag (0 = instant, 1 = 1s lag)

export function useFrameSequence(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>
) {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const needsDrawRef = useRef(false);

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = framesRef.current[index];
      if (!canvas || !img?.complete) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { width: cw, height: ch } = canvas;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    },
    [canvasRef]
  );

  // RAF loop — scrubs toward targetFrameRef with SCRUB smoothing
  useEffect(() => {
    let current = 0;
    const loop = () => {
      const target = targetFrameRef.current;
      // Lerp toward target frame (scrub feel)
      current += (target - current) * (1 - Math.pow(1 - SCRUB, 0.15));
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(current)));
      if (idx !== frameIndexRef.current || needsDrawRef.current) {
        frameIndexRef.current = idx;
        drawFrame(idx);
        needsDrawRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Sync canvas dimensions to viewport
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      needsDrawRef.current = true;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef]);

  // Preload all frames (sequential, frame 0 triggers first draw)
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = images;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => {
        if (idx === 0) needsDrawRef.current = true;
      };
      img.src = `/frames/frame_${String(i).padStart(4, '0')}.webp`;
      images[i] = img;
    }
  }, []);

  // GSAP ticker reads Lenis smooth scroll → updates targetFrameRef
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tickerFn = () => {
      const lenis = getLenis();
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const travel = SCROLL_TRAVEL * window.innerHeight;
      const progress = Math.min(1, Math.max(0, scroll / travel));
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
    };

    gsap.ticker.add(tickerFn);
    return () => gsap.ticker.remove(tickerFn);
  }, []);

  return frameIndexRef;
}
