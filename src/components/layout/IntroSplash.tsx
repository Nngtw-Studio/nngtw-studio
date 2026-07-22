/** @format */

'use client';

import { motion, useTransform } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { EASE_OUT, easeSlice, useIntro, type LogoPart } from '@/components/layout/IntroContext';
import { AmbientField } from '@/components/effects/AmbientField';

/**
 * Scroll-scrubbed brand intro on every load of the home page: the exact
 * primary-logo-with-tagline artwork from storage (STUDIO / Nngtw / tagline)
 * with an empty measurement row where the six nav icons rest. Scrolling
 * scrubs the timeline up to the halfway point; past 60% (or on click/keypress)
 * the remainder auto-plays at the full ride's 2s pace — tagline, STUDIO, then
 * Nngtw dissolve in sequence while the wordmark shrinks toward the header slot.
 *
 * This overlay owns only the backdrop, the wordmark, and the travelling
 * ambient glow — it renders no copy of the header logo or nav icons. Those
 * are the real, permanently-mounted header elements. The fist's splash
 * position is pure math on `[data-intro-lockup-container]`'s rect (the
 * lockup's UNTRANSFORMED parent — never moved by the flight, safe to read
 * at any time, including mid-flight on resize/zoom) + the same w-[min(78vw,
 * 440px)] formula the lockup's own className uses, so it's exact, not an
 * approximation — no measurement-only DOM. The nav row anchors are measured
 * similarly, and `Header`/`HeaderLogo` apply the resulting flight to
 * themselves. When the ride settles there is nothing to swap: the real
 * elements were already sitting exactly there.
 */
export function IntroSplash() {
  const { active, progress, reduce, parts, flights, navSlotRefs, idleReveal } =
    useIntro();

  /* Pure fades — the words stay locked to the shrinking lockup (no drift of
     their own), so the whole logo reads as one group scaling down. */
  const taglineOpacity = useTransform(progress, [0.02, 0.18], [1, 0], easeSlice);
  const studioOpacity = useTransform(progress, [0.16, 0.34], [1, 0], easeSlice);
  const nngtwOpacity = useTransform(progress, [0.32, 0.52], [1, 0], easeSlice);

  /* The lockup shrinks and flies toward the header slot, fully landed by
     0.82 — the wipe (owned by HeaderLogo now) then runs in place. */
  const fistX = useTransform(progress, [0.02, 0.82], [0, flights?.fist.x ?? 0], easeSlice);
  const fistY = useTransform(progress, [0.02, 0.82], [0, flights?.fist.y ?? 0], easeSlice);
  const fistScale = useTransform(progress, [0.02, 0.82], [1, flights?.fist.scale ?? 0.2], easeSlice);

  /* The backdrop stays opaque for the whole ride, then dissolves at the very
     end. Both it and the hero paint the same brand black, so the crossfade is
     imperceptible — no sliding seam, and the hero's own entrance only starts
     once the intro announces it's done. */
  const backdropOpacity = useTransform(progress, [0.85, 1], [1, 0], easeSlice);
  /* The ambient light tells the same story as the logo: at rest a large pink
     wash hangs just above the lockup; across the flight slice it rides up,
     tightens, and warms from brand pink to brand orange, settling as a soft
     band behind the header exactly as the fist lands there. Same 5% ceiling
     and stop structure at both ends, so only position, size and hue move. */
  const glowBackground = useTransform(
    progress,
    [0.02, 0.82],
    [
      'radial-gradient(ellipse 92% 78% at 48% 36%, rgba(223,19,138,0.05), rgba(223,19,138,0.02) 45%, transparent 82%)',
      'radial-gradient(ellipse 70% 26% at 50% 4%, rgba(245,138,31,0.05), rgba(245,138,31,0.02) 45%, transparent 82%)',
    ],
    easeSlice,
  );
  /* Only at the very end does the intro's copy of the light yield — the hero
     blooms its identical nav glow underneath (cued by `intro-hero-ready` at
     0.82) while this one fades, so the illumination never drops out. */
  const glowRideOpacity = useTransform(progress, [0.88, 1], [1, 0], easeSlice);
  /* The particle field rides the same fade-out window as the glow (crossing
     with the hero's own copy as the backdrop clears), but fades IN on its own
     independent, time-driven idle timeline rather than answering `progress`
     at all — so it's already part of the scene well before anyone scrolls. */
  const particleOpacity = useTransform(
    [idleReveal, glowRideOpacity],
    ([r, g]: number[]) => r * g * 0.4,
  );

  if (!active) return null;

  const abs = (p: LogoPart): React.CSSProperties => ({
    position: 'absolute',
    left: `${p.left}%`,
    top: `${p.top}%`,
    width: `${p.width}%`,
    height: `${p.height}%`,
  });

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop — dissolves into the identically-black hero at the end. The
          hero's particle field and its glows live on the hero side; the intro
          carries the travelling glow below, which hands the lighting to the
          hero's nav glow so it all reads as one continuous scene. */}
      <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 bg-brand-black" />

      {/* The travelling ambient light — pink above the logo at rest, riding
          the same slice as the lockup's flight up into an orange band behind
          the header. Outer layer: yields to the hero's twin glow at the very
          end. Inner layer: blooms in shortly after first paint, reaching full
          intensity as the nav icons settle — alive, never switched on. */}
      <motion.div
        style={{ opacity: glowRideOpacity }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.15, duration: reduce ? 0.2 : 2.4, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ background: glowBackground }}
        />
      </motion.div>

      {/* Ambient particles — same field the Main Hero uses, fading in during
          the intro's idle window (well before any scroll) and fading out
          here as the hero's own copy fades in behind the dissolving
          backdrop, so the texture is continuous across the handoff. */}
      <motion.div style={{ opacity: particleOpacity }} className="absolute inset-0" aria-hidden="true">
        <AmbientField />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-12 md:py-16">
        {/* Phones nudge the lockup 20px above dead-center (desktop stays
            centered). The offset is a transform, not padding, so the
            container's getBoundingClientRect still reflects it and the
            fist's flight `from` (splashFistRectFrom) stays in sync. */}
        <div
          data-intro-lockup-container
          className="flex flex-1 items-center justify-center -translate-y-5 md:translate-y-0"
        >
          {parts && (
            <motion.div
              data-intro-lockup
              className="relative w-[min(78vw,440px)]"
              style={{
                aspectRatio: `1 / ${parts.aspect}`,
                x: fistX,
                y: fistY,
                scale: fistScale,
                /* Anchor the flight at the fist's center so the whole lockup
                   shrinks together while the fist slot lands exactly on the
                   header slot — the words dissolve off it mid-flight. */
                transformOrigin: `${parts.fist.left + parts.fist.width / 2}% ${
                  parts.fist.top + parts.fist.height / 2
                }%`,
              }}
            >

              {/* Wordmark pieces fade in one after the other once the fist has grown */}
              <motion.div
                style={abs(parts.nngtw)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 1.8, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
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
                transition={{ delay: reduce ? 0 : 2.2, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
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
                transition={{ delay: reduce ? 0 : 2.6, duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }}
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

        {/* Invisible nav-icon measurement row — same footprint (gap, icon
            box, pill padding, pb-2, outer py-12/md:py-16) the real header
            nav row has, so each real header nav icon's flight starts from
            the exact same geometry it lands at. Never painted: no icon, no
            Link, no label — `Header.tsx`'s real `<Link>`s are what fly.
            Must share the header nav's `md` (768px) visibility breakpoint:
            if this row is display:none while the header icons render, their
            flight measures a zero rect and they never fly down to the row. */}
        <div
          className="pointer-events-none invisible flex items-center gap-19.5 pb-2"
        >
          {NAV_LINKS.map((link) => (
            <span key={link.href} className="flex items-center rounded-full px-1.5 py-1.5">
              <span
                ref={(el) => {
                  navSlotRefs.current[link.href] = el;
                }}
                className="h-5 w-5 shrink-0"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
