'use client';
import { useEffect, useState } from 'react';

type Phase = 'fill' | 'open' | 'done';

interface PreloaderProps { onComplete: () => void; }

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>('fill');

  useEffect(() => {
    let windowLoaded = document.readyState === 'complete';
    let minElapsed = false;

    const tryAdvance = () => {
      if (windowLoaded && minElapsed) setPhase('open');
    };

    const minTimer = setTimeout(() => { minElapsed = true; tryAdvance(); }, 2400);

    if (!windowLoaded) {
      window.addEventListener('load', () => { windowLoaded = true; tryAdvance(); }, { once: true });
    }

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'open') return;
    // Fire hero entrance immediately as panels begin sliding
    onComplete();
    const t = setTimeout(() => setPhase('done'), 1300);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`preloader${phase === 'open' ? ' preloader--open' : ''}`}>
      <div className="preloader-panel preloader-panel--t" />
      <div className="preloader-panel preloader-panel--b" />
      <div className={`preloader-brand${phase === 'open' ? ' preloader-brand--fade' : ''}`}>
        <span className="preloader-brand-dim">Eclipse</span>
        <span className="preloader-brand-lit">Eclipse</span>
      </div>
    </div>
  );
}
