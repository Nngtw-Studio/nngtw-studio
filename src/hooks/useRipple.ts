'use client';

import { useCallback, useState, type MouseEvent } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

/** Tracks click-position ripples for a duration (ms), each cleaning up independently. */
export function useRipple(duration = 600) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      const key = Date.now() + Math.random();

      setRipples((prev) => [...prev, { x, y, size, key }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.key !== key));
      }, duration);
    },
    [duration],
  );

  return { ripples, addRipple };
}
