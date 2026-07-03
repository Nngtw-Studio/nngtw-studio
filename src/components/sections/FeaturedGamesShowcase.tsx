/** @format */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { FeaturedGame } from '@/types';
import { gameStatusLabels } from '@/lib/data/content';
import { SLIDE_DURATION_MS } from '@/lib/data/featured-games';
import { Button } from '@/components/ui/Button';
import { FeaturedMediaFrame, FeaturedMediaLayer } from '@/components/sections/FeaturedMedia';
import { cn } from '@/lib/utils';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

function SlideContent({ game }: { game: FeaturedGame }) {
  return (
    <motion.div
      key={game.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      {/* Status badge */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mb-6 inline-flex w-fit border border-brand-white/15 bg-brand-white/5 px-4 py-1.5 label-overline text-brand-grey"
      >
        {gameStatusLabels[game.status] ?? 'In Development'}
      </motion.span>

      {/* Game title — editorial-heading handles weight + natural case */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.7, ease: EASE_OUT }}
        className="editorial-heading max-w-xl text-4xl text-brand-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
      >
        {game.title}
      </motion.h2>

      {/* Meta info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.5 }}
        className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-brand-white/60">
          {game.genre}
        </span>
        <span className="text-brand-white/15">·</span>
        <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-brand-white/40">
          {game.platforms.join(' · ')}
        </span>
        <span className="text-brand-white/15">·</span>
        <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-brand-white/40">
          {game.engine}
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.5 }}
        className="mt-6 max-w-md text-sm leading-8 text-brand-grey md:text-base"
      >
        {game.description}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46, duration: 0.5 }}
        className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button href={game.projectLink ?? `/games/${game.slug}`} variant="primary" size="lg">
          View Project
        </Button>
        <Button
          href={game.followLink ?? '#'}
          variant="secondary"
          size="lg"
          external={game.followLink?.startsWith('http')}
        >
          Follow Development
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const count = games.length;
  const activeGame = games[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
      setProgress(0);
      progressRef.current = 0;
      lastTickRef.current = performance.now();
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isVisible, goPrev, goNext]);

  useEffect(() => {
    if (count <= 1 || isPaused || !isVisible) return;
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      progressRef.current = Math.min(progressRef.current + delta, SLIDE_DURATION_MS);
      setProgress(progressRef.current / SLIDE_DURATION_MS);
      if (progressRef.current >= SLIDE_DURATION_MS) {
        goNext();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeIndex, isPaused, isVisible, count, goNext]);

  if (!activeGame) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-brand-bg"
      aria-label="Featured games showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        lastTickRef.current = performance.now();
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => {
        setIsPaused(false);
        lastTickRef.current = performance.now();
      }}
    >
      <div className="section-padding mx-auto max-w-[1600px]">
        {/* Section label */}
        <div className="mb-14 flex items-center gap-4 md:mb-20">
          <div className="accent-line" />
          <p className="label-overline text-brand-grey/60">Featured</p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left — content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <SlideContent key={activeGame.id} game={activeGame} />
            </AnimatePresence>
          </div>

          {/* Right — media showcase */}
          <div className="order-1 lg:order-2">
            <FeaturedMediaFrame>
              <AnimatePresence mode="sync">
                {games.map((game, index) => {
                  const isActive = index === activeIndex;
                  const shouldLoad =
                    isVisible &&
                    (isActive ||
                      index === (activeIndex + 1) % count ||
                      index === (activeIndex - 1 + count) % count);

                  return (
                    <motion.div
                      key={game.id}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                      className={cn('absolute inset-0', !isActive && 'pointer-events-none')}
                      aria-hidden={!isActive}
                    >
                      <FeaturedMediaLayer
                        project={{
                          id: game.id,
                          title: game.title,
                          heroVideo: game.trailerUrl ?? null,
                          heroThumbnail: game.bannerImageUrl ?? null,
                        }}
                        isActive={isActive}
                        shouldLoad={shouldLoad}
                        priority={index === 0}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </FeaturedMediaFrame>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-14 md:mt-20">
          {/* Progress bars */}
          <div className="mb-6 flex gap-1.5">
            {games.map((game, index) => (
              <button
                key={game.id}
                onClick={() => goTo(index)}
                className="group relative h-px flex-1 overflow-hidden bg-brand-white/10 transition-colors hover:bg-brand-white/20"
                aria-label={`Go to ${game.title}`}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-brand-white/70 transition-none"
                  style={{
                    width:
                      index < activeIndex
                        ? '100%'
                        : index === activeIndex
                          ? `${progress * 100}%`
                          : '0%',
                  }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            {/* Slide counter */}
            <span className="font-accent text-[10px] tracking-[0.25em] text-brand-grey/60 uppercase">
              {String(activeIndex + 1).padStart(2, '0')}{' '}
              <span className="text-brand-white/20">/</span>{' '}
              {String(count).padStart(2, '0')}
            </span>

            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center border border-brand-white/10 text-brand-white/50 transition-all duration-300 hover:border-brand-white/40 hover:text-brand-white"
                aria-label="Previous game"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center border border-brand-white/10 text-brand-white/50 transition-all duration-300 hover:border-brand-white/40 hover:text-brand-white"
                aria-label="Next game"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View all link */}
      <div className="border-b border-brand-white/4 bg-brand-bg py-6 text-center">
        <Link
          href="/games"
          className="font-accent text-[10px] tracking-[0.3em] uppercase text-brand-grey/50 transition-colors duration-300 hover:text-brand-white"
        >
          View All Projects &rarr;
        </Link>
      </div>
    </section>
  );
}
