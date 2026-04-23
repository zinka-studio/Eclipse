'use client';
import { useEffect, useRef } from 'react';

interface ElixirProps {
  onReserve: () => void;
}

export default function Elixir({ onReserve }: ElixirProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="elixir" ref={sectionRef}>
      <div className="elixir-glow" />
      <div className="rings">
        <div className="ring" /><div className="ring" />
        <div className="ring" /><div className="ring" />
      </div>
      <div className="elixir-status reveal">
        <div className="status-dot" />
        <span className="label">Locked Until Sunset · 20:00</span>
      </div>
      <div className="lock-wrap reveal" data-d="1">
        <div className="lock-ring" />
        <div className="lock-ring" />
        <div className="lock-circle">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>
      <div className="elixir-kicker reveal label" data-d="2" style={{ color: 'rgba(255,255,255,0.25)' }}>
        The Elixir of {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
      </div>
      <div className="elixir-title reveal" data-d="2">Tonight&apos;s<br />Secret Creation.</div>
      <div className="elixir-body reveal" data-d="3">
        Every evening our master alchemist debuts a single creation that exists for one night only. No recipe is ever repeated. Ask your server for the{' '}
        <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>&ldquo;Eclipse Protocol&rdquo;</em>{' '}
        to reveal tonight&apos;s secret.
      </div>
      <button className="btn btn-ghost elixir-cta reveal" data-d="4" onClick={onReserve} style={{ cursor: 'none' }}>
        Eclipse Protocol
      </button>
    </section>
  );
}
