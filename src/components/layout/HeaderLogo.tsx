/** @format */

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion';
import {
  COMPACT_LOGO_ASPECT,
  EASE_OUT,
  restFistRectFrom,
  useIntro,
  type Rect,
} from '@/components/layout/IntroContext';
import { cn } from '@/lib/utils';

/* `Link`'s own `style` prop only accepts plain CSSProperties — motion.create
   wraps it so the fixed-position flight (left/top/width/height MotionValues)
   can be applied directly to the same anchor, no extra positioning wrapper. */
const MotionLink = motion.create(Link);

/* Same ease as the intro reveal, so the hover wipe reads as the same gesture. */
const wipeEase = cubicBezier(0.25, 1, 0.3, 1);
const easeOut = cubicBezier(...EASE_OUT);

/* Geometry measured from the compact logo (viewBox 0 0 147.08 120): the pink
   brow-stripe center anchors the wipe, and the thumb "egg" (rx 17% / ry 26%
   from that anchor) is the hesitate frame — the same egg-park + hesitate the
   intro reveal uses. */
const FALLBACK_ANCHOR = '66.9% 19.7%';
/* The reveal begins just to the right of the stripe's geometric center. This
   gives the thumb/upper palm a cleaner first reveal without changing the
   logo's flight path or its final resting position. */
const REVEAL_ANCHOR_X_OFFSET = 3;

/**
 * Header brand logo. At rest it's the cream compact logo. On hover the orange
 * fist paints in over it with the intro's own ellipse wipe — hesitating on
 * the thumb egg — and on leave it wipes back to cream. A single `hover`
 * MotionValue drives the clip, so releasing mid-wipe reverses smoothly from
 * wherever it is.
 *
 * During the intro, the SAME element (never duplicated, never unmounted)
 * plays the flight: `position: fixed` with its width/height/left/top driven
 * directly by the measured start/end rects (not `transform: scale`, which
 * risks the browser scaling a cached small-native raster rather than
 * re-rendering the vector at each frame's true size), landing exactly on its
 * own natural resting rect — so there is nothing to swap at handoff. The same
 * `hover` MotionValue is driven by intro progress while the ride plays,
 * pinned orange through the flight then sweeping to cream across the same
 * 0.82-0.98 window the wipe always used, landing on the same value hover's
 * own rest state already sits at.
 */
export function HeaderLogo() {
  const reduce = useReducedMotion();
  const { active, progress, flights, parts } = useIntro();
  const anchor = parts
    ? `${Math.min(100, parts.pinkAnchor.x + REVEAL_ANCHOR_X_OFFSET).toFixed(3)}% ${parts.pinkAnchor.y.toFixed(3)}%`
    : FALLBACK_ANCHOR;
  /* ONE persistent box model for every state: the outer box always carries
     the fist part's guard-pad inset, and the artwork layer sits inset by
     padX/padY percentages inside it — identical structure whether flying or
     at rest. At rest the box is sized so the visible artwork is exactly
     32px tall (h-8-equivalent), so nothing inside ever re-lays-out when the
     flight ends: only the outer box's sizing source flips (measured px →
     these same CSS px). */
  const padX = parts?.fist.padX ?? 0;
  const padY = parts?.fist.padY ?? 0;
  const restBoxH = 48 / (1 - 2 * padY);
  const restBoxW = restBoxH * (parts?.fist.aspect ?? COMPACT_LOGO_ASPECT);
  /* Starts pinned orange when mounting straight into an active intro (the
     common case — `active` is seeded synchronously from the route) — the
     progress-change listener below only fires on an actual change, so the
     initial value must already be correct or the fist would flash cream for
     the first frame. */
  const hover = useMotionValue(active ? 1 : 0);
  const driveRef = useRef<AnimationPlaybackControls | null>(null);

  /* hover 0 → cream (orange clipped away); hover 1 → full orange fist.
     Leaving (1 → 0) replays the intro's orange-to-cream reveal exactly. */
  const clip = useTransform(
    hover,
    [0, 0.4, 1],
    [
      `ellipse(0% 0% at ${anchor})`,
      `ellipse(17% 26% at ${anchor})`,
      /* Deliberately overscan far beyond the artwork box. At 130% some
         browsers can still clip the far thumb/outer stroke after a high-DPI
         scale rasterisation round-off. */
      `ellipse(220% 220% at ${anchor})`,
    ],
    { ease: [wipeEase, wipeEase] },
  );

  /* Intro entrance wipe — driven exactly like the hover `clip` above: a
     linearly-animated MotionValue mapped through the SAME [0, 0.4, 1] →
     ellipse hesitate transform with per-segment `wipeEase`, so the entrance
     reads as the identical gesture (same thumb-egg hesitate) as hover, just
     played once on mount rather than on pointer. At rest (not active) it sits
     at 1 → fully revealed, so it never clips the resting logo. */
  const entrance = useMotionValue(active ? 0 : 1);
  const entranceClip = useTransform(
    entrance,
    [0, 0.4, 1],
    [
      `ellipse(0% 0% at ${anchor})`,
      `ellipse(17% 26% at ${anchor})`,
      `ellipse(220% 220% at ${anchor})`,
    ],
    { ease: [wipeEase, wipeEase] },
  );

  useEffect(() => {
    if (!active) return;
    entrance.set(0);
    const controls = animate(entrance, 1, {
      duration: reduce ? 0.2 : 2.5,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [active, reduce, entrance]);

  const drive = (target: number) => {
    driveRef.current?.stop();
    if (reduce) {
      hover.set(target);
      return;
    }
    /* Duration scales with the distance left to travel, so a mid-wipe reversal
       runs at the same pace it entered rather than snapping. */
    const distance = Math.abs(target - hover.get());
    driveRef.current = animate(hover, target, {
      duration: Math.max(0.2, 1.1 * distance),
      ease: 'linear',
    });
  };

  /* While the intro is active, `progress` (not hover) drives the wipe: pinned
     fully orange through the flight (< 0.82), then sweeping to cream across
     the same 0.82-0.98 window the reveal always used. `hover`'s own rest
     value (0, fully cream) is numerically identical to where this sweep
     lands, so control passes to hover with nothing to correct. */
  useMotionValueEvent(progress, 'change', (v) => {
    if (!active) return;
    const introHover = v < 0.82 ? 1 : Math.max(0, Math.min(1, (0.98 - v) / 0.16));
    hover.set(introHover);
  });

  useEffect(() => {
    /* A stray hover right before the intro claims the screen shouldn't leave
       a tween racing the progress-driven writes above — and the wipe value
       itself is re-pinned to match the current progress, not just trusted
       from the mount-time initial (the change-listener above only fires on
       actual changes, so a wrong standing value would otherwise persist). */
    if (active) {
      driveRef.current?.stop();
      const v = progress.get();
      hover.set(v < 0.82 ? 1 : Math.max(0, Math.min(1, (0.98 - v) / 0.16)));
    }
  }, [active, hover, progress]);

  const from = flights?.fistBox.from;
  const to = flights?.fistBox.to;
  const left = useTransform(progress, [0.02, 0.82], [from?.left ?? 0, to?.left ?? 0], { ease: easeOut });
  const top = useTransform(progress, [0.02, 0.82], [from?.top ?? 0, to?.top ?? 0], { ease: easeOut });
  const width = useTransform(progress, [0.02, 0.82], [from?.width ?? 0, to?.width ?? 0], { ease: easeOut });
  const height = useTransform(progress, [0.02, 0.82], [from?.height ?? 0, to?.height ?? 0], { ease: easeOut });

  /* The cream layer uses the same geometry as the orange layer (parts.fist.markup).
     During the flight, the cream layer is hidden (opacity 0) so only the orange
     layer and its wipe are visible. Once landed at 32px, the cream fades in
     (opacity 0→1 across the 0.8-0.82 progress window) while still fully covered
     by the orange, then the wipe uncovers it. This prevents any visual pop. */
  const creamOpacity = useTransform(progress, [0.8, 0.82], [0, 1]);

  const flying = active && !!flights;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const creamRef = useRef<HTMLSpanElement>(null);
  const orangeRef = useRef<HTMLSpanElement>(null);
  const [restBox, setRestBox] = useState<Rect | null>(null);

  /* Keep one positioning model throughout the animation. Switching from a
     fixed flight box to an absolute centered box at retirement makes the
     browser resolve a second, slightly different sub-pixel position. */
  useLayoutEffect(() => {
    if (!parts) return;
    const row = document.querySelector('[data-intro-anchor="logo-row"]');
    if (!row) return;
    const measure = () => setRestBox(restFistRectFrom(row, parts));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [parts]);

  /* Inject the fist markup ONCE per asset load, imperatively. React's own
     dangerouslySetInnerHTML re-applies innerHTML on state-flip re-renders
     even with an identical string, destroying and recreating both <svg>
     trees exactly at intro retirement — the visible re-rasterization blip.
     Writing innerHTML ourselves (guarded by comparison) means the SVG DOM
     nodes are created once and never replaced for the life of the page. */
  useLayoutEffect(() => {
    const html = parts?.fist.markup ?? '';
    for (const el of [creamRef.current, orangeRef.current]) {
      if (el && el.innerHTML !== html) el.innerHTML = html;
    }
  }, [parts]);

  useLayoutEffect(() => {
    /* Framer Motion writes MotionValue-backed style props (left/top/width/
       height) straight to the DOM node, bypassing React's own style-object
       diffing — so a value going to `undefined` in the `style` object isn't
       reliably treated as "clear this property"; it can just be skipped,
       leaving the last flight-frame's pixel value stuck as an inline style
       that then outranks the resting className's own positioning. Clearing
       it explicitly the moment the flight ends is the only guarantee.
       `useLayoutEffect`, not `useEffect`, so the clear happens before the
       browser paints the frame where `flying` just went false — otherwise
       that one frame paints with the stale value still in place. */
    if (!flying && !restBox) {
      const el = linkRef.current;
      if (!el) return;
      const clear = () => {
        el.style.removeProperty('left');
        el.style.removeProperty('top');
        el.style.removeProperty('width');
        el.style.removeProperty('height');
      };
      clear();
      /* The retire commit races Framer's own frameloop: the progress tween
         is still finishing (0.995 → 1) when `active` flips, and a queued
         MotionValue style write can land AFTER this cleanup within the same
         or next frame, re-sticking a stale left/top. Clearing again across
         the next few frames closes that window deterministically. */
      let n = 0;
      let id = requestAnimationFrame(function tick() {
        clear();
        if (++n < 4) id = requestAnimationFrame(tick);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [flying, restBox]);

  return (
    <MotionLink
      ref={linkRef}
      href="/"
      onMouseEnter={() => !active && drive(1)}
      onMouseLeave={() => !active && drive(0)}
      className={cn(
        'group shrink-0',
        restBox
          ? 'fixed z-40'
          : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        active && 'pointer-events-none',
      )}
      /* Keys stay stable across the flying/resting toggle (only the values
         switch to `undefined`) — swapping the whole style object between
         `{...}` and `undefined` left Framer Motion's directly-written inline
         left/top/width/height stuck on the element after `position` flipped
         back to `absolute`, since those values bypass React's own style
         diffing. Undefined per-key is what actually clears them. */
      style={{
        left: flying ? left : restBox?.left,
        top: flying ? top : restBox?.top,
        width: flying ? width : restBox?.width,
        height: flying ? height : restBox?.height,
      }}
    >
      {/* Flight target — measured at its natural rect while not flying,
          exactly where the intro's flight math aims. The box carries the
          guard-pad inset in BOTH states, so the subtree below never changes
          shape relative to it when the flight ends. */}
      <span
        data-intro-target="brand-icon"
        className={cn('relative block', flying && 'h-full w-full')}
        style={
          flying
            ? undefined
            : restBox
              ? { height: '100%', width: '100%' }
              : { height: `${restBoxH}px`, width: `${restBoxW}px` }
        }
      >
        {/* Entrance reveal — plays once, only when the intro is the reason this
            element exists in its large flight state; skipped at rest. Driven
            by the `entrance` MotionValue through the SAME ellipse hesitate
            transform the hover wipe uses, so it reads as the identical
            gesture — no scale, no opacity pop. */}
        <motion.span
          style={{ clipPath: active ? entranceClip : undefined }}
          className="relative block h-full w-full"
        >
          {/* THE one persistent subtree — same DOM nodes in splash, flight,
              landing, rest, hover. The artwork sits inset by the part's own
              guard-pad percentages; both layers render the same geometry
              (parts.fist.markup), colored purely by CSS. Cream is hidden
              until landing during the intro (creamOpacity), and simply 1
              at rest. Orange is wiped by the ellipse clip in every state.
              The SVG markup is injected imperatively (see the effect above)
              instead of dangerouslySetInnerHTML — React re-applies innerHTML
              on state-flip renders even when the string is unchanged, which
              recreated (and visibly re-rasterized) both vectors exactly at
              retirement. Imperative injection writes the DOM once per asset
              load and React never touches those children again. */}
          <span
            className="absolute"
            style={{
              left: `${(padX * 100).toFixed(4)}%`,
              top: `${(padY * 100).toFixed(4)}%`,
              width: `${((1 - 2 * padX) * 100).toFixed(4)}%`,
              height: `${((1 - 2 * padY) * 100).toFixed(4)}%`,
            }}
          >
            <motion.span
              ref={creamRef}
              aria-hidden="true"
              className="brand-fist-layer brand-fist-layer--cream absolute inset-0"
              style={{ opacity: active ? creamOpacity : 1 }}
            />
            <motion.span
              ref={orangeRef}
              aria-hidden="true"
              style={{ clipPath: clip }}
              className="brand-fist-layer brand-fist-layer--orange pointer-events-none absolute inset-0"
            />
          </span>
        </motion.span>
      </span>
    </MotionLink>
  );
}
