'use client';
import { useEffect, useState } from 'react';

interface HeroProps {
  onReserve: () => void;
}

export default function Hero({ onReserve }: HeroProps) {
  const [open, setOpen] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 300);
    const t2 = setTimeout(() => setScrollHint(true), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hp = document.getElementById('hero-parallax');
      if (hp) hp.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-leak leak-1" />
      <div className="hero-leak leak-2" />
      <div className={`hero-vignette${scrolled ? ' scrolled' : ''}`} />
      <div className="hero-eclipse">
        <div className="eclipse-ring" />
        <div className="eclipse-ring" />
        <div className="eclipse-ring" />
      </div>
      <div className={`lb lb-t${open ? ' open' : ''}${scrolled ? ' scrolled' : ''}`} />
      <div className={`lb lb-b${open ? ' open' : ''}${scrolled ? ' scrolled' : ''}`} />
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
    </section>
  );
}
