'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

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

// 12 fps is plenty for scroll-scrubbed playback and cuts frame count ~20% vs 15
const CAPTURE_FPS = 12;
// Capture at half resolution — GPU upscales to canvas size invisibly, 4× less memory
const CAPTURE_W   = 960;
const CAPTURE_H   = 540;

type FrameBank = ImageBitmap[];

async function extractFrames(videoSrc: string): Promise<FrameBank> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.addEventListener('loadedmetadata', async () => {
      const total  = Math.ceil(video.duration * CAPTURE_FPS);
      const frames: FrameBank = [];

      for (let i = 0; i < total; i++) {
        video.currentTime = i / CAPTURE_FPS;
        await new Promise<void>(r =>
          video.addEventListener('seeked', () => r(), { once: true })
        );
        try {
          // Resize during decode — no intermediate canvas needed
          frames.push(await createImageBitmap(video, {
            resizeWidth:   CAPTURE_W,
            resizeHeight:  CAPTURE_H,
            resizeQuality: 'medium',
          }));
        } catch { /* skip bad frame */ }
        if (i % 5 === 4) await new Promise(r => setTimeout(r, 0));
      }

      resolve(frames);
    }, { once: true });

    video.src = videoSrc;
    video.load();
  });
}

/*
  Scroll progress → frame mapping (4 equal segments):

  0.00 – 0.25  Tropical Sunset  last → 0   (drain as you scroll in)
  0.25 – 0.50  Emerald Cooler   0 → last   (fill)
  0.50 – 0.75  Emerald Cooler   last → 0   (drain)
  0.75 – 1.00  Dragon Berry     0 → last   (fill → section unpins)

  Transitions happen at frame 0 of each drink, so the visual cut is seamless.
*/
function resolveScrollState(progress: number): { drinkIdx: number; frameProgress: number } {
  if (progress <= 0.25) return { drinkIdx: 0, frameProgress: 1 - progress / 0.25 };
  if (progress <= 0.50) return { drinkIdx: 1, frameProgress: (progress - 0.25) / 0.25 };
  if (progress <= 0.75) return { drinkIdx: 1, frameProgress: 1 - (progress - 0.50) / 0.25 };
  return { drinkIdx: 2, frameProgress: (progress - 0.75) / 0.25 };
}

export default function Elixir({ onReserve }: { onReserve?: () => void }) {
  const stickyRef     = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const framebanksRef = useRef<(FrameBank | null)[]>([null, null, null]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [ready,       setReady]       = useState(false);

  const drawFrame = (drinkIdx: number, frameProgress: number) => {
    const bank   = framebanksRef.current[drinkIdx];
    const canvas = canvasRef.current;
    if (!bank || !canvas || bank.length === 0) return;
    const idx   = Math.round(Math.max(0, Math.min(1, frameProgress)) * (bank.length - 1));
    const frame = bank[idx];
    if (!frame) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale 1.2× (20% larger than original).
    // Anchor the bottom of the drawn image to canvas bottom, then lift 5 vw.
    // 5 vw in canvas-space = 0.05 × 1920 = 96 px.
    const scale  = 1.08;
    const dw     = canvas.width  * scale;               // 2304
    const dh     = canvas.height * scale;               // 1296
    const dx     = (canvas.width  - dw) / 2;           // centre horizontally: -192
    const dy     = canvas.height - dh - 58;             // bottom flush − 3 vw up (5 vw − 2 vw)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, dx, dy, dw, dh);
  };

  // ── extract frames ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const first = await extractFrames(DRINKS[0].video);
      if (cancelled) return;
      framebanksRef.current[0] = first;
      drawFrame(0, 1); // start at last frame — full glass
      setReady(true);

      // Extract remaining drinks in parallel — roughly halves background load time
      const [bank1, bank2] = await Promise.all([
        extractFrames(DRINKS[1].video),
        extractFrames(DRINKS[2].video),
      ]);
      if (!cancelled) {
        framebanksRef.current[1] = bank1;
        framebanksRef.current[2] = bank2;
      }
    })();

    return () => {
      cancelled = true;
      framebanksRef.current.forEach(bank => bank?.forEach(b => b.close()));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── ScrollTrigger pin + scrub ──────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !stickyRef.current) return;

    // Draw the first frame immediately so the canvas isn't blank on pin
    drawFrame(0, 1);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stickyRef.current,
        start: 'top top',
        // 4 viewport-heights of scroll travel before unpinning
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        onUpdate(self) {
          const { drinkIdx, frameProgress } = resolveScrollState(self.progress);
          setActiveIndex(drinkIdx);
          drawFrame(drinkIdx, frameProgress);
        },
      });
    });

    return () => ctx.revert();
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <section id="elixir">
      <div className="elixir-sticky" ref={stickyRef}>

        <div className="elixir-bg">
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="elixir-video elixir-video-active"
            style={{ opacity: !ready ? 0 : undefined }}
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
