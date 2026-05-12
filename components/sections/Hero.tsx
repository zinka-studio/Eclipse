'use client';
import { useEffect, useState, useRef } from 'react';
import { useFrameSequence } from '@/hooks/useFrameSequence';
import { gsap } from '@/lib/gsap-config';
import { getLenis } from '@/lib/lenis';

const SECTION_HEIGHT = 260;
const FADE_OVER = 2.4;        // match useFrameSequence SCROLL_TRAVEL so animation covers full video
const TEXT_ANIM_START = 0.20; // text starts fading at 20% scroll progress
const TEXT_ANIM_END   = 0.43; // text fully gone at 43% progress

interface HeroProps { onReserve: () => void; ready?: boolean; hideLb?: boolean; }

export default function Hero({ onReserve, ready = true, hideLb = false }: HeroProps) {
  const [open, setOpen] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const { smoothedProgressRef } = useFrameSequence(canvasRef, stickyRef);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(() => setOpen(true), 120);
    const t2 = setTimeout(() => setScrollHint(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [ready]);

  useEffect(() => {
    const tick = () => {
      const lenis = getLenis();
      const scroll = lenis ? lenis.scroll : window.scrollY;
      const rawProgress = Math.min(1, scroll / (window.innerHeight * FADE_OVER));
      // Smoothed progress tracks the actual frame position (post-scrub lerp)
      const progress = smoothedProgressRef.current;

      // Overlay: fades immediately as scrolling starts (use raw scroll for responsiveness)
      if (overlayRef.current) {
        if (rawProgress > 0) {
          overlayRef.current.style.opacity = String(Math.max(0, 1 - rawProgress * 2.5));
        } else {
          overlayRef.current.style.opacity = '';
        }
      }

      // Scroll hint: fades out immediately as scrolling begins
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - rawProgress * 8));
      }

      // Text: fades to 0 + scales to 5 — tied to smoothed frame progress
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
        {!hideLb && <div className={`lb lb-t${open ? ' open' : ''}`} />}
        {!hideLb && <div className={`lb lb-b${open ? ' open' : ''}`} />}
        <div ref={textRef} className={`hero-inner${open ? ' in' : ''}`}>
          <div className="hero-title">
            <span className="hero-title-upper">Enter the</span>
            <span className="hero-title-lower">Night</span>
          </div>
          <div className="hero-post-wrap">
            <div className="hero-tagline">
              <span className="hero-tagline-line">An exclusive cocktail bar hidden after dark.</span>
              <span className="hero-tagline-line">Signature drinks that change with every visit.</span>
            </div>
            <div className="hero-actions">
              <button className="btn btn-ghost" onClick={onReserve}>Reserve a Table</button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  const el = document.getElementById('menu');
                  if (!el) return;
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
                  else el.scrollIntoView({ behavior: 'smooth' });
                }}
              >Our Menu</button>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-addr">42 HaNevi&apos;im St., Tel Aviv</div>
        </div>
        <div ref={scrollHintRef} className={`hero-scroll-hint${scrollHint ? ' in' : ''}`}>
          <div className="scroll-hint-line" />
          <span className="scroll-hint-label">Scroll to experience</span>
          <div className="scroll-hint-line scroll-hint-line--r" />
        </div>
      </div>
    </section>
  );
}
