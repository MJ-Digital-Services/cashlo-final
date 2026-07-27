'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Animates from whatever is currently on screen to `target`. Deliberately not
 * gated on visibility, so it can never get stuck at a stale value — this drives
 * the earnings calculator, which has to read true at all times.
 */
export function useAnimatedNumber(target: number, duration = 650) {
  const reduce = useReducedMotion();
  const [value, setValue] = React.useState(target);
  const fromRef = React.useRef(target);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reduce) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = p < 1 ? from + (target - from) * eased : target;
      fromRef.current = next;
      setValue(next);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, reduce]);

  return value;
}

/** True once the element has been seen; falls back to true where IntersectionObserver is missing. */
export function useSeen(ref: React.RefObject<Element | null>, margin = '-60px') {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return seen;
}