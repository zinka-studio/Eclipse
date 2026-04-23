'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    };
    document.addEventListener('mousemove', onMove);

    let rafId: number;
    const raf = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const addLink = (el: Element) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
    };
    const addBtn = (el: Element) => {
      el.addEventListener('mouseenter', () => { document.body.classList.remove('link-hover'); document.body.classList.add('btn-hover'); });
      el.addEventListener('mouseleave', () => document.body.classList.remove('btn-hover'));
    };

    document.querySelectorAll('a, button, .burger, .arrow-btn, .fc-overlay-btn').forEach(addLink);
    document.querySelectorAll('.btn, .dr-submit').forEach(addBtn);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
