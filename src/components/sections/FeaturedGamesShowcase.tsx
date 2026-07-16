/** @format */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedGame } from '@/types';
import { gameStatusLabels } from '@/lib/data/content';
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
      {game.logoImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT }}
          className="mb-5 h-16 w-52 sm:h-20 sm:w-64"
        >
          <Image
            src={game.logoImageUrl}
            alt={`${game.title} logo`}
            width={640}
            height={200}
            className="h-full w-full object-contain object-left"
          />
        </motion.div>
      )}
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
        className="mt-8 flex flex-col sm:flex-row sm:items-center"
      >
        <Button href={game.projectLink ?? `/games/${game.slug}`} variant="primary" size="lg">
          View Project
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const count = games.length;
  const activeGame = games[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
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

  if (!activeGame) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#160d17]"
      aria-label="Featured games showcase"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 8% 55%, rgba(245,138,31,0.11), transparent 68%), radial-gradient(ellipse 60% 70% at 92% 35%, rgba(223,19,138,0.12), transparent 70%)',
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1600px] flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-20 xl:px-28">
        {/* Section label */}
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          <div className="accent-line" />
          <p className="label-overline text-brand-orange">Featured</p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-20">
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
                        onEnded={isActive ? goNext : undefined}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </FeaturedMediaFrame>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 md:mt-14">
          {/* Progress bars */}
          <div className="mb-6 flex gap-1.5">
            {games.map((game, index) => (
              <button
                key={game.id}
                onClick={() => goTo(index)}
                className="group relative h-px flex-1 overflow-hidden bg-brand-white/10 transition-colors hover:bg-brand-white/20"
                aria-label={`Go to ${game.title}`}
              >
                <span className={cn('absolute inset-0 origin-left bg-brand-white/70 transition-transform duration-500', index === activeIndex ? 'scale-x-100' : index < activeIndex ? 'scale-x-100' : 'scale-x-0')} />
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
      <div className="border-b border-brand-white/4 bg-[#160d17] py-6 text-center">
        <Link
          href="/games"
          className="font-secondary text-[18px] font-semibold tracking-[0.08em] uppercase text-brand-white/80 transition-colors duration-300 hover:text-brand-orange"
        >
          View All Projects &rarr;
        </Link>
      </div>
    </section>
  );
}
