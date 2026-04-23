'use client';
import { useEffect, useRef, useState } from 'react';

interface HeroProps {
  onReserve: () => void;
}

export default function Hero({ onReserve }: HeroProps) {
  const [open, setOpen] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const lowerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 300);
    const t2 = setTimeout(() => setScrollHint(true), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      if (reduced) return;

      const p = Math.min(y / window.innerHeight, 1);

      if (titleRef.current) {
        const s = 1 + p * 0.45;
        const ty = -p * 110;
        titleRef.current.style.transform = `scale(${s}) translateY(${ty}px)`;
      }
      if (lowerRef.current) {
        const s = 1 + p * 0.22;
        const ty = p * 90;
        lowerRef.current.style.transform = `scale(${s}) translateY(${ty}px)`;
        lowerRef.current.style.opacity = String(Math.max(0, 1 - p * 2));
      }
      if (preRef.current) {
        preRef.current.style.opacity = String(Math.max(0, 1 - p * 2.5));
      }
      if (ruleRef.current) {
        ruleRef.current.style.opacity = String(Math.max(0, 1 - p * 2.5));
      }
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(Math.max(0, 1 - p * 1.4));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-leak leak-1" />
      <div className="hero-leak leak-2" />
      <div className="hero-vignette" ref={vignetteRef} />
      <div className="hero-eclipse">
        <div className="eclipse-ring" />
        <div className="eclipse-ring" />
        <div className="eclipse-ring" />
      </div>
      <div className={`lb lb-t${open ? ' open' : ''}${scrolled ? ' scrolled' : ''}`} />
      <div className={`lb lb-b${open ? ' open' : ''}${scrolled ? ' scrolled' : ''}`} />
      <div className="hero-parallax" id="hero-parallax">
        <div className={`hero-inner${open ? ' in' : ''}`}>
          <div className="hero-pre" ref={preRef}>Tel Aviv · Est. 2024</div>
          <div className="hero-title" ref={titleRef} style={{ willChange: 'transform' }}>Eclipse</div>
          <div className="hero-rule" ref={ruleRef} />
          <div ref={lowerRef} className="hero-lower" style={{ willChange: 'transform' }}>
            <div className="hero-tagline">
              An exclusive encounter<br />between light and shadow.
            </div>
            <div className="hero-actions">
              <a href="#concept" className="btn btn-ghost">Enter the Night</a>
              <button className="btn btn-ghost" onClick={onReserve}>Reserve a Table</button>
            </div>
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
    </section>
  );
}
