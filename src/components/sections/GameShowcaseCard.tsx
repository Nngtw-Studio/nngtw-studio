/** @format */

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { CtaButton } from '@/components/ui/CtaButton';
import { FadeIn } from '@/components/motion/FadeIn';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { cn } from '@/lib/utils';
import type { FeaturedGame } from '@/types';

const ACCENT = {
  orange: {
    glow: 'radial-gradient(ellipse 60% 55% at 25% 20%, rgba(245,138,31,0.22), transparent 68%)',
    badge: 'border-brand-orange/35 bg-brand-orange/10 text-brand-orange',
    frameHover: 'group-hover:border-brand-orange/45',
    linkHover: 'hover:text-brand-orange',
  },
  pink: {
    glow: 'radial-gradient(ellipse 60% 55% at 25% 20%, rgba(223,19,138,0.22), transparent 68%)',
    badge: 'border-brand-secondary/35 bg-brand-secondary/10 text-brand-secondary',
    frameHover: 'group-hover:border-brand-secondary/45',
    linkHover: 'hover:text-brand-secondary',
  },
} as const;

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5 3.3v9.4l8.2-4.7L5 3.3Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function SpeakerIcon({ muted, className }: { muted: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M3 7.5v5h3.3L10.5 16V4L6.3 7.5H3Z" fill="currentColor" />
      {muted ? (
        <path
          d="M13.5 7.5l4 5M17.5 7.5l-4 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M13.3 7c1 .85 1.6 1.9 1.6 3s-.6 2.15-1.6 3M15.4 4.7c1.9 1.6 3 3.7 3 5.3s-1.1 3.7-3 5.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

interface GameShowcaseCardProps {
  game: FeaturedGame;
  index: number;
}

export function GameShowcaseCard({ game, index }: GameShowcaseCardProps) {
  const reverse = index % 2 === 1;
  const art = GAME_ART[game.slug];
  const accent = ACCENT[art?.accent ?? (reverse ? 'pink' : 'orange')];
  const thumbnailSrc = art?.thumbnail ?? game.bannerImageUrl ?? null;
  const logoSrc = art?.logo ?? game.logoImageUrl ?? null;

  const [thumbFailed, setThumbFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 150, damping: 22 });
  const springY = useSpring(py, { stiffness: 150, damping: 22 });
  const rotateX = useTransform(springY, [0, 1], [3.5, -3.5]);
  const rotateY = useTransform(springX, [0, 1], [-4, 4]);

  const onMediaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onMediaMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const handleWatchTrailer = () => {
    if (!game.trailerUrl) return;
    setPlaying(true);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => setPlaying(false));
    });
  };

  const handleCloseTrailer = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <FadeIn className="relative">
      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-14">
        {/* Media */}
        <div className={cn('lg:col-span-7', reverse ? 'lg:order-2' : 'lg:order-1')}>
          <div className="group relative">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 md:-inset-10"
              aria-hidden="true"
              style={{ background: accent.glow }}
            />

            <MotionConfig reducedMotion="user">
              <motion.div
                ref={frameRef}
                onMouseMove={onMediaMouseMove}
                onMouseLeave={onMediaMouseLeave}
                style={{ rotateX, rotateY, transformPerspective: 1400 }}
                whileHover={{ scale: 1.008 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className={cn(
                  'relative aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-black shadow-[0_40px_90px_-32px_rgba(0,0,0,0.75)] transition-colors duration-500',
                  accent.frameHover,
                )}
              >
                {/* Poster art */}
                {thumbnailSrc && !thumbFailed ? (
                  <Image
                    src={thumbnailSrc}
                    alt={`${game.title} key art`}
                    fill
                    priority={index === 0}
                    onError={() => setThumbFailed(true)}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={cn(
                      'object-cover transition-[opacity,transform] duration-700 ease-out',
                      playing
                        ? 'opacity-0'
                        : 'opacity-100 motion-safe:animate-ken-burns group-hover:scale-[1.04]',
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
                    <span className="label-overline text-brand-white/25">{game.title}</span>
                  </div>
                )}

                {/* Trailer */}
                {game.trailerUrl && (
                  <video
                    ref={videoRef}
                    src={game.trailerUrl}
                    playsInline
                    preload="none"
                    muted={muted}
                    onEnded={() => setPlaying(false)}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                      playing ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )}
                  />
                )}

                {/* Legibility gradient */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-black/75 via-transparent to-transparent" />

                {/* Glass sheen */}
                <div className="glass-panel pointer-events-none absolute inset-x-0 top-0 h-16 mask-[linear-gradient(to_bottom,black,transparent)]" />

                {/* Trailer controls */}
                {game.trailerUrl && !playing && (
                  <button
                    type="button"
                    onClick={handleWatchTrailer}
                    className="cursor-target absolute bottom-5 left-5 inline-flex items-center gap-3 md:bottom-7 md:left-7"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-white/30 bg-brand-black/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-brand-white/60">
                      <PlayIcon className="ml-0.5 h-3.5 w-3.5 text-brand-white" />
                    </span>
                    <span className="label-overline text-brand-white/85">Watch Trailer</span>
                  </button>
                )}

                {playing && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 md:top-5 md:right-5">
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
                      className="cursor-target flex h-9 w-9 items-center justify-center rounded-full border border-brand-white/25 bg-brand-black/50 text-brand-white/80 backdrop-blur-sm transition-colors hover:border-brand-white/50 hover:text-brand-white"
                    >
                      <SpeakerIcon muted={muted} className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseTrailer}
                      aria-label="Close trailer"
                      className="cursor-target flex h-9 w-9 items-center justify-center rounded-full border border-brand-white/25 bg-brand-black/50 text-brand-white/80 backdrop-blur-sm transition-colors hover:border-brand-white/50 hover:text-brand-white"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </MotionConfig>
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            'relative',
            'lg:col-span-5',
            reverse ? 'lg:order-1 lg:pr-2' : 'lg:order-2 lg:pl-2',
          )}
        >
          {/* Chapter numeral — a faint editorial flourish set behind the badge, bleeding up into the open gap above the row */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 left-0 z-0 select-none font-display text-[6rem] leading-none font-black text-brand-white/8 sm:-top-16 sm:text-[7.5rem] md:-top-20 md:text-[8.5rem]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="relative z-10">
            <span className={cn('inline-flex w-fit items-center border px-4 py-1.5 label-overline', accent.badge)}>
              {gameStatusLabels[game.status] ?? 'In Development'}
            </span>

            {logoSrc && !logoFailed ? (
              <div className="relative mt-6 h-16 w-full max-w-75 sm:h-20 md:h-24 md:max-w-90">
                <Image
                  src={logoSrc}
                  alt={`${game.title} logo`}
                  fill
                  onError={() => setLogoFailed(true)}
                  sizes="360px"
                  className="object-contain object-left mix-blend-screen"
                />
                <h3 className="sr-only">{game.title}</h3>
              </div>
            ) : (
              <h3 className="editorial-heading mt-6 text-4xl text-brand-white md:text-5xl">{game.title}</h3>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/55 uppercase">
                {game.genre}
              </span>
              <span className="text-brand-white/15">·</span>
              <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/40 uppercase">
                {game.platforms.join(' · ')}
              </span>
              <span className="text-brand-white/15">·</span>
              <span className="font-accent text-[10px] tracking-[0.28em] text-brand-white/40 uppercase">
                {game.engine}
              </span>
            </div>

            <p className="mt-6 max-w-md text-sm leading-8 text-brand-grey md:text-base">{game.description}</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-2 gap-y-4">
              <CtaButton href={game.projectLink ?? `/games/${game.slug}`} variant="primary">
                View Project
              </CtaButton>
              {game.followLink && (
                <CtaButton
                  href={game.followLink}
                  variant="secondary"
                  external
                >
                  Follow Development
                </CtaButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
