/** @format */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  MotionConfig,
} from 'framer-motion';
import { CtaButton } from '@/components/ui/CtaButton';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { cn } from '@/lib/utils';
import type { Game } from '@/types';

const SLIDE_MS = 8000;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCENT = {
  orange: {
    badge: 'border-brand-orange/35 bg-brand-orange/12 text-brand-orange',
    bar: 'bg-brand-orange',
  },
  pink: {
    badge: 'border-brand-secondary/35 bg-brand-secondary/12 text-brand-secondary',
    bar: 'bg-brand-secondary',
  },
} as const;

function accentFor(game: Game, index: number) {
  return ACCENT[GAME_ART[game.slug]?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];
}

/**
 * One backdrop layer per featured title. Tries the curated key art first,
 * then the game's banner, then a brand gradient — so the hero always has a
 * full-bleed image even before final art lands in /public/games.
 */
function HeroBackdrop({
  game,
  active,
  priority,
}: {
  game: Game;
  active: boolean;
  priority: boolean;
}) {
  const candidates = useMemo(
    () =>
      [GAME_ART[game.slug]?.thumbnail, game.bannerImageUrl].filter(
        (s): s is string => Boolean(s),
      ),
    [game],
  );
  const [srcIndex, setSrcIndex] = useState(0);
  const src = candidates[srcIndex] ?? null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          onError={() => setSrcIndex((i) => i + 1)}
          className={cn(
            'object-cover',
            active && 'motion-safe:animate-ken-burns',
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-brand-orange/12 via-brand-black to-brand-bg" />
      )}
    </motion.div>
  );
}

/** Wordmark lockup with graceful fallback to a typeset title. */
function SlideLogo({ game }: { game: Game }) {
  const src = GAME_ART[game.slug]?.logo ?? game.logoImageUrl ?? null;
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <h2 className="editorial-heading text-4xl text-brand-white sm:text-5xl md:text-6xl">
        {game.title}
      </h2>
    );
  }

  return (
    <div className="relative h-16 w-full max-w-105 sm:h-20 md:h-24">
      <Image
        src={src}
        alt={`${game.title} logo`}
        fill
        sizes="420px"
        onError={() => setFailed(true)}
        className="object-contain object-left mix-blend-screen"
      />
      <h2 className="sr-only">{game.title}</h2>
    </div>
  );
}

interface GamesHeroProps {
  games: Game[];
  /** Number of concept-stage titles — shown in the hero's footer stats. */
  conceptCount?: number;
}

/**
 * Cinematic landing for /games: full-bleed key art of the titles in active
 * development, crossfading on an 8s cycle, with the featured title's
 * wordmark, meta, and CTAs riding the lower third — the page's editorial
 * identity holds the upper left.
 */
export function GamesHero({ games, conceptCount = 0 }: GamesHeroProps) {
  const count = games.length;
  const [active, setActive] = useState(0);
  /* Bumped on every slide change (auto or manual) so the selector's progress
     bar remounts and restarts even when the slide index repeats. */
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % count);
      setCycle((c) => c + 1);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, cycle, count]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setCycle((c) => c + 1);
  };

  const game = games[active] ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <section
        data-hero
        id="games-hero"
        aria-label="Featured games"
        className="relative snap-start flex min-h-svh flex-col overflow-hidden bg-brand-black"
      >
        {/* Key art backdrops */}
        <div className="absolute inset-0">
          {games.map((g, i) => (
            <HeroBackdrop key={g.id} game={g} active={i === active} priority={i === 0} />
          ))}
        </div>

        {/* Legibility scrims — bottom-heavy so the art stays visible up top */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-bg via-brand-bg/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-black/65 via-brand-black/15 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-brand-black/70 to-transparent"
          aria-hidden="true"
        />
        {/* Ambient brand lighting — same rig language as the homepage */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 8% 12%, rgba(245,138,31,0.08), transparent 65%), radial-gradient(ellipse 50% 45% at 94% 88%, rgba(223,19,138,0.07), transparent 68%)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-6 pt-36 pb-8 md:px-12 md:pt-40 lg:px-20 xl:px-28">
          {/* Editorial identity — static while the slides rotate beneath it */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <div className="flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">Our Games</p>
            </div>
            <h1 className="editorial-heading mt-6 max-w-3xl text-4xl text-brand-white sm:text-5xl lg:text-6xl">
              Worlds built
              <br />
              to be played.
            </h1>
          </motion.div>

          {/* Featured slide + title selector */}
          <div className="mt-14 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7" aria-live="polite">
              {game && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={game.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  >
                    <span
                      className={cn(
                        'inline-flex w-fit items-center border px-4 py-1.5 label-overline backdrop-blur-sm',
                        accentFor(game, active).badge,
                      )}
                    >
                      {gameStatusLabels[game.status] ?? 'In Development'}
                    </span>

                    <div className="mt-6">
                      <SlideLogo game={game} />
                    </div>

                    <p className="mt-5 max-w-md text-sm leading-7 text-brand-white/75 md:text-base md:leading-8">
                      {game.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/60 uppercase">
                        {game.genre}
                      </span>
                      <span className="text-brand-white/20">·</span>
                      <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/45 uppercase">
                        {game.platforms.join(' · ')}
                      </span>
                      <span className="text-brand-white/20">·</span>
                      <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/45 uppercase">
                        {game.engine}
                      </span>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-4">
                      <CtaButton
                        href={game.projectLink ?? `/games/${game.slug}`}
                        variant="primary"
                        className="-ml-5"
                      >
                        View Project
                      </CtaButton>
                      <a
                        href="#in-development"
                        className="cursor-target group inline-flex items-center gap-3 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-orange"
                      >
                        All Projects
                        <span
                          className="transition-transform duration-300 group-hover:translate-y-1"
                          aria-hidden="true"
                        >
                          ↓
                        </span>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Desktop selector — wordmarks with an auto-advance progress bar */}
            {count > 1 && (
              <div className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:gap-7">
                {games.map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => select(i)}
                    aria-current={i === active}
                    aria-label={`Show ${g.title}`}
                    className={cn(
                      'cursor-target group w-full text-left transition-opacity duration-300',
                      i === active ? 'opacity-100' : 'opacity-40 hover:opacity-75',
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/60 uppercase">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/40 uppercase">
                        {g.genre}
                      </span>
                    </div>
                    <span className="mt-2 block font-display text-2xl font-extrabold tracking-tight text-brand-white">
                      {g.title}
                    </span>
                    <div className="mt-3 h-px w-full overflow-hidden bg-brand-white/15">
                      {i === active && (
                        <motion.div
                          key={cycle}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                          className={cn(
                            'h-full w-full origin-left',
                            accentFor(g, i).bar,
                          )}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer strip — studio stats, mobile dots, scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE_OUT }}
            className="mt-12 flex items-center justify-between gap-6 border-t border-brand-white/10 pt-5"
          >
            <div className="hidden items-center gap-3 sm:flex">
              <span className="font-accent text-[10px] tracking-[0.24em] text-brand-white/50 uppercase">
                {String(count).padStart(2, '0')} In Development
              </span>
              {conceptCount > 0 && (
                <>
                  <span className="text-brand-white/20">·</span>
                  <span className="font-accent text-[10px] tracking-[0.24em] text-brand-white/50 uppercase">
                    {String(conceptCount).padStart(2, '0')} In Concept
                  </span>
                </>
              )}
              <span className="text-brand-white/20">·</span>
              <span className="font-accent text-[10px] tracking-[0.24em] text-brand-white/50 uppercase">
                Life Apps In Exploration
              </span>
            </div>

            {/* Mobile slide dots */}
            {count > 1 && (
              <div className="flex items-center gap-2 lg:hidden">
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

            <a
              href="#in-development"
              className="cursor-target group ml-auto inline-flex items-center gap-3 label-overline text-brand-white/55 transition-colors duration-300 hover:text-brand-white"
            >
              Scroll
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
