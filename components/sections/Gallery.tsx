'use client';
import { useEffect, useRef, useState } from 'react';

const cocktails = [
  {
    name: 'The Midnight Solstice',
    desc: 'Charcoal-infused gin, elderflower, and a single spray of night essence.',
    pairing: 'Oyamel Oysters, white balsamic pearls',
  },
  {
    name: 'Lunar Tide',
    desc: 'Aged rum, toasted coconut, cold-brew reduction over clear ice.',
    pairing: 'Wagyu Tataki, truffle ponzu',
  },
  {
    name: 'The Aphrodisiac',
    desc: 'Botanical base, slow-infused citrus peel, floating gold-leaf garnish.',
    pairing: 'Black sesame tart, fermented honey',
  },
];

export default function Gallery() {
  const fsRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fs = fsRef.current;
    if (!fs) return;
    let drag = false, ox = 0, sl = 0;
    const onDown = (e: MouseEvent) => { drag = true; ox = e.pageX - fs.offsetLeft; sl = fs.scrollLeft; };
    const onUp = () => { drag = false; };
    const onMove = (e: MouseEvent) => {
      if (!drag) return;
      e.preventDefault();
      fs.scrollLeft = sl - (e.pageX - fs.offsetLeft - ox);
    };
    const onScroll = () => setActiveIdx(Math.round(fs.scrollLeft / 362));
    fs.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mousemove', onMove);
    fs.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      fs.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mousemove', onMove);
      fs.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scroll = (dir: number) => fsRef.current?.scrollBy({ left: dir * 370, behavior: 'smooth' });

  return (
    <section id="gallery" ref={sectionRef}>
      <div className="gallery-head">
        <div className="gallery-copy">
          <div className="gallery-intro reveal">03 — The Liquid Gallery</div>
          <div className="gallery-title reveal" data-d="1">Hand-crafted.<br />Small-batch.</div>
          <div className="gallery-sub reveal" data-d="2">Poured today. Never repeated.</div>
        </div>
        <div className="gallery-arrows reveal" data-d="1">
          <button className="arrow-btn" onClick={() => scroll(-1)} aria-label="Previous">
            <svg viewBox="0 0 14 14"><polyline points="9,2 4,7 9,12" /></svg>
          </button>
          <button className="arrow-btn" onClick={() => scroll(1)} aria-label="Next">
            <svg viewBox="0 0 14 14"><polyline points="5,2 10,7 5,12" /></svg>
          </button>
        </div>
      </div>
      <div className="filmstrip-wrap">
        <div className="filmstrip" ref={fsRef}>
          {cocktails.map((c, i) => (
            <div key={i} className="fc reveal" data-d={i > 0 ? String(i) : undefined}>
              <div className="fc-img">
                <div className="fc-overlay"><button className="fc-overlay-btn">View Details</button></div>
              </div>
              <div className="fc-body">
                <div className="fc-name">{c.name}</div>
                <div className="fc-desc">{c.desc}</div>
                <div className="fc-rule" />
                <div className="fc-pairing-lbl">Pairs with</div>
                <div className="fc-pairing-val">{c.pairing}</div>
              </div>
            </div>
          ))}
          <div className="fc dim">
            <div className="fc-img">
              <div className="fc-img-ph">
                <div className="fc-img-circle" style={{ opacity: 0.4 }} />
                <div className="fc-img-label">Seasonal Selection</div>
              </div>
            </div>
            <div className="fc-body">
              <div className="fc-name">Tonight&apos;s Addition</div>
              <div className="fc-desc">Our bartender&apos;s seasonal creation — revealed at the table.</div>
            </div>
          </div>
        </div>
        <div className="gallery-progress">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`gp-dot${activeIdx === i ? ' active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
