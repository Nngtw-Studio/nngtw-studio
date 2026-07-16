/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';
import { NAV_ICONS } from '@/components/layout/NavIcons';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Same curve as EASE_OUT, applied per element inside the exit timeline */
const easeSlice = { ease: cubicBezier(...EASE_OUT) };
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Compact-logo cream — what the fist recolors to as it settles into the header. */
const CREAM = '#f3efe6';

interface LogoPart {
  /** Standalone <svg> markup for one group of the primary logo */
  markup: string;
  /** Position/size as percentages of the full logo canvas */
  left: number;
  top: number;
  width: number;
  height: number;
}

interface LogoParts {
  aspect: number; // full-logo height / width
  fist: LogoPart;
  studio: LogoPart;
  nngtw: LogoPart;
  tagline: LogoPart;
}

interface Flight {
  x: number;
  y: number;
  scale: number;
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
      left: (x / vbW) * 100,
      top: (y / vbH) * 100,
      width: (w / vbW) * 100,
      height: (h / vbH) * 100,
    };
  };

  /* Source order: 0 fist, 1 STUDIO, 2 Nngtw, 3 tagline */
  const parts: LogoParts = {
    aspect: vbH / vbW,
    fist: part(0),
    studio: part(1),
    nngtw: part(2),
    tagline: part(3),
  };
  probe.remove();
  return parts;
}

/** Center-to-center translation + size ratio from one rect to another. */
function flightBetween(from: DOMRect, to: DOMRect): Flight {
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale: to.height / from.height,
  };
}

/**
 * Scroll-scrubbed brand intro on every load of the home page: the exact
 * primary-logo-with-tagline artwork from storage with the six nav icons
 * resting at the bottom. Scrolling scrubs the timeline up to the halfway
 * point; past 60% (or on click/keypress) the remainder auto-plays at the full
 * ride's 2s pace — tagline, STUDIO, then Nngtw dissolve in sequence while the
 * whole lockup (fist still orange) shrinks toward the header slot and
 * the nav icons split to their real header positions; near the end the fist
 * recolors to cream and the backdrop scrolls away to reveal the hero. The
 * real header elements stay hidden until the flyers land exactly on them.
 */
export function IntroSplash() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [parts, setParts] = useState<LogoParts | null>(null);
  /* Seed from the current route so the black backdrop paints on the very first
     render on the home page — otherwise the hero flashes for one frame before
     the splash mounts and covers it. */
  const [shouldShow, setShouldShow] = useState<boolean | null>(() => pathname === '/');
  const [flights, setFlights] = useState<{
    fist: Flight;
    nav: Record<string, Flight | null>;
  } | null>(null);

  const fistRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const doneRef = useRef(false);

  /* The single source of truth: 0 = splash at rest, 1 = handed off to header.
     Any input plays it to 1 as one deterministic 2s tween — no scrubbing, no
     spring, so the ride is identical and glitch-free every time. */
  const progress = useMotionValue(0);

  useEffect(() => {
    /* Plays on every full load of the home page — deliberately not gated
       behind sessionStorage; the brand moment is part of the reload. */
    setShouldShow(pathname === '/');
  }, [pathname]);

  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;
    loadLogoParts(BRAND_ASSETS.primaryLogoTagline)
      .then((p) => {
        if (cancelled) return;
        /* Never strand the visitor on a black screen if the asset is missing */
        if (p) setParts(p);
        else setShouldShow(false);
      })
      .catch(() => {
        if (!cancelled) setShouldShow(false);
      });
    return () => {
      cancelled = true;
    };
  }, [shouldShow]);

  /* Lock scrolling and hide the header's own logo/icons while the splash owns
     the screen — the flyers land exactly on them, then this attribute drops. */
  useEffect(() => {
    if (!shouldShow) return;
    /* A refresh restores the previous scroll position — but the intro always
       hands off to the hero, so take over restoration and start at the top. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.setAttribute('data-intro', '1');
    /* Chrome can apply the restored position asynchronously after load —
       pin the top until the splash owns the screen for real. */
    const pin = () => window.scrollTo(0, 0);
    window.addEventListener('scroll', pin);
    return () => {
      window.removeEventListener('scroll', pin);
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      document.body.style.overflow = '';
      document.documentElement.removeAttribute('data-intro');
      /* Whatever retired the splash (ride finished, asset failure, route
         change), tell listeners — the hero holds its entrance for this. */
      window.dispatchEvent(new Event('intro-complete'));
    };
  }, [shouldShow]);

  /* Measure flight targets once the logo is on screen. Re-measured on resize
     so the fist always lands exactly on the header slot. */
  useEffect(() => {
    if (!shouldShow || !parts) return;

    const measure = () => {
      const fistEl = fistRef.current;
      const logoTarget = document.querySelector('[data-intro-target="brand-icon"]');
      if (!fistEl || !logoTarget) return;

      const nav: Record<string, Flight | null> = {};
      for (const link of NAV_LINKS) {
        const el = navRefs.current[link.href];
        const target = document
          .querySelector(`[data-intro-nav="${link.href}"]`)
          ?.querySelector('svg');
        nav[link.href] =
          el && target && target.getClientRects().length
            ? flightBetween(el.getBoundingClientRect(), target.getBoundingClientRect())
            : null;
      }
      setFlights({
        fist: flightBetween(fistEl.getBoundingClientRect(), logoTarget.getBoundingClientRect()),
        nav,
      });
    };

    /* Wait a frame so the entrance animation has painted before measuring */
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', measure);
    };
  }, [shouldShow, parts]);

  /* Input — scroll scrubs the timeline (both directions) up to the commit
     point; passing it, a click, or a keypress commits the ride, auto-playing
     the remainder at the full ride's 2s pace. Armed only once the flight
     targets are measured, so an eager scroll can't start a broken ride. */
  useEffect(() => {
    if (!shouldShow || !flights) return;

    let committed = false;
    const commit = () => {
      if (committed || doneRef.current) return;
      committed = true;
      /* Linear master clock — each element eases within its own slice below,
         so the exit has the same staggered ease-out feel as the reveal. */
      animate(progress, 1, {
        duration: reduce ? 0.2 : 2 * (1 - progress.get()),
        ease: 'linear',
      });
    };

    /* Commit once the flying icon bar has climbed past 60% of the screen
       height from the bottom — before that the scrub is reversible. */
    const barCrossed = () => {
      const el = Object.values(navRefs.current).find(Boolean);
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
  }, [shouldShow, flights, progress, reduce]);

  /* Retire the splash when the ride settles */
  useMotionValueEvent(progress, 'change', (v) => {
    if (v > 0.995 && !doneRef.current) {
      doneRef.current = true;
      setShouldShow(false);
    }
  });

  /* Stage mappings — each element rides its own slice of the timeline */
  /* Pure fades — the words stay locked to the shrinking lockup (no drift of
     their own), so the whole logo reads as one group scaling down. */
  const taglineOpacity = useTransform(progress, [0.02, 0.18], [1, 0], easeSlice);
  const studioOpacity = useTransform(progress, [0.16, 0.34], [1, 0], easeSlice);
  const nngtwOpacity = useTransform(progress, [0.32, 0.52], [1, 0], easeSlice);

  /* The lockup starts shrinking on the very first scroll tick */
  const fistX = useTransform(progress, [0.02, 0.96], [0, flights?.fist.x ?? 0], easeSlice);
  const fistY = useTransform(progress, [0.02, 0.96], [0, flights?.fist.y ?? 0], easeSlice);
  const fistScale = useTransform(progress, [0.02, 0.96], [1, flights?.fist.scale ?? 0.2], easeSlice);

  /* Icons answer the very first scroll tick, splitting toward the header */
  const iconProgress = useTransform(progress, [0.02, 0.96], [0, 1], easeSlice);
  /* Colour handoff — the orange fist rides on top of an identical cream one
     and simply fades away mid-flight, so the recolor is one smooth
     progress-driven dissolve instead of a triggered CSS transition. */
  const fistOrangeOpacity = useTransform(progress, [0.55, 0.9], [1, 0], easeSlice);
  /* The backdrop stays opaque for the whole ride, then dissolves at the very
     end. Both it and the hero paint the same brand black, so the crossfade is
     imperceptible — no sliding seam, and the hero's own entrance only starts
     once the splash announces it's done. */
  const backdropOpacity = useTransform(progress, [0.85, 1], [1, 0], easeSlice);


  if (!shouldShow) return null;

  const abs = (p: LogoPart): React.CSSProperties => ({
    position: 'absolute',
    left: `${p.left}%`,
    top: `${p.top}%`,
    width: `${p.width}%`,
    height: `${p.height}%`,
  });

  return (
    <div className="fixed inset-0 z-100">
      {/* Header logo/icons stay invisible until the flyers land on them */}
      <style>{`
        html[data-intro="1"] [data-intro-target="brand-icon"],
        html[data-intro="1"] [data-intro-nav] svg { opacity: 0 !important; }
        /* Header auto-hide must not move the flight targets while measuring */
        html[data-intro="1"] header { transform: none !important; }
        .intro-fist-cream svg > g > g:first-child path { fill: ${CREAM}; }
        .intro-fist-cream svg > g > g:last-child path { opacity: 0; }
      `}</style>

      {/* Backdrop — dissolves into the identically-black hero at the end */}
      <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 bg-brand-black" />

      {/* Very subtle primary wash — a screen-filling warm glow breathing in
          across the reveal: it starts the moment the logo appears and reaches
          full strength once the nav icons have settled. It then stays put —
          the hero paints the identical wash beneath, so the backdrop
          crossfade at the end changes nothing about the background. */}
      {parts && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: reduce ? 0.2 : 3, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-[-20%]"
          style={{
            background: `
              radial-gradient(ellipse 70% 62% at 44% 40%,
                rgba(245,138,31,0.9) 0%,
                rgba(245,138,31,0.45) 38%,
                rgba(245,138,31,0.15) 62%,
                transparent 82%
              )
            `,
          }}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-12 md:py-16">
        <div className="flex flex-1 items-center justify-center">
          {parts && (
            <motion.div
              className="relative w-[min(78vw,440px)]"
              style={{
                aspectRatio: `1 / ${parts.aspect}`,
                x: fistX,
                y: fistY,
                scale: fistScale,
                /* Anchor the flight at the fist's center so the whole lockup
                   shrinks together while the fist lands exactly on the header
                   slot — the words dissolve off it mid-flight. */
                transformOrigin: `${parts.fist.left + parts.fist.width / 2}% ${
                  parts.fist.top + parts.fist.height / 2
                }%`,
              }}
            >
              {/* Fist — grows in from small on reveal. The static wrapper
                  carries the ref so the flight measurement isn't skewed by
                  the entrance scale. */}
              <div ref={fistRef} style={abs(parts.fist)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE_OUT }}
                  className="relative h-full w-full"
                >
                  {/* Cream twin underneath… */}
                  <div
                    className="intro-fist-cream absolute inset-0"
                    dangerouslySetInnerHTML={{ __html: parts.fist.markup }}
                  />
                  {/* …and the orange original on top, dissolving mid-flight */}
                  <motion.div
                    style={{ opacity: fistOrangeOpacity }}
                    className="absolute inset-0"
                    dangerouslySetInnerHTML={{ __html: parts.fist.markup }}
                  />
                </motion.div>
              </div>
              {/* Wordmark pieces fade in one after the other once the fist has grown */}
              <motion.div
                style={abs(parts.nngtw)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.85, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
              >
                <motion.div
                  style={{ opacity: nngtwOpacity }}
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: parts.nngtw.markup }}
                />
              </motion.div>
              <motion.div
                style={abs(parts.studio)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 1.25, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
              >
                <motion.div
                  style={{ opacity: studioOpacity }}
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: parts.studio.markup }}
                />
              </motion.div>
              <motion.div
                style={abs(parts.tagline)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 1.65, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
              >
                <motion.div
                  style={{ opacity: taglineOpacity }}
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: parts.tagline.markup }}
                />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Nav icons arrive last, after the slogan has settled */}
        {/* Pure fade — a slide here would offset the flight-target measurement
            and make the icons land a few pixels off their header slots */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 2.1, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
          className="hidden items-center gap-12 pb-2 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href];
            return (
              <NavFlyer
                key={link.href}
                link={link}
                Icon={Icon}
                progress={iconProgress}
                flight={flights?.nav[link.href] ?? null}
                measureRef={(el) => {
                  navRefs.current[link.href] = el;
                }}
              />
            );
          })}
        </motion.nav>
      </div>
    </div>
  );
}

/**
 * One nav item riding the shared timeline toward its header slot. Renders the
 * real header link — same pill hover, icon twist and expanding label — so the
 * resting splash icons behave exactly like the nav they hand off to. The flight
 * is measured from the inner icon (not the padded pill) so the fly-in scale
 * matches the 24px header icon rather than shrinking to fit the padding.
 */
function NavFlyer({
  link,
  Icon,
  progress,
  flight,
  measureRef,
}: {
  link: { href: string; label: string };
  Icon: (props: { className?: string }) => React.ReactElement;
  progress: ReturnType<typeof useMotionValue<number>>;
  flight: Flight | null;
  measureRef: (el: HTMLSpanElement | null) => void;
}) {
  const x = useTransform(progress, [0, 1], [0, flight?.x ?? 0]);
  const y = useTransform(progress, [0, 1], [0, flight?.y ?? 0]);
  const scale = useTransform(progress, [0, 1], [1, flight?.scale ?? 1]);
  /* No header slot (e.g. below lg) — fade out instead of flying */
  const opacity = useTransform(progress, [0, 0.8], [1, flight ? 1 : 0]);

  return (
    <motion.span style={{ x, y, scale, opacity }} className="flex items-center">
      <Link
        href={link.href}
        className="group flex items-center rounded-full px-3.5 py-2.5 text-brand-grey transition-colors duration-300 hover:bg-brand-white/5 hover:text-brand-white"
      >
        <span ref={measureRef} className="flex items-center">
          <Icon className="h-6 w-6 shrink-0 transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
        </span>
        <span className="max-w-0 overflow-hidden font-accent text-[10px] tracking-[0.25em] whitespace-nowrap uppercase opacity-0 transition-all duration-500 ease-out group-hover:ml-2 group-hover:max-w-25 group-hover:opacity-100">
          {link.label}
        </span>
      </Link>
    </motion.span>
  );
}
