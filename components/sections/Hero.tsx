'use client';
import { useEffect, useState, useRef } from 'react';
import { useFrameSequence } from '@/hooks/useFrameSequence';
import { gsap } from '@/lib/gsap-config';
import { getLenis } from '@/lib/lenis';

const SECTION_HEIGHT = 300;
const FADE_OVER = 2.4;        // match useFrameSequence SCROLL_TRAVEL so animation covers full video
const TEXT_ANIM_START = 0.05; // text starts fading at 5% progress
const TEXT_ANIM_END   = 0.28; // text fully gone at 28% progress (before doors open)

interface HeroProps { onReserve: () => void; }

export default function Hero({ onReserve }: HeroProps) {
  const [open, setOpen] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useFrameSequence(canvasRef, stickyRef);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 300);
    const t2 = setTimeout(() => setScrollHint(true), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const tick = () => {
      const lenis = getLenis();
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const progress = Math.min(1, scroll / (window.innerHeight * FADE_OVER));

      // Overlay: fades immediately as scrolling starts
      if (overlayRef.current) {
        if (progress > 0) {
          overlayRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.5));
        } else {
          overlayRef.current.style.opacity = '';
        }
      }

      // Text: fades to 0 + scales to 5 between TEXT_ANIM_START and TEXT_ANIM_END
      if (textRef.current) {
        if (progress >= TEXT_ANIM_START) {
          const tp = Math.min(1, (progress - TEXT_ANIM_START) / (TEXT_ANIM_END - TEXT_ANIM_START));
          textRef.current.style.transition = 'none';
          textRef.current.style.opacity = String(Math.max(0, 1 - tp));
          textRef.current.style.transform = `scale(${1 + tp * 4})`;
          textRef.current.style.pointerEvents = 'none';
        } else {
          textRef.current.style.transition = '';
          textRef.current.style.opacity = '';
          textRef.current.style.transform = '';
          textRef.current.style.pointerEvents = '';
        }
      }
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
        <div className="hero-eclipse">
          <div className="eclipse-ring" />
          <div className="eclipse-ring" />
          <div className="eclipse-ring" />
        </div>
        <div className={`lb lb-t${open ? ' open' : ''}`} />
        <div className={`lb lb-b${open ? ' open' : ''}`} />
        <div ref={textRef} className={`hero-inner${open ? ' in' : ''}`}>
          <div className="hero-pre">Tel Aviv · Est. 2024</div>
          <div className="hero-title">Enter The Night</div>
          <div className="hero-post-wrap">
            <div className="hero-tagline">
              An exclusive encounter between light and shadow.
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
