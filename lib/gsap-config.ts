import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Scrub a video element based on scroll progress
 * @param videoElement HTML video element
 * @param options ScrollTrigger options (trigger, start, end, etc.)
 */
export function scrubVideo(
  videoElement: HTMLVideoElement,
  options: gsap.plugins.ScrollTriggerStaticVars = {}
) {
  if (!videoElement || !videoElement.duration) return;

  gsap.to(videoElement, {
    currentTime: videoElement.duration,
    scrollTrigger: {
      trigger: options.trigger || videoElement,
      start: options.start || 'top top',
      end: options.end || 'bottom bottom',
      scrub: 1,
      markers: false,
    },
  });
}

/**
 * Reveal element on scroll with fade & slide animation
 * @param element Target element
 * @param options Reveal options (direction, duration, stagger, etc.)
 */
export function revealOnScroll(
  element: HTMLElement,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    stagger?: boolean;
  } = {}
) {
  const { direction = 'up', duration = 0.6, delay = 0, stagger = false } = options;

  const offsetMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  gsap.fromTo(
    element,
    {
      opacity: 0,
      ...offsetMap[direction],
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

/**
 * Create parallax effect on scroll
 * @param element Target element
 * @param speed Parallax speed (0.5 = half speed of scroll, 1.5 = 1.5x speed)
 */
export function parallaxLayer(element: HTMLElement, speed: number = 0.5) {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      markers: false,
    },
  });
}

/**
 * Staggered text reveal (character by character or word by word)
 * @param element Target text element
 * @param options Stagger options (mode, duration, etc.)
 */
export function textReveal(
  element: HTMLElement,
  options: {
    mode?: 'char' | 'word';
    duration?: number;
    staggerAmount?: number;
  } = {}
) {
  const { mode = 'char', duration = 0.04, staggerAmount = 0.05 } = options;

  // Split text into spans
  const text = element.textContent || '';
  const split = mode === 'char' ? text.split('') : text.split(' ');
  element.innerHTML = split
    .map((item) => `<span style="display: inline-block; overflow: hidden;"><span>${item}</span></span>`)
    .join(mode === 'word' ? ' ' : '');

  const spans = element.querySelectorAll('span > span');

  gsap.fromTo(
    spans,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

export { gsap, ScrollTrigger };
