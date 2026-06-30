/** @format */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';
import type { FeaturedGame } from '@/types';
import { gameStatusLabels } from '@/lib/data/content';
import { SLIDE_DURATION_MS } from '@/lib/data/featured-games';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

function SlideBackground({
  game,
  isActive,
  shouldLoad,
}: {
  game: FeaturedGame;
  isActive: boolean;
  shouldLoad: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [useKeyArt, setUseKeyArt] = useState(!game.trailerUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useKeyArt) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => setUseKeyArt(true));
    } else {
      video.pause();
    }
  }, [isActive, useKeyArt]);

  useEffect(() => {
    const el = bgRef.current;
    if (!el || !isActive) return;
    gsap.fromTo(
      el,
      { scale: 1.08 },
      { scale: 1, duration: SLIDE_DURATION_MS / 1000, ease: 'power2.out' },
    );
  }, [isActive, game.id]);

  return (
    <div ref={bgRef} className="absolute inset-0 will-change-transform">
      {shouldLoad && game.trailerUrl && !useKeyArt ? (
        <video
          ref={videoRef}
          src={game.trailerUrl}
          muted
          loop
          playsInline
          preload={isActive ? 'auto' : 'none'}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setUseKeyArt(true)}
        />
      ) : null}

      {(useKeyArt || !game.trailerUrl) && game.bannerImageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={game.bannerImageUrl}
            alt=""
            fill
            priority={isActive}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-brand-white/5 via-brand-black to-brand-bg" />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-brand-black/45" />
      <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/35 to-brand-black/10" />
      <div className="absolute inset-0 bg-linear-to-r from-brand-black/75 via-brand-black/20 to-transparent" />
    </div>
  );
}

function SlideContent({ game }: { game: FeaturedGame }) {
  return (
    <motion.div
      key={game.id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 md:px-16 md:pb-32 lg:px-24 lg:pb-36"
    >
      {/* Status badge */}
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mb-5 inline-flex w-fit border border-brand-white/15 bg-brand-white/5 px-4 py-1.5 label-overline text-brand-grey backdrop-blur-sm"
      >
        {gameStatusLabels[game.status] ?? 'In Development'}
      </motion.span>

      {/* Game title — editorial-heading handles weight + natural case */}
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="editorial-heading max-w-4xl text-5xl text-brand-white sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {game.title}
      </motion.h2>

      {/* Meta info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2"
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
        transition={{ delay: 0.38, duration: 0.5 }}
        className="mt-6 max-w-lg text-sm leading-8 text-brand-grey md:text-base"
      >
        {game.description}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.5 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button
          href={game.projectLink ?? `/games/${game.slug}`}
          variant="primary"
          size="lg"
        >
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
      className="relative w-full"
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
      {/* Section label */}
      <div className="absolute top-8 left-6 z-20 md:left-16 lg:left-24">
        <div className="accent-line mb-3" />
        <p className="label-overline text-brand-grey/60">Featured</p>
      </div>

      {/* Cinematic banner */}
      <div className="relative h-[85vh] min-h-140 max-h-225 w-full overflow-hidden bg-brand-black">
        <AnimatePresence mode="sync">
          {games.map((game, index) => {
            const isActive = index === activeIndex;
            const shouldLoad =
              isActive ||
              index === (activeIndex + 1) % count ||
              index === (activeIndex - 1 + count) % count;

            return (
              <motion.div
                key={game.id}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                  'absolute inset-0',
                  !isActive && 'pointer-events-none',
                )}
                aria-hidden={!isActive}
              >
                <SlideBackground
                  game={game}
                  isActive={isActive}
                  shouldLoad={shouldLoad}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <SlideContent key={activeGame.id} game={activeGame} />
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute right-6 bottom-8 left-6 z-20 md:right-16 md:left-16 lg:right-24 lg:left-24">
          {/* Progress bars — white, not orange */}
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
            <div className="flex items-center gap-3">
              <span className="font-accent text-[10px] tracking-[0.25em] text-brand-grey/60 uppercase">
                {String(activeIndex + 1).padStart(2, '0')}{' '}
                <span className="text-brand-white/20">/</span>{' '}
                {String(count).padStart(2, '0')}
              </span>
            </div>

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
