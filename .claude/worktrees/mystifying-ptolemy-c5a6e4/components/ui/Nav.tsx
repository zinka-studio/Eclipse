'use client';
import { useState, useEffect } from 'react';

interface NavProps {
  onReserve: () => void;
}

export default function Nav({ onReserve }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">Eclipse</a>
        <div
          className={`burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </div>
      </nav>

      <div id="overlay-menu" className={menuOpen ? 'open' : ''}>
        <a href="#concept" className="menu-link" onClick={close}>The Concept</a>
        <a href="#gallery" className="menu-link" onClick={close}>Cocktails</a>
        <a href="#elixir" className="menu-link" onClick={close}>The Elixir</a>
        <a href="#alchemy" className="menu-link" onClick={close}>Alchemy</a>
        <a href="#food" className="menu-link" onClick={close}>Food</a>
        <div className="menu-bottom">
          <a className="menu-bottom-link" href="#" onClick={() => { close(); onReserve(); }}>Reserve a Table →</a>
          <a className="menu-bottom-link" href="#" onClick={close}>42 HaNevi&apos;im St., Tel Aviv</a>
          <a className="menu-bottom-link" href="#" onClick={close}>20:00 — Until the last shadow</a>
        </div>
      </div>
    </>
  );
}
