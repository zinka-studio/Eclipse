'use client';
import { useEffect, useRef } from 'react';

const dishes = [
  { name: 'Oyamel Oysters', desc: 'White balsamic pearls, mignonette foam', tag: 'Pairs with Midnight Solstice' },
  { name: 'Wagyu Tataki', desc: 'Truffle ponzu, micro-herb garnish', tag: 'Pairs with Lunar Tide' },
  { name: 'Black Sesame Tart', desc: 'Fermented honey, edible gold dust', tag: 'Pairs with The Aphrodisiac' },
  { name: "Chef's Selection", desc: "Tonight's laboratory creation — ask your server", tag: 'Pairs with the Secret Elixir' },
];

export default function Food() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="food" ref={sectionRef}>
      <div className="food-wrap">
        <div className="food-left">
          <div className="sec-tag reveal">
            <span className="sec-tag-num" style={{ color: 'rgba(0,0,0,0.25)' }}>06</span>
            <span className="sec-tag-line" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <span className="label" style={{ color: 'rgba(0,0,0,0.3)' }}>Culinary Companions</span>
          </div>
          <div className="sec-headline dark reveal" data-d="1">Umami<br />in the Dark.</div>
          <div className="divider dark reveal" data-d="2" />
          <div className="body-copy dark reveal" data-d="3">
            We don&apos;t have a kitchen. We have a laboratory. Every dish is engineered to support a specific cocktail profile — salt, fat, and acid to keep your palate sharp from the first sip to the final hour.
          </div>
        </div>
        <div className="food-grid reveal" data-d="2">
          {dishes.map((d, i) => (
            <div key={i} className="fcard">
              <div className="fcard-img">
                <div className="fcard-img-cross" />
              </div>
              <div className="fcard-name">{d.name}</div>
              <div className="fcard-desc">{d.desc}</div>
              <div className="fcard-tag">{d.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
