/** @format */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from 'framer-motion';

/**
 * The header's hairline bottom border doubling as a route-loading bar. On any
 * internal link click the brand-orange fill sweeps from the left — fast at
 * first, easing toward 85% while the destination loads (the App Router exposes
 * no progress events, so the trickle is the honest approximation) — then snaps
 * to 100% and fades once the new route's pathname commits.
 *
 * Clicks are observed at document capture: Next's <Link> calls preventDefault
 * during bubble, so by then `defaultPrevented` can't distinguish client-side
 * navigation from a genuinely cancelled click.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const scaleX = useMotionValue(0);
  const opacity = useMotionValue(0);

  const activeRef = useRef(false);
  const trickleRef = useRef<AnimationPlaybackControls | null>(null);
  const staleTimerRef = useRef<number | null>(null);
  const prevPathRef = useRef(pathname);

  /* Finish/abandon live in refs so the click effect never needs re-binding */
  const finishRef = useRef(() => {});
  finishRef.current = () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    if (staleTimerRef.current) window.clearTimeout(staleTimerRef.current);
    trickleRef.current?.stop();
    animate(scaleX, 1, { duration: 0.2, ease: 'easeOut' });
    animate(opacity, 0, { duration: 0.45, delay: 0.2, ease: 'easeOut' }).then(() => {
      if (!activeRef.current) scaleX.set(0);
    });
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      /* Modified/secondary clicks open new tabs/windows — no navigation here */
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      /* Same pathname+query (incl. pure #hash hops) never remounts the route */
      if (url.pathname === location.pathname && url.search === location.search) return;

      activeRef.current = true;
      if (staleTimerRef.current) window.clearTimeout(staleTimerRef.current);
      trickleRef.current?.stop();
      scaleX.set(0);
      opacity.set(1);
      trickleRef.current = animate(scaleX, 0.85, { duration: 7, ease: [0.1, 0.7, 0.4, 1] });
      /* A cancelled/failed navigation never changes pathname — don't strand a
         frozen bar under the nav; quietly fade it out and rearm. */
      staleTimerRef.current = window.setTimeout(() => {
        activeRef.current = false;
        trickleRef.current?.stop();
        animate(opacity, 0, { duration: 0.6, ease: 'easeOut' }).then(() => {
          if (!activeRef.current) scaleX.set(0);
        });
      }, 12000);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      if (staleTimerRef.current) window.clearTimeout(staleTimerRef.current);
      trickleRef.current?.stop();
    };
  }, [scaleX, opacity]);

  /* The new route has committed — run the bar home and fade */
  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;
    finishRef.current();
  }, [pathname]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX, opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left bg-brand-orange shadow-[0_0_10px_var(--color-brand-orange)]"
    />
  );
}
