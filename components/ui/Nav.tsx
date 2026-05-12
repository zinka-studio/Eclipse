'use client';
import { useEffect } from 'react';

interface NavProps {
  onReserve: () => void;
  menuOpen: boolean;
  onMenuToggle: (open: boolean, scrollTarget?: string) => void;
}

export default function Nav({ onReserve, menuOpen, onMenuToggle }: NavProps) {
  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => onMenuToggle(false);

  const handleNavLink = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    onMenuToggle(false, target);
  };

  return (
    <>
      <nav id="nav">
        <a href="#" className="nav-logo">Eclipse</a>
        <div
          className={`burger${menuOpen ? ' open' : ''}`}
          onClick={() => onMenuToggle(!menuOpen)}
        >
          <span /><span /><span />
        </div>
      </nav>

      <div id="overlay-menu" className={menuOpen ? 'open' : ''}>
        <a href="#concept"         className="menu-link" style={{'--i': 0} as React.CSSProperties} onClick={e => handleNavLink(e, '#concept')}>The Concept</a>
        <a href="#elixir"          className="menu-link" style={{'--i': 1} as React.CSSProperties} onClick={e => handleNavLink(e, '#elixir')}>The Elixir</a>
        <a href="#secret-creation" className="menu-link" style={{'--i': 2} as React.CSSProperties} onClick={e => handleNavLink(e, '#secret-creation')}>Secret Creation</a>
        <a href="#food"            className="menu-link" style={{'--i': 3} as React.CSSProperties} onClick={e => handleNavLink(e, '#food')}>Food</a>
        <a href="#menu"            className="menu-link" style={{'--i': 4} as React.CSSProperties} onClick={e => handleNavLink(e, '#menu')}>The Menu</a>
        <div className="menu-cta-wrap" style={{'--i': 5} as React.CSSProperties}>
          <button
            className="menu-reserve-btn"
            onClick={() => { close(); onReserve(); }}
          >
            Reserve a Table
          </button>
        </div>
        <div className="menu-bottom">
          <a className="menu-bottom-link" href="#" onClick={close}>42 HaNevi&apos;im St., Tel Aviv</a>
          <a className="menu-bottom-link" href="#" onClick={close}>20:00 — Until the last shadow</a>
        </div>
      </div>
    </>
  );
}
