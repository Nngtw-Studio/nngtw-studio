/** @format */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  animate,
  cubicBezier,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Same curve as EASE_OUT, applied per element inside the exit timeline */
export const easeSlice = { ease: cubicBezier(...EASE_OUT) };
/** The compact header logo's viewBox aspect (147.08 × 120). Used for
    computing the rest-state width of the header logo (h-8 tall, so width is
    a constant derived from this ratio). The flight start/end boxes are
    computed from the primary fist part's geometry, then inflated by the
    guard pad so the artwork inside lands artwork-to-artwork at rest. */
export const COMPACT_LOGO_ASPECT = 147.08 / 120;
const SVG_NS = 'http://www.w3.org/2000/svg';

export interface LogoPart {
  /** Standalone <svg> markup for one group of the primary logo */
  markup: string;
  /** ViewBox width / height for this extracted part */
  aspect: number;
  /** Position/size as percentages of the full logo canvas */
  left: number;
  top: number;
  width: number;
  height: number;
  /** The anti-clip guard pad as fractions of this part's own box — the drawn
      artwork is inset by this much inside the part's element. */
  padX: number;
  padY: number;
}

export interface LogoParts {
  aspect: number; // full-logo height / width
  fist: LogoPart;
  studio: LogoPart;
  nngtw: LogoPart;
  tagline: LogoPart;
  /** Center of the pink stripe as % of the fist part's box — unused now that
      the wipe lives in HeaderLogo with its own hardcoded anchor, kept so
      loadLogoParts stays byte-for-byte the function it always was. */
  pinkAnchor: { x: number; y: number };
}

export interface Flight {
  x: number;
  y: number;
  scale: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Derive the fist's splash-idle screen rect WITHOUT ever reading the lockup
    element itself — the lockup (`[data-intro-lockup]`) is what the flight's
    x/y/scale animate, so its own getBoundingClientRect() is self-referential
    the instant the flight has started (reads the current mid-flight position
    back as "idle", not the true idle rect). Instead this reads the lockup's
    PARENT (`[data-intro-lockup-container]`, `.flex.items-center.justify-center`,
    never transformed) and reconstructs the lockup's box with the exact same
    formula its own className uses (`w-[min(78vw,440px)]`, centered by flex).
    Because it never touches a transformed node, this is safe to call at any
    point — including mid-flight, e.g. on a resize/zoom event — not just once
    at mount, so the flight can be kept in sync with a live-reflowing page. */
export function splashFistRectFrom(lockupContainer: Element, parts: LogoParts): Rect {
  const cr = lockupContainer.getBoundingClientRect();
  const lockupWidth = Math.min(window.innerWidth * 0.78, 440);
  const lockupHeight = lockupWidth * parts.aspect; // parts.aspect = height / width
  const lockupLeft = cr.left + (cr.width - lockupWidth) / 2;
  const lockupTop = cr.top + (cr.height - lockupHeight) / 2;
  return {
    left: lockupLeft + (parts.fist.left / 100) * lockupWidth,
    top: lockupTop + (parts.fist.top / 100) * lockupHeight,
    width: (parts.fist.width / 100) * lockupWidth,
    height: (parts.fist.height / 100) * lockupHeight,
  };
}

/** Derive the header logo's rest-state rect WITHOUT reading the logo element
    itself — during the flight the logo is `position:fixed` with its own
    left/top/width/height under active animation, so its own rect is
    self-referential the same way the lockup's is. Instead this reads the
    header's logo ROW (`[data-intro-anchor="logo-row"]`, the `relative` flex
    container the logo is centered inside — never transformed by the flight)
    and reconstructs the logo's rest box the same way HeaderLogo itself sizes
    it (h-8-equivalent, guard-pad inflated, centered in the row). Safe to call
    at any time for the same reason as `splashFistRectFrom` above. */
export function restFistRectFrom(logoRow: Element, parts: LogoParts): Rect {
  const r = logoRow.getBoundingClientRect();
  const restBoxH = 32 / (1 - 2 * parts.fist.padY);
  const restBoxW = restBoxH * parts.fist.aspect;
  const centerX = r.left + r.width / 2;
  const centerY = r.top + r.height / 2;
  return {
    left: centerX - restBoxW / 2,
    top: centerY - restBoxH / 2,
    width: restBoxW,
    height: restBoxH,
  };
}

/**
 * Fetches the primary tagline logo from storage and splits its four top-level
 * groups (fist icon / STUDIO / Nngtw / tagline) into standalone SVGs, each
 * carrying the original <defs> styles, plus their bounding boxes relative to
 * the full canvas so the composite renders pixel-identical to the source file.
 */
async function loadLogoParts(url: string): Promise<LogoParts | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();

  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const src = doc.documentElement;
  if (src.nodeName !== 'svg') return null;

  const defs = src.querySelector('defs');
  const outer = src.querySelector(':scope > g > g');
  const groups = outer ? Array.from(outer.children) : [];
  if (groups.length !== 4) return null;

  /* Mount a hidden clone so getBBox() works (it needs a rendered tree) */
  const probe = document.createElementNS(SVG_NS, 'svg');
  probe.setAttribute('viewBox', src.getAttribute('viewBox') ?? '0 0 414.49 334.78');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  const probeGroups = groups.map((g) => {
    const clone = g.cloneNode(true) as SVGGElement;
    probe.appendChild(clone);
    return clone;
  });
  document.body.appendChild(probe);

  const [, , vbW, vbH] = (src.getAttribute('viewBox') ?? '0 0 414.49 334.78')
    .split(/\s+/)
    .map(Number);

  const part = (i: number): LogoPart => {
    const box = probeGroups[i].getBBox();
    const pad = 1; // guard against stroke/antialias clipping
    const x = box.x - pad;
    const y = box.y - pad;
    const w = box.width + pad * 2;
    const h = box.height + pad * 2;
    return {
      markup: `<svg xmlns="${SVG_NS}" viewBox="${x} ${y} ${w} ${h}" width="100%" height="100%">${
        defs?.outerHTML ?? ''
      }${(groups[i] as Element).outerHTML}</svg>`,
      aspect: w / h,
      left: (x / vbW) * 100,
      top: (y / vbH) * 100,
      width: (w / vbW) * 100,
      height: (h / vbH) * 100,
      padX: pad / w,
      padY: pad / h,
    };
  };

  const fist = part(0);

  /* Locate the pink brow line inside the rendered fist group by its computed
     fill (magenta: strong red + blue, weak green). The artwork has TWO pink
     shapes — the brow line and the tiny knuckle dot — so take the largest
     match, not a union, or the anchor lands between them. Its center, as
     percentages of the fist part's viewBox, is the reveal circle's anchor. */
  const fistBox = probeGroups[0].getBBox();
  const pad = 1;
  let pinkAnchor = { x: 64, y: 22 }; // fallback if the stripe isn't found
  let stripe: DOMRect | null = null;
  for (const el of Array.from(
    probeGroups[0].querySelectorAll<SVGGraphicsElement>('path, polygon, rect, ellipse, circle'),
  )) {
    const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(getComputedStyle(el).fill);
    if (!m) continue;
    const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (!(r > 170 && g < 110 && b > 80 && b > g)) continue;
    const box = el.getBBox();
    if (!stripe || box.width * box.height > stripe.width * stripe.height) stripe = box;
  }
  if (stripe) {
    pinkAnchor = {
      x: ((stripe.x + stripe.width / 2 - (fistBox.x - pad)) / (fistBox.width + pad * 2)) * 100,
      y: ((stripe.y + stripe.height / 2 - (fistBox.y - pad)) / (fistBox.height + pad * 2)) * 100,
    };
  }

  /* Source order: 0 fist, 1 STUDIO, 2 Nngtw, 3 tagline */
  const parts: LogoParts = {
    aspect: vbH / vbW,
    fist,
    studio: part(1),
    nngtw: part(2),
    tagline: part(3),
    pinkAnchor,
  };
  probe.remove();
  return parts;
}

/** Center-to-center translation + size ratio from one rect to another. */
function flightBetween(from: Rect, to: Rect): Flight {
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale: to.height / from.height,
  };
}

interface Flights {
  fist: Flight;
  /** Raw viewport-pixel rects for the header logo's own width/height/left/top
      interpolation (position:fixed) — kept separate from `fist` (the
      translate+scale form the wordmark's group transform still uses)
      because the logo needs literal dimensions, not a transform, to stay
      crisp across the ride (see HeaderLogo.tsx). */
  fistBox: { from: Rect; to: Rect };
  nav: Record<string, Flight | null>;
}

interface IntroContextValue {
  active: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
  parts: LogoParts | null;
  flights: Flights | null;
  navSlotRefs: RefObject<Record<string, HTMLSpanElement | null>>;
  /** 0 → 1, starts once the entrance choreography has settled and the ride
      is still idle (untouched by scroll) — the overlay's own particle layer
      fades in against this, independent of `progress`. */
  idleReveal: MotionValue<number>;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function useIntro(): IntroContextValue {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error('useIntro must be used within IntroProvider');
  return ctx;
}

/**
 * Owns the intro's single master clock and everything needed to compute where
 * the header logo and nav icons should appear mid-ride. The header/nav/logo
 * elements are real, permanently-mounted DOM — this provider never renders
 * a visual duplicate of them; it only measures two sets of invisible,
 * position-only anchors (the `fistSlotRef`/`navSlotRefs` the overlay attaches
 * to empty divs) against the real elements' own natural rects, exposing the
 * resulting flight math for `Header`/`HeaderLogo` to apply to themselves.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [parts, setParts] = useState<LogoParts | null>(null);
  /* Seed from the current route so the black backdrop paints on the very
     first render on the home page — otherwise the hero flashes for one frame
     before the overlay mounts and covers it. */
  const [active, setActive] = useState<boolean>(() => pathname === '/');
  const [flights, setFlights] = useState<Flights | null>(null);

  const navSlotRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const doneRef = useRef(false);
  const glowHandoffRef = useRef(false);
  /* The nav flight (unlike the fist) IS still self-referential to re-measure
     mid-flight — each nav Link's own rect reflects its own live translate.
     So its flight vectors are locked in on the FIRST successful measurement
     and reused verbatim on every later resize/zoom recompute; only the
     fist's from/to (both container-anchored, always safe) actually refresh. */
  const navRef = useRef<Record<string, Flight | null> | null>(null);

  /* The single source of truth: 0 = intro at rest, 1 = handed off to the
     header. Any input plays it to 1 as one deterministic 2s tween — no
     scrubbing, no spring, so the ride is identical and glitch-free every
     time. */
  const progress = useMotionValue(0);
  /* Separate from `progress` on purpose — this is a one-shot, time-driven
     reveal (not scroll-scrubbed), so an early scroll can't cut it short or
     desync it: it just keeps fading in underneath the ride regardless. */
  const idleReveal = useMotionValue(0);

  useEffect(() => {
    if (!active) return;
    /* Starts once the entrance choreography has visibly settled — the
       tagline, the last scripted fade-in, finishes at 1.65s + 0.6s = 2.25s
       (see IntroSplash.tsx); a short buffer past that reads as "idle", not
       "still arriving". Reduced motion skips the multi-second fade — snap
       to visible almost immediately instead of choreographing a reveal the
       setting asked to avoid. */
    const delay = reduce ? 100 : 2400;
    const duration = reduce ? 0.2 : 3;
    const id = window.setTimeout(() => {
      animate(idleReveal, 1, { duration, ease: 'easeInOut' });
    }, delay);
    return () => window.clearTimeout(id);
  }, [active, reduce, idleReveal]);

  useEffect(() => {
    /* Plays on every full load of the home page — deliberately not gated
       behind sessionStorage; the brand moment is part of the reload.
       We only abort if navigating away; we don't re-trigger on client-side
       routing back to /. */
    if (pathname !== '/') {
      setActive(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (parts) return;
    let cancelled = false;
    loadLogoParts(BRAND_ASSETS.primaryLogoTagline)
      .then((p) => {
        if (cancelled) return;
        /* Never strand the visitor on a black screen if the asset is missing */
        if (p) setParts(p);
        else if (active) setActive(false);
      })
      .catch(() => {
        if (!cancelled && active) setActive(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active, parts]);

  /* Lock scrolling while the intro owns the screen. */
  useEffect(() => {
    if (!active) return;
    /* A refresh restores the previous scroll position — but the intro always
       hands off to the hero, so take over restoration and start at the top. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    /* `html { scrollbar-gutter: stable }` already reserves the scrollbar gutter
       permanently, so `overflow: hidden` here removes no width — do NOT also
       pad the body. Doing both double-compensates: the page (and the shared
       particle background) sits ~15px off while the intro is up and snaps
       back sideways at handoff, the glitch the gutter reservation exists to
       prevent. */
    document.body.style.overflow = 'hidden';
    document.documentElement.setAttribute('data-intro', '1');
    /* Chrome can apply the restored position asynchronously after load —
       pin the top until the intro owns the screen for real. */
    const pin = () => window.scrollTo(0, 0);
    window.addEventListener('scroll', pin);
    return () => {
      window.removeEventListener('scroll', pin);
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-intro');
      /* Whatever retired the intro (ride finished, asset failure, route
         change), tell listeners — the hero holds its entrance for this. */
      window.dispatchEvent(new Event('intro-complete'));
    };
  }, [active]);

  /* Measure flight targets once the logo is on screen, and keep the fist's
     from/to LIVE across the whole intro — resize/zoom re-measures it every
     time, since both anchors (`[data-intro-lockup-container]`,
     `[data-intro-anchor="logo-row"]`) are never transformed by the flight
     itself, so re-reading them mid-flight is always safe and always current.
     (The nav flight is a one-time measurement — see navRef above.) */
  useEffect(() => {
    if (!active || !parts) return;

    const measure = () => {
      const lockupContainer = document.querySelector('[data-intro-lockup-container]');
      const logoRow = document.querySelector('[data-intro-anchor="logo-row"]');
      if (!lockupContainer || !logoRow) return;

      if (!navRef.current) {
        const nav: Record<string, Flight | null> = {};
        for (const link of NAV_LINKS) {
          const el = navSlotRefs.current[link.href];
          const target = document
            .querySelector(`[data-intro-nav="${link.href}"]`)
            ?.querySelector('svg');
          nav[link.href] =
            el && target && target.getClientRects().length
              ? flightBetween(el.getBoundingClientRect(), target.getBoundingClientRect())
              : null;
        }
        navRef.current = nav;
      }

      const from = splashFistRectFrom(lockupContainer, parts);
      const to = restFistRectFrom(logoRow, parts);
      setFlights({
        fist: flightBetween(from, to),
        fistBox: { from, to },
        nav: navRef.current,
      });
    };

    /* Wait a frame so the entrance animation has painted before the first
       measurement, then keep re-measuring on every resize/zoom for the rest
       of the intro — safe now that neither anchor is ever transformed. */
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', measure);
    };
  }, [active, parts]);

  /* Input — scroll scrubs the timeline (both directions) up to the commit
     point; passing it, a click, or a keypress commits the ride, auto-playing
     the remainder at the full ride's 2s pace. Armed only once the flight
     targets are measured, so an eager scroll can't start a broken ride. */
  useEffect(() => {
    if (!active || !flights) return;

    let committed = false;
    const commit = () => {
      if (committed || doneRef.current) return;
      committed = true;
      if (reduce) {
        animate(progress, 1, { duration: 0.2, ease: 'linear' });
        return;
      }
      /* Linear master clock — each element eases within its own slice below,
         so the exit has the same staggered ease-out feel as the reveal. The
         clock runs at two speeds: the flight leg (→0.82) keeps the ride's
         2s pace, then the reveal leg (0.82→1) is stretched so the egg wipe
         alone (0.82→0.98, 0.16 units) plays over a full 2s. */
      const REVEAL_DUR = 2.25; // 0.18 units at 2s per 0.16 wipe units
      const p0 = progress.get();
      if (p0 >= 0.82) {
        /* Committed mid-reveal (deep scrub) — finish at the reveal pace */
        animate(progress, 1, {
          duration: REVEAL_DUR * ((1 - p0) / 0.18),
          ease: 'linear',
        });
        return;
      }
      const flightDur = 2 * (0.82 - p0);
      animate(progress, [p0, 0.82, 1], {
        duration: flightDur + REVEAL_DUR,
        times: [0, flightDur / (flightDur + REVEAL_DUR), 1],
        ease: 'linear',
      });
    };

    /* Commit once the flying icon bar has climbed past 60% of the screen
       height from the bottom — before that the scrub is reversible. */
    const barCrossed = () => {
      const el = document.querySelector('[data-intro-nav]');
      const r = el?.getBoundingClientRect();
      /* Below lg the bar is display:none (zero rect) — fall back to a fixed
         progress threshold so a touch scrub can't instantly commit. */
      if (!r || (r.width === 0 && r.height === 0)) return progress.get() >= 0.6;
      return window.innerHeight - (r.top + r.height / 2) >= window.innerHeight * 0.6;
    };

    const scrub = (delta: number) => {
      if (committed || doneRef.current) return;
      progress.set(Math.min(0.95, Math.max(0, progress.get() + delta)));
      /* Check after the frame paints — the icons' transforms only reflect the
         new progress once framer-motion has rendered it, so an immediate
         measure would always lag one tick and could miss the crossing. */
      requestAnimationFrame(() => {
        if (!committed && barCrossed()) commit();
      });
    };

    const onWheel = (e: WheelEvent) => scrub(e.deltaY / 1200);

    let lastTouchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y === undefined || lastTouchY === null) return;
      scrub((lastTouchY - y) / 600);
      lastTouchY = y;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', commit);
    window.addEventListener('click', commit);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', commit);
      window.removeEventListener('click', commit);
    };
  }, [active, flights, progress, reduce]);

  /* Cue the Main Hero the moment the logo visibly lands at its final 32px
     size — the same 0.82 landing point HeaderLogo's own left/top/width/height
     transforms and Header's NavLink translates already use as their domain's
     end. Hero's content entrance and nav-glow bloom both key off this single
     event now, so they start together, underneath the still-opaque backdrop
     — by the time the backdrop dissolves (below), the entrance is already
     partway played rather than starting cold. Retire the intro overlay only
     once the ride fully settles; fires past the commit point either way, so
     neither can run on a still-reversible scrub. */
  useMotionValueEvent(progress, 'change', (v) => {
    if (v >= 0.82 && !glowHandoffRef.current) {
      glowHandoffRef.current = true;
      window.dispatchEvent(new Event('intro-hero-ready'));
    }
    if (v > 0.995 && !doneRef.current) {
      doneRef.current = true;
      setActive(false);
    }
  });

  return (
    <IntroContext.Provider
      value={{
        active,
        progress,
        reduce: !!reduce,
        parts,
        flights,
        navSlotRefs,
        idleReveal,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}
