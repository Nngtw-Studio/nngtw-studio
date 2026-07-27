/** @format */

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, MotionConfig } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { cn } from '@/lib/utils';
import type { Game } from '@/types';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ACCENT = {
  orange: { badge: 'border-brand-orange/40 bg-brand-orange/12 text-brand-orange', frame: 'group-hover:border-brand-orange/40', phase: 'border-brand-orange text-brand-orange' },
  pink: { badge: 'border-brand-secondary/40 bg-brand-secondary/12 text-brand-secondary', frame: 'group-hover:border-brand-secondary/40', phase: 'border-brand-secondary text-brand-secondary' },
} as const;

interface GameHeroProps {
  game: Game;
}

/**
 * Editorial hero for a single game page — the homepage Featured showcase's
 * card, minus the tabs, plus the development roadmap strip (too much detail
 * for the homepage, exactly right once a viewer has chosen this title).
 */
export function GameHero({ game }: GameHeroProps) {
  const accent = ACCENT[GAME_ART[game.slug]?.accent ?? 'orange'];

  return (
    <MotionConfig reducedMotion="user">
      {/* data-hero: the site header treats this as the page's hero — the nav
          never snap-hides while it's on screen. */}
      <section data-hero className="relative overflow-hidden pt-32 pb-8 md:pt-40">
        <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-brand-white/1 blur-[140px]" />

        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeIn>
            <p className="label-overline mb-6 text-brand-grey/60">Our Games</p>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div
              className={cn(
                'grid overflow-hidden rounded-3xl border border-brand-white/10 bg-brand-muted/40 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] lg:grid-cols-12',
              )}
            >
              {/* Info panel */}
              <div className="flex flex-col justify-between gap-10 p-8 md:p-11 lg:col-span-5">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-2.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-accent text-[10px] tracking-[0.2em] uppercase',
                        accent.badge,
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                      {gameStatusLabels[game.status] ?? 'In Development'}
                    </span>
                    <span className="rounded-full border border-brand-white/14 px-3.5 py-1.5 font-accent text-[10px] tracking-[0.2em] text-brand-white/55 uppercase">
                      {game.engine}
                    </span>
                  </div>
                  <h1 className="editorial-heading text-4xl text-brand-white md:text-5xl">
                    {game.title}
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-8 text-brand-grey/85 md:text-base">
                    {game.description}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-brand-white/10 bg-brand-white/10">
                    <div className="bg-brand-black px-5 py-4">
                      <p className="font-accent text-[9px] tracking-[0.26em] text-brand-white/40 uppercase">
                        Genre
                      </p>
                      <p className="mt-2 font-display text-sm font-semibold text-brand-white">
                        {game.genre}
                      </p>
                    </div>
                    <div className="bg-brand-black px-5 py-4">
                      <p className="font-accent text-[9px] tracking-[0.26em] text-brand-white/40 uppercase">
                        Platforms
                      </p>
                      <p className="mt-2 font-display text-sm font-semibold text-brand-white">
                        {game.platforms.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
                  {game.followLink && (
                    <Button href={game.followLink} variant="discord" external>
                      Join Discord
                    </Button>
                  )}
                  <Button href="/games" variant="secondary">
                    All Games
                  </Button>
                </div>
              </div>

              {/* Media panel — hover-to-play trailer over key art */}
              <GameHeroMedia game={game} accentFrame={accent.frame} />

              {/* Roadmap strip */}
              {game.roadmap && game.roadmap.length > 0 && (
                <div className="border-t border-brand-white/10 bg-brand-white/2 px-8 py-9 md:px-11 lg:col-span-12">
                  <p className="mb-6 font-accent text-[10px] tracking-[0.26em] text-brand-white/42 uppercase">
                    Development Roadmap
                  </p>
                  <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                    {game.roadmap.map((phase, i) => (
                      <div
                        key={phase.phase}
                        className={cn(
                          'flex flex-col gap-2.5 border-t-2 pt-4',
                          i === 0 ? accent.phase : 'border-brand-white/14 text-brand-white/40',
                        )}
                      >
                        <span className="font-accent text-[9px] tracking-[0.26em] uppercase">
                          Phase {i + 1}
                        </span>
                        <h3 className="font-display text-sm font-bold tracking-tight text-brand-white">
                          {phase.phase}
                        </h3>
                        <p className="text-[13px] leading-6 text-brand-grey/70">
                          {phase.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </MotionConfig>
  );
}

function GameHeroMedia({ game, accentFrame }: { game: Game; accentFrame: string }) {
  const art = GAME_ART[game.slug];
  const thumbnailSrc = art?.thumbnail ?? game.bannerImageUrl ?? null;
  const [thumbFailed, setThumbFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);

  const handleEnter = () => {
    setHovering(true);
    const v = videoRef.current;
    if (!v) return;
    if (!loadedRef.current) {
      loadedRef.current = true;
      v.load();
    }
    v.play().catch(() => {});
  };

  const handleLeave = () => {
    setHovering(false);
    videoRef.current?.pause();
  };

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={cn(
        'group relative min-h-80 overflow-hidden border-t border-brand-white/10 bg-brand-black transition-colors duration-500 lg:col-span-7 lg:min-h-135 lg:border-t-0 lg:border-l',
        accentFrame,
      )}
    >
      {thumbnailSrc && !thumbFailed ? (
        <Image
          src={thumbnailSrc}
          alt={`${game.title} key art`}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          onError={() => setThumbFailed(true)}
          className={cn(
            'object-cover transition-opacity duration-700 ease-out',
            hovering && videoReady ? 'opacity-0' : 'opacity-100',
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
          <span className="label-overline text-brand-white/25">{game.title}</span>
        </div>
      )}

      {game.trailerUrl && (
        <video
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

      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-black/45 via-transparent to-transparent lg:from-brand-black/55 lg:via-brand-black/5" />

      {game.trailerUrl && (
        <span
          className={cn(
            'pointer-events-none absolute right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full border border-brand-white/25 bg-brand-black/50 text-brand-white/80 backdrop-blur-sm transition-opacity duration-300',
            hovering && videoReady ? 'opacity-0' : 'opacity-100',
          )}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="ml-0.5 h-4 w-4">
            <path d="M4 2.5v11l9-5.5-9-5.5z" />
          </svg>
        </span>
      )}
    </motion.div>
  );
}
