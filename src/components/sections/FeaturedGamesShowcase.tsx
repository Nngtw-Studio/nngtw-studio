/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { CtaButton } from '@/components/ui/CtaButton';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { SLIDE_DURATION_MS } from '@/lib/data/featured-games';
import { cn } from '@/lib/utils';
import type { FeaturedGame } from '@/types';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCENT = {
  orange: { badge: 'border-brand-orange/40 bg-brand-orange/12 text-brand-orange', bar: 'bg-brand-orange' },
  pink: { badge: 'border-brand-secondary/40 bg-brand-secondary/12 text-brand-secondary', bar: 'bg-brand-secondary' },
} as const;

function accentFor(game: FeaturedGame, index: number) {
  return ACCENT[GAME_ART[game.slug]?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];
}

/** One crossfading backdrop layer per title — mirrors GamesHero's HeroBackdrop. */
function Backdrop({ game, active }: { game: FeaturedGame; active: boolean }) {
  const src = GAME_ART[game.slug]?.thumbnail ?? game.bannerImageUrl ?? null;
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          priority={active}
          sizes="100vw"
          onError={() => setFailed(true)}
          className={cn('object-cover', active && 'motion-safe:animate-ken-burns')}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-brand-orange/12 via-brand-black to-brand-bg" />
      )}
    </motion.div>
  );
}

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

/**
 * Cinematic single-slot showcase, sized to sit right beside the hero: one
 * full-bleed backdrop crossfading between titles, a numbered selector list
 * that scales cleanly whether there are 2 titles or 8 (unlike a horizontal
 * tab row, which runs out of room fast), and a hover-to-play trailer on the
 * active slide. No roadmap here — that level of detail belongs on the
 * game's own page (see GameHero). Distinct from the Games page's full
 * alternating showcase (GameShowcaseCard) — the two never share a section.
 */
export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  const count = games.length;
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % count);
      setCycle((c) => c + 1);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(id);
  }, [active, cycle, count]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setCycle((c) => c + 1);
  };

  if (!count) return null;
  const game = games[active];
  const accent = accentFor(game, active);

  const handleEnter = () => {
    setHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setHovering(false);
    setVideoReady(false);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="featured-games"
        className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black"
        aria-label="Featured games"
      >
        {/* Ambient lighting rig — echoes the hero so the section reads as part of the same world */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 10% 8%, rgba(245,138,31,0.07), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 92%, rgba(223,19,138,0.08), transparent 68%)',
          }}
        />

        <div className="section-padding relative mx-auto max-w-[1600px]">
          {/* Header row — label + heading left, support copy + view-all right */}
          <FadeIn>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="accent-line" />
                  <p className="label-overline text-brand-orange">Featured</p>
                </div>
                <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl">
                  Games we&rsquo;re bringing to life.
                </h2>
              </div>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <p className="max-w-sm text-sm leading-7 text-brand-grey lg:text-right">
                  Original titles in active development, built with the same obsession for
                  craft, feel, and community.
                </p>
                <Link
                  href="/games"
                  className="cursor-target group inline-flex items-center gap-3 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-orange"
                >
                  View All Projects
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Cinematic card */}
          <FadeIn
            delay={0.1}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="relative mt-12 min-h-125 overflow-hidden rounded-3xl border border-brand-white/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] md:mt-16 lg:min-h-150"
          >
            <div className="absolute inset-0">
              {games.map((g, i) => (
                <Backdrop key={g.id} game={g} active={i === active} />
              ))}
            </div>

            {/* Hover-to-play trailer for the active slide only */}
            {game.trailerUrl && (
              <video
                key={game.slug}
                ref={videoRef}
                src={game.trailerUrl}
                muted
                loop
                playsInline
                preload="none"
                onPlaying={() => setVideoReady(true)}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                  hovering && videoReady ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                aria-hidden="true"
                tabIndex={-1}
              />
            )}

            {/* Legibility scrims */}
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-bg via-brand-bg/25 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-black/70 via-brand-black/10 to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full min-h-125 flex-col justify-end p-8 md:p-11 lg:min-h-150">
              <div className="grid items-end gap-10 lg:grid-cols-12">
                {/* Active slide info */}
                <div className="lg:col-span-8" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-accent text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm',
                            accent.badge,
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                          {gameStatusLabels[game.status] ?? 'In Development'}
                        </span>
                        <span className="rounded-full border border-brand-white/20 bg-brand-black/30 px-3.5 py-1.5 font-accent text-[10px] tracking-[0.2em] text-brand-white/70 uppercase backdrop-blur-sm">
                          {game.engine}
                        </span>
                      </div>

                      <h3 className="editorial-heading mt-5 text-4xl text-brand-white md:text-5xl">
                        {game.title}
                      </h3>
                      <p className="mt-4 max-w-md text-sm leading-7 text-brand-white/75 md:text-base">
                        {game.description}
                      </p>
                      <p className="mt-4 font-accent text-[10px] tracking-[0.24em] text-brand-white/55 uppercase">
                        {game.genre}
                        <span className="text-brand-white/25"> · </span>
                        {game.platforms.join(' · ')}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-4">
                        <CtaButton
                          href={game.projectLink ?? `/games/${game.slug}`}
                          variant="primary"
                          className="-ml-5"
                        >
                          View Project
                        </CtaButton>
                        {game.followLink && (
                          <CtaButton href={game.followLink} variant="secondary" external>
                            Follow Dev
                          </CtaButton>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Desktop selector — numbered titles with an auto-advance progress bar.
                    Each row is its own glass chip so it stays legible over any key art,
                    and the list simply grows for more titles instead of squeezing tabs. */}
                {count > 1 && (
                  <div className="hidden max-h-115 flex-col gap-2.5 overflow-y-auto lg:col-span-4 lg:flex">
                    {games.map((g, i) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => select(i)}
                        aria-current={i === active}
                        aria-label={`Show ${g.title}`}
                        className={cn(
                          'cursor-target group w-full rounded-xl border px-4 py-3.5 text-left backdrop-blur-md transition-all duration-300',
                          i === active
                            ? 'border-brand-white/20 bg-brand-black/55'
                            : 'border-transparent bg-brand-black/25 hover:bg-brand-black/40',
                        )}
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span
                            className={cn(
                              'font-accent text-[10px] tracking-[0.26em] uppercase transition-colors duration-300',
                              i === active ? 'text-brand-white/75' : 'text-brand-white/40',
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="truncate font-accent text-[10px] tracking-[0.26em] text-brand-white/40 uppercase">
                            {g.genre}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'mt-1.5 block truncate font-display text-base font-bold tracking-tight transition-colors duration-300',
                            i === active ? 'text-brand-white' : 'text-brand-white/55',
                          )}
                        >
                          {g.title}
                        </span>
                        <div className="mt-2.5 h-px w-full overflow-hidden bg-brand-white/15">
                          {i === active && (
                            <motion.div
                              key={cycle}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                              className={cn('h-full w-full origin-left', accentFor(g, i).bar)}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile slide dots */}
              {count > 1 && (
                <div className="mt-8 flex items-center gap-2 lg:hidden">
                  {games.map((g, i) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => select(i)}
                      aria-label={`Show ${g.title}`}
                      aria-current={i === active}
                      className={cn(
                        'cursor-target h-1 rounded-full transition-all duration-300',
                        i === active
                          ? 'w-10 bg-brand-orange'
                          : 'w-5 bg-brand-white/25 hover:bg-brand-white/45',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </MotionConfig>
  );
}
