'use client';
import { useEffect, useRef } from 'react';

const layers = [
  { cls: 'g-l1', label: 'Layer 4 — Finish', name: 'Gold-leaf garnish', swatch: 'linear-gradient(to right,rgba(200,180,100,0.06),rgba(220,200,120,0.12))' },
  { cls: 'g-l2', label: 'Layer 3 — Middle', name: 'Aged spirit reserve', swatch: 'linear-gradient(to right,rgba(180,160,220,0.05),rgba(200,180,240,0.09))' },
  { cls: 'g-l3', label: 'Layer 2 — Bridge', name: 'Cold-pressed citrus', swatch: 'linear-gradient(to right,rgba(160,130,80,0.07),rgba(180,150,100,0.12))' },
  { cls: 'g-l4', label: 'Layer 1 — Base', name: 'Botanical infusion', swatch: 'linear-gradient(to right,rgba(60,50,80,0.12),rgba(80,65,100,0.18))' },
];

export default function Alchemy() {
  const sectionRef = useRef<HTMLElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const glass = glassRef.current;
    if (!glass) return;
    const glassObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => glass.querySelectorAll('.g-layer').forEach(l => l.classList.add('poured')), 300);
        glassObs.disconnect();
      }
    }, { threshold: 0.4 });
    glassObs.observe(glass);
    return () => glassObs.disconnect();
  }, []);

  return (
    <section id="alchemy" ref={sectionRef}>
      <div className="alc-left">
        <div className="sec-tag reveal">
          <span className="sec-tag-num">05</span>
          <span className="sec-tag-line" />
          <span className="label">Interactive Alchemy</span>
        </div>
        <div className="sec-headline reveal" data-d="1">Deconstruct<br />the Craft.</div>
        <div className="divider reveal" data-d="2" />
        <div className="body-copy reveal" data-d="3">
          Explore <em>The Aphrodisiac</em> in three dimensions. See every layer of our signature infusion — from the botanical base to the floating gold-leaf garnish.
        </div>
        <div className="layer-key reveal" data-d="4">
          {layers.map((l, i) => (
            <div key={i} className="lk-row">
              <div className="lk-swatch" style={{ background: l.swatch }} />
              <div>
                <div className="lk-label">{l.label}</div>
                <div className="lk-name">{l.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="alc-right reveal" data-d="2">
        <div className="alc-orbit" />
        <div className="glass" id="cocktail-glass" ref={glassRef}>
          <div className="g-rim" />
          <div className="g-body">
            <div className="g-layers">
              <div className="g-layer g-l4" />
              <div className="g-layer g-l3" />
              <div className="g-layer g-l2" />
              <div className="g-layer g-l1" />
            </div>
          </div>
          <div className="g-stem" />
          <div className="g-foot" />
        </div>
        <div className="glass-hint">↻ Rotate · Three.js</div>
      </div>
    </section>
  );
}
