'use client';
import { useEffect, useRef } from 'react';

interface FooterProps {
  onReserve: () => void;
}

export default function EclipseFooter({ onReserve }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    footerRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <footer id="footer" ref={footerRef}>
      <div className="ft-pre reveal">Fine Cocktail Bar · Tel Aviv · Est. 2024</div>
      <div className="ft-wordmark reveal" data-d="1">Eclipse</div>
      <div className="ft-info reveal" data-d="2">
        <div className="ft-info-item">
          <div className="ft-info-label">Address</div>
          <div className="ft-info-val">42 HaNevi&apos;im St.</div>
        </div>
        <div className="ft-sep-v" />
        <div className="ft-info-item">
          <div className="ft-info-label">Hours</div>
          <div className="ft-info-val">20:00 — Last shadow</div>
        </div>
        <div className="ft-sep-v" />
        <div className="ft-info-item">
          <div className="ft-info-label">Reservations</div>
          <div className="ft-info-val">Required</div>
        </div>
      </div>
      <div className="ft-cta reveal" data-d="3">
        <button className="btn btn-ghost" onClick={onReserve} style={{ cursor: 'none' }}>Reserve Your Seat</button>
      </div>
      <div className="ft-socials reveal" data-d="4">
        <a href="#" className="ft-social">Instagram</a>
        <div className="ft-sep" />
        <a href="#" className="ft-social">Twitter</a>
        <div className="ft-sep" />
        <a href="#" className="ft-social">TikTok</a>
      </div>
      <div className="ft-copy reveal" data-d="5">© 2026 Eclipse Bar Ltd. · Tel Aviv · All rights reserved</div>
    </footer>
  );
}
