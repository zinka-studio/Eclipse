'use client';
import { useEffect, useRef } from 'react';

export default function Concept() {
  const sectionRef = useRef<HTMLElement>(null);

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
    section.querySelectorAll('.reveal, .reveal-left').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="concept" ref={sectionRef}>
      <div className="concept-text">
        <div className="sec-tag reveal">
          <span className="sec-tag-num">02</span>
          <span className="sec-tag-line" />
          <span className="label">Behind the Veil</span>
        </div>
        <div className="sec-headline reveal" data-d="1">
          The Art of the<br /><em style={{ fontStyle: 'italic' }}>Disappearing Act.</em>
        </div>
        <div className="divider reveal" data-d="2" />
        <div className="body-copy reveal" data-d="3">
          Eclipse isn&apos;t just a bar — it&apos;s a celestial shift. Located in the hidden pulse of Tel Aviv, we&apos;ve stripped away the noise to focus on the essential. Black walls, white light, and the{' '}
          <em>vivid spectrum of the world&apos;s finest spirits.</em>
          <br /><br />
          We don&apos;t just serve drinks. We create moments that only happen once.
        </div>
      </div>
      <div className="concept-img-wrap reveal-left" data-d="1">
        <div className="concept-img-cross" />
        <div className="concept-img-label">Bar Interior — Photography</div>
      </div>
    </section>
  );
}
