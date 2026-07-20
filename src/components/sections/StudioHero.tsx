/** @format */

'use client';

import { motion, MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The brand motto elevated to page thesis — the studio *is* the tagline.
 * Per the approved Figma composition, each line carries its own tracking
 * (not a shared value), and "Evolve" + its trailing period are split so the
 * period alone gets extra tracking relative to the final "e" — and its own
 * color: brand-white body, brand-secondary (pink) accent dot.
 */
const MOTTO_LINES = [
  {
    key: 'imagine',
    node: (
      <span className="text-brand-white" style={{ letterSpacing: '0.05em' }}>
        Imagine.
      </span>
    ),
  },
  {
    key: 'explore',
    node: (
      <span className="text-brand-orange" style={{ letterSpacing: '0.02em' }}>
        Explore.
      </span>
    ),
  },
  {
    key: 'evolve',
    node: (
      <>
        <span className="text-brand-white" style={{ letterSpacing: '0em' }}>
          Evolve
        </span>
        <span className="text-brand-secondary" style={{ marginLeft: '0.04em' }}>
          .
        </span>
      </>
    ),
  },
];

interface StudioHeroProps {
  teamCount: number;
}

export function StudioHero({ teamCount }: StudioHeroProps) {
  const stats = [
    { value: '02', label: 'Titles in development' },
    { value: '03', label: 'Worlds in concept' },
    { value: String(teamCount).padStart(2, '0'), label: 'Makers behind the studio' },
    { value: '100%', label: 'Independent' },
  ];

  return (
    <MotionConfig reducedMotion="user">
      {/* data-hero: the site header treats this as the page's hero — the nav
          never snap-hides while it's on screen. Height is pinned to the
          viewport (minus the fixed h-20 header) so the hero never runs
          longer than one screen. */}
      <section
        data-hero
        className="relative flex h-screen min-h-[720px] snap-start flex-col justify-center overflow-hidden pt-20"
      >
        {/* Atmosphere — warm bloom top-left, faint brand-pink answer bottom-right,
            both breathing on a slow cycle so the opening feels alive, not static. */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-60 -left-40 h-180 w-180 rounded-full bg-brand-orange/6 blur-[160px]"
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-40 -bottom-60 h-160 w-160 rounded-full bg-brand-secondary/4 blur-[180px]"
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Motto — one line per row, rising out of clipped reveal masks.
                Each line uses a 1.4 line-height (matching Figma's measured
                179px box at the 128px/xl reference size) so the -0.375em
                pull-up below reproduces the same -48px overlap Figma shows
                at that size, scaling proportionally at smaller breakpoints.
                `pb-3 -mb-3` on the same element is a self-cancelling buffer
                (equal padding and negative margin net to zero external
                footprint) that only exists to stop the overflow-hidden mask
                from slicing descenders like the "g" in "Imagine". */}
            <h1 className="flex flex-col lg:col-span-7">
              {MOTTO_LINES.map((line, i) => (
                <span
                  key={line.key}
                  className={cn(
                    'block overflow-hidden pb-3 -mb-3 text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
                    i > 0 && 'mt-[-0.375em]',
                  )}
                >
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: EASE_OUT }}
                    style={{ lineHeight: 1.4 }}
                    className="editorial-heading block"
                  >
                    {line.node}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Lede — who this page is about, kept short and scannable */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
              className="lg:col-span-4 lg:col-start-9 lg:self-end"
            >
              <p className="max-w-70 text-lg leading-9 text-brand-white/80">
                An independent game studio.
                <br />
                Craft over scale.
              </p>
            </motion.div>
          </div>

          {/* Studio at a glance */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT }}
            className="mt-16 grid grid-cols-2 gap-y-10 border-t border-brand-white/5 pt-10 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="pr-6">
                <dd className="font-display text-3xl font-semibold tracking-tight text-brand-white/90 md:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-3 font-accent text-[10px] tracking-[0.25em] text-brand-grey/50 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>
    </MotionConfig>
  );
}
