'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';

export default function Concept() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const accentRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    const section = sectionRef.current;
    if (!section) return;
    section.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    const tick = () => {
      const overlay = overlayRef.current;
      const eyebrow = eyebrowRef.current;
      const accent  = accentRef.current;
      if (!overlay || !eyebrow) return;

      const vh        = window.innerHeight;
      const top       = eyebrow.getBoundingClientRect().top;
      const fadeStart = vh * 0.8;
      const fadeEnd   = vh * 0.2;

      if (top <= fadeEnd) {
        overlay.style.opacity = '1';
      } else if (top < fadeStart) {
        overlay.style.opacity = String((fadeStart - top) / (fadeStart - fadeEnd));
      } else {
        overlay.style.opacity = '0';
      }

      // accent color on "that only happen once" as it scrolls into center
      if (accent) {
        const hTop      = accent.getBoundingClientRect().top;
        const colorStart = vh * 0.7;
        const colorEnd   = vh * 0.3;
        const p = Math.min(1, Math.max(0, (colorStart - hTop) / (colorStart - colorEnd)));
        // interpolate white → #F4C485
        const r = Math.round(255 + (244 - 255) * p);
        const g = Math.round(255 + (196 - 255) * p);
        const b = Math.round(255 + (133 - 255) * p);
        accent.style.color = `rgb(${r},${g},${b})`;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      obs.disconnect();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section id="concept" ref={sectionRef}>
      <div ref={overlayRef} className="concept-overlay" />
      <div className="concept-inner">
        <div className="concept-headline-group reveal">
          <p ref={eyebrowRef} className="concept-eyebrow">We don&apos;t just serve drinks.</p>
          <h2 className="concept-headline">
            We create moments<br />
            <span ref={accentRef} className="concept-headline-accent">that only happen once</span>
          </h2>
        </div>
        <p className="concept-body reveal" data-d="1">
          Eclipse isn&apos;t just a bar — it&apos;s a celestial shift. Located in the hidden pulse of Tel Aviv, we&apos;ve stripped away the noise to focus on the essential. Black walls, white light, and the vivid spectrum of the world&apos;s finest spirits.
        </p>
      </div>
    </section>
  );
}
