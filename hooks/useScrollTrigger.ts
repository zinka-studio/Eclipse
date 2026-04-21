'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

interface UseScrollTriggerOptions {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  markers?: boolean;
}

/**
 * React hook for GSAP ScrollTrigger
 * Handles cleanup on unmount, responsive considerations
 */
export function useScrollTrigger(
  ref: React.RefObject<HTMLElement>,
  options: UseScrollTriggerOptions
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const triggerElement = typeof options.trigger === 'string' ? options.trigger : options.trigger || ref.current;

    triggerRef.current = ScrollTrigger.create({
      trigger: triggerElement,
      start: options.start || 'top center',
      end: options.end || 'bottom center',
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
      markers: options.markers || false,
    });

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, [ref, options]);

  return triggerRef;
}

export default useScrollTrigger;
