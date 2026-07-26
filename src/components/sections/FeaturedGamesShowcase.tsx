/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
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

/**
 * Small square identity mark beside the title — the real per-game icon art
 * when it exists, otherwise a monogram of the title's first letter (no
 * wordmark, no text lockup — just the mark, same fallback the Games page
 * uses for its storefront icon slot).
 */
function GameIcon({ game }: { game: FeaturedGame }) {
  const art = GAME_ART[game.slug];
  const src = art?.icon ?? art?.thumbnail ?? null;
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-brand-white/15 bg-brand-black/50 backdrop-blur-sm sm:h-14 sm:w-14">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="56px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-lg font-black text-brand-white/50 sm:text-xl">
            {game.title.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

/**
 * Cinematic single-slot showcase, sized to sit right beside the hero: one
 * full-bleed backdrop crossfading between titles and a hover-to-play trailer
 * on the active slide. Slide position lives in a thin segmented progress bar
 * under the card — scales to any title count without stacking UI on top of
 * the art. No roadmap here — that level of detail belongs on the game's own
 * page (see GameHero). Distinct from the Games page's full alternating
 * showcase (GameShowcaseCard) — the two never share a section.
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
                <p className="max-w-xs text-sm leading-7 text-brand-grey lg:text-right">
                  Original titles in active development.
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
              {/* Active slide info */}
              <div className="max-w-xl" aria-live="polite">
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

                    <div className="mt-5 flex items-center gap-4">
                      <GameIcon game={game} />
                      <h3 className="editorial-heading text-4xl text-brand-white md:text-5xl">
                        {game.title}
                      </h3>
                    </div>
                    <p className="mt-4 max-w-md text-sm leading-7 text-brand-white/75 md:text-base">
                      {game.description}
                    </p>
                    <p className="mt-4 font-accent text-[10px] tracking-[0.24em] text-brand-white/55 uppercase">
                      {game.genre}
                      <span className="text-brand-white/25"> · </span>
                      {game.platforms.join(' · ')}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <Button href={game.projectLink ?? `/games/${game.slug}`} variant="primary" size="md">
                        View Project
                      </Button>
                      {game.followLink && (
                        <a
                          href={game.followLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target group inline-flex items-center gap-2 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-white"
                        >
                          Follow Dev
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                            →
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>

          {/* Slide progress — one segment per title, filling left to right on
              the auto-advance timer. Replaces a title list so the section
              never gets crowded no matter how many games are featured. */}
          {count > 1 && (
            <div
              role="tablist"
              aria-label="Featured games"
              className="mt-5 flex items-center gap-2"
            >
              {games.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  onClick={() => select(i)}
                  aria-selected={i === active}
                  aria-label={`Show ${g.title}`}
                  className="cursor-target group relative h-1 flex-1 overflow-hidden rounded-full bg-brand-white/10"
                >
                  {i === active ? (
                    <motion.div
                      key={cycle}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                      className={cn('h-full w-full origin-left', accentFor(g, i).bar)}
                    />
                  ) : i < active ? (
                    <div className={cn('h-full w-full opacity-50', accentFor(g, i).bar)} />
                  ) : (
                    <div className="h-full w-full bg-brand-white/0 transition-colors duration-300 group-hover:bg-brand-white/35" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
