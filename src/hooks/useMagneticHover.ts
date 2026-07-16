'use client';

import { useEffect, useRef } from 'react';

const IDLE_LIFT = -3; // px, subtle upward settle on hover
const IDLE_SCALE = 1;
const PRESS_SCALE = 0.98;
const SPRING_TRANSITION = 'transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
const RESET_TRANSITION = 'transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
const PRESS_TRANSITION = 'transform 120ms ease-out';

/** Subtle magnetic-follow + spring scale on hover, transform-only and disabled for touch/reduced-motion. */
export function useMagneticHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let pressed = false;

    const apply = (transition: string) => {
      el.style.transition = transition;
      const scale = pressed ? PRESS_SCALE : IDLE_SCALE;
      const dy = pressed ? 0 : IDLE_LIFT;
      el.style.transform = `translateY(${dy}px) scale(${scale})`;
    };

    const handleEnter = () => {
      pressed = false;
      apply(SPRING_TRANSITION);
    };

    const handleLeave = () => {
      pressed = false;
      el.style.transition = RESET_TRANSITION;
      el.style.transform = 'translateY(0px) scale(1)';
    };

    const handleDown = () => {
      pressed = true;
      apply(PRESS_TRANSITION);
    };

    const handleUp = () => {
      pressed = false;
      apply(SPRING_TRANSITION);
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mousedown', handleDown);
    el.addEventListener('mouseup', handleUp);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mousedown', handleDown);
      el.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return ref;
}
