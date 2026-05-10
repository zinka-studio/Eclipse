'use client';
import { useEffect, RefObject } from 'react';
import { gsap } from '@/lib/gsap-config';

// Applies a subtle vertical parallax to an element.
// speed > 0 → element moves down when below viewport centre (foreground = higher speed).
// Left columns use lower speed, right columns use higher speed.
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  speed: number,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || speed === 0) return;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.willChange = 'transform';

    const tick = () => {
      // Skip on mobile — avoids jank and unnecessary GSAP overhead
      if (window.innerWidth < 768) {
        el.style.transform = '';
        return;
      }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const offset = (rect.top + rect.height * 0.5 - vh * 0.5) * speed;
      el.style.transform = `translateY(${offset.toFixed(2)}px)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      if (el) {
        el.style.transform = '';
        el.style.willChange = '';
      }
    };
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps
}
