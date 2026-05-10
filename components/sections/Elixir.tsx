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

const CAPTURE_FPS  = 15;   // frames extracted from each video
const FORWARD_FPS  = 15;   // playback speed forward
const BACKWARD_FPS = 15;   // playback speed backward (same rate, mirror of forward)
const HOLD_MS      = 500;  // pause on last frame before reversing
const CROSSFADE_MS = 220;  // canvas opacity crossfade on drink switch
const SWITCH_DELAY = 80;   // ms after rewind starts before swapping canvas

type FrameBank = ImageBitmap[];

async function extractFrames(videoSrc: string): Promise<FrameBank> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.addEventListener('loadedmetadata', async () => {
      const duration   = video.duration;
      const total      = Math.ceil(duration * CAPTURE_FPS);
      const canvas     = document.createElement('canvas');
      canvas.width     = video.videoWidth  || 1920;
      canvas.height    = video.videoHeight || 1080;
      const ctx        = canvas.getContext('2d')!;
      const frames: FrameBank = [];

      for (let i = 0; i < total; i++) {
        video.currentTime = i / CAPTURE_FPS;
        await new Promise<void>(r =>
          video.addEventListener('seeked', () => r(), { once: true })
        );
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          frames.push(await createImageBitmap(canvas));
        } catch {
          /* skip bad frame */
        }
        // yield to browser every 5 frames to stay responsive
        if (i % 5 === 4) await new Promise(r => setTimeout(r, 0));
      }

      resolve(frames);
    }, { once: true });

    video.src = videoSrc;
    video.load();
  });
}

export default function Elixir({ onReserve }: { onReserve?: () => void }) {
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);

  // which canvas slot is "on top"
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');

  const [activeIndex,    setActiveIndex]    = useState(0);
  const [progressKey,    setProgressKey]    = useState(0);
  const [cycleDuration,  setCycleDuration]  = useState(8000);
  const [ready,          setReady]          = useState(false);

  // refs shared across RAF callbacks (no stale closure issues)
  const framebanksRef   = useRef<(FrameBank | null)[]>([null, null, null]);
  const activeIdxRef    = useRef(0);
  const slotRef         = useRef<'A' | 'B'>('A');
  const frameIdxRef     = useRef(0);          // current frame of active drink
  const dirRef          = useRef<'fwd' | 'hold' | 'bwd'>('fwd');
  const lastTsRef       = useRef(0);
  const rafRef          = useRef(0);
  const transitingRef   = useRef(false);
  const autoTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingIdxRef   = useRef<number | null>(null); // target drink from manual click

  // ── helpers ────────────────────────────────────────────────────────────────

  const getCanvas = (slot: 'A' | 'B') =>
    slot === 'A' ? canvasARef.current : canvasBRef.current;

  const drawFrame = (slot: 'A' | 'B', frameIdx: number, drinkIdx: number) => {
    const bank   = framebanksRef.current[drinkIdx];
    const canvas = getCanvas(slot);
    if (!bank || !canvas) return;
    const frame  = bank[Math.max(0, Math.min(frameIdx, bank.length - 1))];
    if (!frame) return;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(frame, 0, 0, canvas.width, canvas.height);
  };

  // ── RAF loop ────────────────────────────────────────────────────────────────

  const tick = useCallback((ts: number) => {
    if (lastTsRef.current === 0) lastTsRef.current = ts;

    const dir = dirRef.current;
    if (dir !== 'hold') {
      const elapsed  = ts - lastTsRef.current;
      const fps      = dir === 'fwd' ? FORWARD_FPS : BACKWARD_FPS;
      const interval = 1000 / fps;

      if (elapsed >= interval) {
        lastTsRef.current = ts - (elapsed % interval);

        const bank  = framebanksRef.current[activeIdxRef.current];
        const total = bank?.length ?? 1;
        const slot  = slotRef.current;

        if (dir === 'fwd') {
          const next = frameIdxRef.current + 1;
          if (next >= total) {
            // Reached last frame — hold it, then reverse
            frameIdxRef.current = total - 1;
            dirRef.current = 'hold';
            holdTimerRef.current = setTimeout(() => {
              dirRef.current   = 'bwd';
              lastTsRef.current = 0;
            }, HOLD_MS);
          } else {
            frameIdxRef.current = next;
            drawFrame(slot, next, activeIdxRef.current);
          }
        } else {
          // backward
          const next = frameIdxRef.current - 1;
          if (next <= 0) {
            // Reached first frame — transition to pending (manual) or next auto drink
            frameIdxRef.current = 0;
            drawFrame(slot, 0, activeIdxRef.current);
            if (!transitingRef.current) {
              const nextIdx = pendingIdxRef.current !== null
                ? pendingIdxRef.current
                : (activeIdxRef.current + 1) % DRINKS.length;
              pendingIdxRef.current = null;
              doTransition(nextIdx);
            }
          } else {
            frameIdxRef.current = next;
            drawFrame(slot, next, activeIdxRef.current);
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []); // stable — reads only refs

  // ── transition between drinks ───────────────────────────────────────────────

  const startCycle = useCallback((frames: number) => {
    const fwdMs  = (frames / FORWARD_FPS)  * 1000;
    const bwdMs  = (frames / BACKWARD_FPS) * 1000;
    setCycleDuration(fwdMs + HOLD_MS + bwdMs);
    setProgressKey(k => k + 1);
  }, []);

  const doTransition = useCallback((toIdx: number) => {
    if (transitingRef.current || toIdx === activeIdxRef.current) return;
    transitingRef.current = true;
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    if (holdTimerRef.current)  clearTimeout(holdTimerRef.current);

    const currentSlot: 'A' | 'B' = slotRef.current;
    const nextSlot:    'A' | 'B' = currentSlot === 'A' ? 'B' : 'A';

    // Preload next drink's first frame into the inactive canvas
    drawFrame(nextSlot, 0, toIdx);

    const bwdMs = SWITCH_DELAY;

    setTimeout(() => {
      // Swap slot: next canvas fades in over current
      slotRef.current     = nextSlot;
      activeIdxRef.current = toIdx;
      frameIdxRef.current  = 0;
      dirRef.current       = 'fwd';
      lastTsRef.current    = 0;

      setActiveSlot(nextSlot);
      setActiveIndex(toIdx);
      const bank = framebanksRef.current[toIdx];
      startCycle(bank?.length ?? 60);

      transitingRef.current = false;
    }, bwdMs + CROSSFADE_MS);
  }, [startCycle]);

  // ── mount: extract frames, start loop ──────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Extract first drink synchronously so we can start immediately
      const first = await extractFrames(DRINKS[0].video);
      if (cancelled) return;
      framebanksRef.current[0] = first;
      frameIdxRef.current      = 0;
      activeIdxRef.current     = 0;
      setReady(true);
      startCycle(first.length);
      rafRef.current = requestAnimationFrame(tick);

      // Extract remaining drinks in background
      for (let i = 1; i < DRINKS.length; i++) {
        const bank = await extractFrames(DRINKS[i].video);
        if (!cancelled) framebanksRef.current[i] = bank;
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (holdTimerRef.current)  clearTimeout(holdTimerRef.current);
      // release GPU memory
      framebanksRef.current.forEach(bank => bank?.forEach(b => b.close()));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (index: number) => {
    if (transitingRef.current || index === activeIdxRef.current) return;
    // Cancel any pending timers
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    // Store the target; the RAF tick will call doTransition when rewind reaches frame 0
    pendingIdxRef.current = index;
    // Switch immediately to reverse from wherever we are
    dirRef.current    = 'bwd';
    lastTsRef.current = 0;
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <section id="elixir">
      <div className="elixir-sticky">

        <div className="elixir-bg">
          {/* Canvas A */}
          <canvas
            ref={canvasARef}
            width={1920}
            height={1080}
            className={`elixir-video${activeSlot === 'A' ? ' elixir-video-active' : ''}`}
            style={{ opacity: !ready ? 0 : undefined }}
          />
          {/* Canvas B */}
          <canvas
            ref={canvasBRef}
            width={1920}
            height={1080}
            className={`elixir-video${activeSlot === 'B' ? ' elixir-video-active' : ''}`}
          />
          <div className="elixir-overlay" />
        </div>

        <div className="elixir-content-grid">

          <div className="elixir-left">
            <p className="elixir-kicker">Hand-crafted. Small-batch.</p>
            <h2 className="elixir-main-title">
              What&apos;s your<br /><span style={{ color: '#F4C485' }}>elixir?</span>
            </h2>
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

                  {index === activeIndex && (
                    <div className="elixir-progress-track">
                      <div
                        key={progressKey}
                        className="elixir-progress-fill"
                        style={{ animationDuration: `${cycleDuration}ms` }}
                      />
                    </div>
                  )}

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
