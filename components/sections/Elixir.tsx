'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Drink {
  id: string;
  name: string;
  description: string;
  video: string;
}

const DRINKS: Drink[] = [
  {
    id: 'tropical-sunset',
    name: 'Tropical Sunset',
    description:
      'A vibrant tropical highball layered with citrus and passionfruit notes, served over crystal-clear ice and finished with fresh mint, dried orange, and pink grapefruit.',
    video: '/media/Tropical Sunset.mp4',
  },
  {
    id: 'emerald-cooler',
    name: 'Emerald Cooler',
    description:
      'A crisp gin-based refresher with cucumber essence and elderflower, served over a frozen cucumber sphere and finished with a spray of lime.',
    video: '/media/Emerald Cooler.mp4',
  },
  {
    id: 'dragon-berry',
    name: 'Dragon Berry',
    description:
      'A bold, exotic blend of dragonfruit and wild berries, infused with a hint of hibiscus and finished with a sparkling lime zest.',
    video: '/media/Dragon Berry.mp4',
  },
];

// 0 s → video plays forward
// 3 s → video starts reversing
// 8 s → next drink shows + new video plays forward
const PLAY_MS     = 5000; // play forward before reversing
const BACKWARD_MS = 3000; // reverse duration (5 s + 3 s = 8 s total)

export default function Elixir({ onReserve }: { onReserve?: () => void }) {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const transitingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const rafRef        = useRef<number>(0);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Core transition: reverse current video, THEN switch UI + play new video
  const transition = useCallback(async (toIndex: number) => {
    if (transitingRef.current || toIndex === currentIdxRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    transitingRef.current = true;

    // Phase 1: pause and scrub backward to frame 0
    video.pause();
    cancelAnimationFrame(rafRef.current);

    const startPos = video.currentTime;
    const t0 = performance.now();

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const p = Math.min((now - t0) / BACKWARD_MS, 1);
        video.currentTime = Math.max(0, startPos * (1 - p));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else resolve();
      };
      rafRef.current = requestAnimationFrame(tick);
    });

    // Phase 2: reverse done — now switch the UI and swap source
    currentIdxRef.current = toIndex;
    setActiveIndex(toIndex);
    video.src = DRINKS[toIndex].video;
    video.load();

    // Phase 3: play new video forward from start
    await new Promise<void>((resolve) => {
      video.addEventListener('canplay', () => resolve(), { once: true });
    });
    video.play().catch(() => {});
    transitingRef.current = false;
  }, []);

  // Schedule next auto-advance: wait PLAY_MS, then trigger transition
  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = (currentIdxRef.current + 1) % DRINKS.length;
      transition(next).then(() => scheduleNext());
    }, PLAY_MS);
  }, [transition]);

  useEffect(() => {
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scheduleNext]);

  // Manual navigation — skips the PLAY_MS wait, resets the auto-advance timer
  const navigate = (dir: number) => {
    const next = (currentIdxRef.current + dir + DRINKS.length) % DRINKS.length;
    transition(next).then(() => scheduleNext());
  };

  const goTo = (index: number) => {
    transition(index).then(() => scheduleNext());
  };

  return (
    <section id="elixir">
      <div className="elixir-sticky">

        <div className="elixir-bg">
          <video
            ref={videoRef}
            src={DRINKS[0].video}
            autoPlay
            muted
            playsInline
            className="elixir-video"
          />
          <div className="elixir-overlay" />
        </div>

        <div className="elixir-content-grid">

          <div className="elixir-left">
            <p className="elixir-kicker">Hand-crafted. Small-batch.</p>
            <h2 className="elixir-main-title">
              What&apos;s your<br />elixir?
            </h2>
            <div className="elixir-nav-arrows">
              <button className="arrow-btn" onClick={() => navigate(-1)} aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="arrow-btn" onClick={() => navigate(1)} aria-label="Next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="elixir-center" />

          <div className="elixir-right">
            <div className="elixir-drink-list">
              {DRINKS.map((drink, index) => (
                <div
                  key={drink.id}
                  className={`elixir-drink-item${index === activeIndex ? ' active' : ''}`}
                  onClick={() => goTo(index)}
                  style={{ cursor: 'none' }}
                >
                  <h3 className="elixir-drink-name">{drink.name}</h3>
                  <AnimatePresence mode="wait">
                    {index === activeIndex && (
                      <motion.p
                        key={drink.id}
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="elixir-drink-desc"
                      >
                        {drink.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
