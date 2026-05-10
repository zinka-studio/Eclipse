'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParallax } from '@/hooks/useParallax';

const dishes = [
  {
    name: 'Oyamel Oysters',
    desc: 'White balsamic pearls, mignonette foam',
    img: '/DISHES/Oyamel Oysters.webp',
  },
  {
    name: 'Wagyu Tataki',
    desc: 'Truffle ponzu, micro-herb garnish',
    img: '/DISHES/Wagyu Tataki.webp',
  },
  {
    name: 'Black Sesame Tart',
    desc: 'Fermented honey, edible gold dust',
    img: '/DISHES/Black Sesame Tart.webp',
  },
  {
    name: "Chef's Selection",
    desc: "Tonight's laboratory creation — ask your server",
    img: "/DISHES/Chef's Selection.webp",
  },
];

export default function Food() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imgColRef  = useRef<HTMLDivElement>(null);

  useParallax(textColRef, 0.03);
  useParallax(imgColRef,  0.07);

  const go = useCallback(
    (idx: number) => {
      if (busy || idx === active) return;
      setBusy(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setActive(idx);
        setBusy(false);
      }, 320);
    },
    [busy, active]
  );

  const prev = () => go((active - 1 + dishes.length) % dishes.length);
  const next = () => go((active + 1) % dishes.length);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      },
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="food" ref={sectionRef}>
      {/* left column — 671×627px → 34.948×32.656vw, gap 65px → 3.385vw */}
      <div ref={textColRef} className="food-inner">

        {/* top block: headline + body, gap 10px → 0.521vw */}
        <div className="food-top reveal">
          <div className="food-headline">
            <span className="food-umami">Umami</span>
            <span className="food-afterdark">After Dark.</span>
          </div>
          <p className="food-body">
            We don&apos;t have a kitchen. We have a laboratory. Every dish is
            engineered to support a specific cocktail profile — salt, fat, and
            acid to keep your palate sharp from the first sip to the final hour.
          </p>
        </div>

        {/* nav row — 589px → 30.677vw */}
        <div className="food-nav reveal" data-d="2">
          <button className="food-arrow" onClick={prev} aria-label="Previous dish">
            {/* chevron left */}
            <svg viewBox="0 0 45 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 16L16 33L28 50" stroke="white" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="food-dish-info">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="food-dish-name">{dishes[active].name}</div>
                <div className="food-dish-desc">{dishes[active].desc}</div>
              </motion.div>
            </AnimatePresence>

            {/* dots sit directly under the description */}
            <div className="food-dots">
              {dishes.map((d, i) => (
                <button
                  key={i}
                  className={`food-dot${i === active ? ' active' : ''}`}
                  onClick={() => go(i)}
                  aria-label={d.name}
                />
              ))}
            </div>
          </div>

          <button className="food-arrow" onClick={next} aria-label="Next dish">
            {/* chevron right */}
            <svg viewBox="0 0 45 66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16L29 33L17 50" stroke="white" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* right image — 640px → 33.333vw, pos left:977px → 50.885vw, top:91px → 4.740vw */}
      <div ref={imgColRef} className="food-image-wrap">
        <div className="food-ring" />
        {/* mode="sync" — exit + enter run simultaneously so images overlap */}
        <AnimatePresence mode="sync">
          <motion.div
            key={active}
            className="food-img-slot"
            initial={{ rotateZ: 180, opacity: 0 }}
            animate={{ rotateZ: 0,   opacity: 1 }}
            exit={{    rotateZ: -180, opacity: 0 }}
            transition={{
              rotateZ: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
              opacity:  { duration: 0.12, ease: 'linear' },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dishes[active].img} alt={dishes[active].name} className="food-img" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
