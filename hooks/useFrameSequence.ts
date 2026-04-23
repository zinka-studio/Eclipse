'use client';
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap-config';
import { getLenis } from '@/lib/lenis';

const FRAME_COUNT = 151;
const FRAME_START = 1; // frames are 0001–0151
const SCROLL_TRAVEL = 2.4;
const SCRUB = 0.5;

export function useFrameSequence(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>
) {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const needsDrawRef = useRef(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const x = (cw - img.naturalWidth * scale) / 2;
    const y = (ch - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, [canvasRef]);

  // RAF loop with scrub lerp
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
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Canvas resize
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

  // Preload frames
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    framesRef.current = images;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => { if (idx === 0) needsDrawRef.current = true; };
      img.src = `/frames/frame_${String(i + FRAME_START).padStart(4, '0')}.webp`;
      images[i] = img;
    }
  }, []);

  // GSAP ticker reads Lenis scroll → drives targetFrameRef
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tickerFn = () => {
      const lenis = getLenis();
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const progress = Math.min(1, Math.max(0, scroll / (SCROLL_TRAVEL * window.innerHeight)));
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
    };
    gsap.ticker.add(tickerFn);
    return () => gsap.ticker.remove(tickerFn);
  }, []);

  return frameIndexRef;
}
