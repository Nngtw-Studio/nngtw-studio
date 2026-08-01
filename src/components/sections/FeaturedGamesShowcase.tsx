/** @format */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { SLIDE_DURATION_MS } from '@/lib/data/featured-games';
import { cn } from '@/lib/utils';
import type { FeaturedGame } from '@/types';

const EASE_ACCORDION = [0.25, 1, 0.5, 1] as const;

const ACCENT = {
  orange: { badge: 'border-brand-orange/40 bg-brand-orange/12 text-brand-orange', bar: 'bg-brand-orange', text: 'text-brand-orange' },
  pink: { badge: 'border-brand-secondary/40 bg-brand-secondary/12 text-brand-secondary', bar: 'bg-brand-secondary', text: 'text-brand-secondary' },
} as const;

function accentFor(game: FeaturedGame, index: number) {
  return ACCENT[GAME_ART[game.slug]?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];
}

function GameIcon({ game }: { game: FeaturedGame }) {
  const art = GAME_ART[game.slug];
  const src = art?.icon ?? art?.thumbnail ?? null;
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-brand-white/15 bg-brand-black/50 backdrop-blur-sm sm:h-12 sm:w-12">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="48px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-base font-black text-brand-white/50 sm:text-lg">
            {game.title.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Accordion Card Component (Extracted for 3D Tilt State)
// -------------------------------------------------------------
function AccordionCard({ 
  game, 
  index, 
  isActive,
  isEntered, 
  transitionClass,
  selectCard,
  advance
}: { 
  game: FeaturedGame, 
  index: number, 
  isActive: boolean,
  isEntered: boolean, 
  transitionClass: string,
  selectCard: (i: number) => void,
  advance: () => void
}) {
  const [videoReady, setVideoReady] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);
  const [isBuffered, setIsBuffered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const accent = accentFor(game, index);
  const art = GAME_ART[game.slug];
  const imageSrc = art?.thumbnail ?? game.bannerImageUrl ?? null;

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setTransitionDone(true), 1100);
      return () => clearTimeout(timer);
    } else {
      setTransitionDone(false);
      setVideoReady(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && transitionDone && isBuffered && videoRef.current) {
      videoRef.current.play().then(() => {
        setVideoReady(true);
      }).catch(() => {});
    }
  }, [isActive, transitionDone, isBuffered]);

  const handleCanPlayThrough = () => {
    setIsBuffered(true);
  };

  // 3D Pointer Tilt
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 160, damping: 24 });
  const springY = useSpring(py, { stiffness: 160, damping: 24 });
  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-4, 4]);

  const onFrameMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onFrameLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      className={cn(
        "transition-[flex,flex-grow,flex-basis,width,height,aspect-ratio,opacity,margin] ease-[cubic-bezier(0.25,1,0.5,1)]",
        transitionClass,
        !isEntered && "opacity-0 overflow-hidden m-0 h-0 lg:h-auto lg:w-0 lg:flex-[0_0_0%]",
        isEntered && !isActive && "opacity-100 w-full h-48 lg:h-auto lg:flex-1",
        isEntered && isActive && "opacity-100 w-full aspect-video lg:aspect-auto lg:flex-[3.5]",
        isEntered && index > 0 && "mt-5 lg:mt-0 lg:ml-5"
      )}
    >
      <motion.div
        ref={frameRef}
        onClick={() => selectCard(index)}
        onMouseMove={onFrameMouseMove}
        onMouseLeave={onFrameLeave}
        style={{ 
          rotateX, 
          rotateY, 
          transformPerspective: 1400,
          transitionProperty: 'border-color, box-shadow',
          transitionDuration: '1000ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        className={cn(
          'group relative h-full w-full overflow-hidden rounded-3xl border hover:border-brand-secondary/40',
          isActive
            ? 'border-brand-white/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]'
            : 'border-brand-white/10'
        )}
      >
        {/* Poster image background */}
      <div className="absolute inset-0 bg-brand-black">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={isActive}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn(
              'object-cover transition-transform duration-700 transform-gpu',
              isActive ? 'scale-100 group-hover:scale-105' : 'scale-105 group-hover:scale-110'
            )}
          />
        )}
      </div>

      {/* Video playing for active card */}
      {isActive && game.trailerUrl && (
        <video
          key={game.slug}
          ref={videoRef}
          src={game.trailerUrl}
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={handleCanPlayThrough}
          onEnded={advance}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-700 transform-gpu',
            videoReady ? 'opacity-100' : 'opacity-0',
            'scale-100 group-hover:scale-105'
          )}
          aria-hidden="true"
        />
      )}

      {/* Gradient Overlay Scrims */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          isActive
            ? 'bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent lg:bg-gradient-to-r lg:from-brand-black/90 lg:via-brand-black/40 lg:to-transparent'
            : 'bg-gradient-to-t from-brand-black/90 via-brand-black/50 to-brand-black/20'
        )}
        aria-hidden="true"
      />
      {isActive && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
      )}

      {/* Active Card Content */}
      {isActive ? (
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-9 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-accent text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm',
                    accent.badge
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {gameStatusLabels[game.status] ?? 'In Development'}
                </span>
                <span className="rounded-full border border-brand-white/20 bg-brand-black/40 px-3 py-1 font-accent text-[10px] tracking-[0.2em] text-brand-white/70 uppercase backdrop-blur-sm">
                  {game.engine}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3.5">
                <GameIcon game={game} />
                <h3 className="editorial-heading text-3xl text-brand-white md:text-4xl lg:text-5xl">
                  {game.title}
                </h3>
              </div>

              <p className="mt-3 max-w-xl text-xs leading-6 text-brand-white/80 md:text-sm md:leading-7 line-clamp-2 md:line-clamp-3">
                {game.description}
              </p>

              <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-700 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100">
                <div className="overflow-hidden">
                  <div className="pt-5 pb-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-accent text-[10px] tracking-[0.22em] text-brand-white/60 uppercase">
                      {game.genre}
                      <span className="text-brand-white/25"> · </span>
                      {game.platforms.join(' · ')}
                    </p>

                    <Link
                      href={game.projectLink ?? `/games/${game.slug}`}
                      className="group/link inline-flex items-center gap-3 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-orange"
                    >
                      View Project
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Inactive Narrow Card Content */
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <div className="flex items-center gap-3">
            <GameIcon game={game} />
            <div className="overflow-hidden">
              <p className="font-accent text-[10px] tracking-[0.2em] text-brand-white/60 uppercase">
                {gameStatusLabels[game.status] ?? 'Next Up'}
              </p>
              <h4 className="editorial-heading text-xl text-brand-white truncate">
                {game.title}
              </h4>
            </div>
          </div>
        </div>
      )}
      </motion.div>
    </div>
  );
}

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  const count = games.length;
  const [active, setActive] = useState(-1);
  const [enteredCount, setEnteredCount] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.6 });

  useEffect(() => {
    if (isInView) {
      const timeouts: NodeJS.Timeout[] = [];
      
      setEnteredCount(1);
      
      timeouts.push(setTimeout(() => {
        setActive(0);
        if (count > 1) {
          setEnteredCount(2);
        }
      }, 550));

      for (let i = 2; i < count; i++) {
        timeouts.push(setTimeout(() => {
          setEnteredCount(i + 1);
        }, 550 + (i - 1) * 1000));
      }

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isInView, count]);

  const totalFlex = 3.5 + (count > 1 ? count - 1 : 0);
  let currentEnteredFlex = 0;
  for (let i = 0; i < enteredCount; i++) {
    currentEnteredFlex += (i === active) ? 3.5 : 1;
  }
  const spacerFlex = Math.max(0, totalFlex - currentEnteredFlex);
  const transitionClass = active === -1 ? 'duration-500' : 'duration-1000';

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % count);
  }, [count]);

  const selectCard = (index: number) => {
    if (index === active) return;
    setActive(index);
  };

  if (!games || count === 0) return null;

  return (
    <section
      id="featured-games"
      ref={containerRef}
      className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black"
      aria-label="Featured games"
    >
      {/* Dynamic Background Thumbnail (Unblurred) */}
      {games.map((g, i) => {
        const isActive = i === active;
        const art = GAME_ART[g.slug];
        const imageSrc = art?.thumbnail ?? g.bannerImageUrl ?? null;
        
        return (
          <div
            key={g.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
              isActive ? "opacity-30" : "opacity-0"
            )}
          >
            {imageSrc && (
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover scale-110"
                sizes="100vw"
              />
            )}
            {/* Dark overlay so the unblurred background doesn't overwhelm the content */}
            <div className="absolute inset-0 bg-brand-black/50" />
          </div>
        );
      })}

      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 10% 8%, rgba(245,138,31,0.07), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 92%, rgba(223,19,138,0.08), transparent 68%)',
        }}
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        {/* Section Header */}
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
              <p className="max-w-xs body-description">
                Original titles in active development.
              </p>
              <Link
                href="/games"
                className="group inline-flex items-center gap-3 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-orange"
              >
                View All Projects
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Accordion Showcase Row */}
        <div className="mt-8 md:mt-10">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[460px] xl:min-h-[520px]">
            {/* Invisible spacer to push entering cards to the right */}
            <div 
              className={cn(
                "hidden lg:block transition-[flex,flex-grow,flex-basis] ease-[cubic-bezier(0.25,1,0.5,1)]",
                transitionClass
              )}
              style={{ flex: `${spacerFlex} ${spacerFlex} 0%` }}
              aria-hidden="true"
            />
            {games.map((g, i) => (
              <AccordionCard
                key={g.id}
                game={g}
                index={i}
                isActive={i === active}
                isEntered={i < enteredCount}
                transitionClass={transitionClass}
                selectCard={selectCard}
                advance={advance}
              />
            ))}
          </div>
        </div>

        {/* Indicator dots */}
        {count > 1 && (
          <div
            role="tablist"
            aria-label="Featured games tabs"
            className="mt-8 flex justify-center items-center gap-3"
          >
            {games.map((g, i) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                onClick={() => selectCard(i)}
                aria-selected={i === active}
                aria-label={`Show ${g.title}`}
                className={cn(
                  'rounded-full transition-all duration-500',
                  i === active
                    ? cn('h-2 w-8', accentFor(g, i).bar)
                    : 'h-2 w-2 bg-brand-white/30 hover:bg-brand-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
