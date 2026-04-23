'use client';
import { useEffect, useState, useRef } from 'react';
import { useFrameSequence } from '@/hooks/useFrameSequence';
import { gsap } from '@/lib/gsap-config';
import { getLenis } from '@/lib/lenis';

// Frames complete at 2.4×vh (SCROLL_TRAVEL in hook).
// Section height 300vh → concept enters viewport at 200vh (83% through frames),
// so concept text is already visible while the last frames are playing.
const SECTION_HEIGHT = 300;

interface HeroProps {
  onReserve: () => void;
}

export default function Hero({ onReserve }: HeroProps) {
  const [open, setOpen] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useFrameSequence(canvasRef, stickyRef);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 300);
    const t2 = setTimeout(() => setScrollHint(true), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Fade overlay out as user starts scrolling — reveals raw canvas frame beneath
  useEffect(() => {
    const FADE_OVER = 1.5; // viewports of scroll over which overlay goes 1 → 0
    const tick = () => {
      const lenis = getLenis();
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const opacity = Math.max(0, 1 - scroll / (window.innerHeight * FADE_OVER));
      if (overlayRef.current) overlayRef.current.style.opacity = String(opacity);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <section id="hero" style={{ height: `${SECTION_HEIGHT}vh` }}>
      <div className="hero-sticky" ref={stickyRef}>
        <canvas ref={canvasRef} className="hero-canvas" />
        <div ref={overlayRef} className="hero-canvas-overlay" />
        <div className="hero-leak leak-1" />
        <div className="hero-leak leak-2" />
        <div className="hero-vignette" />
        <div className="hero-eclipse">
          <div className="eclipse-ring" />
          <div className="eclipse-ring" />
          <div className="eclipse-ring" />
        </div>
        <div className={`lb lb-t${open ? ' open' : ''}`} />
        <div className={`lb lb-b${open ? ' open' : ''}`} />
        <div className="hero-parallax" id="hero-parallax">
          <div className={`hero-inner${open ? ' in' : ''}`}>
            <div className="hero-pre">Tel Aviv · Est. 2024</div>
            <div className="hero-title">Eclipse</div>
            <div className="hero-rule" />
            <div className="hero-tagline">
              An exclusive encounter<br />between light and shadow.
            </div>
            <div className="hero-actions">
              <a href="#concept" className="btn btn-ghost">Enter the Night</a>
              <button className="btn btn-ghost" onClick={onReserve}>Reserve a Table</button>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-addr">42 HaNevi&apos;im St., Tel Aviv</div>
          <div className={`hero-scroll-hint${scrollHint ? ' in' : ''}`}>
            <span className="label" style={{ fontSize: '9px', letterSpacing: '0.24em' }}>Scroll</span>
            <div className="scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
