/** @format */

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
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
import type { FeaturedGame, GameStatus } from '@/types';

const ACCENT = {
  orange: {
    badgeDot: 'bg-brand-orange',
    badgeText: 'text-brand-orange',
    frameHover: 'group-hover/media:border-brand-orange/30',
    cardHover: 'hover:border-brand-orange/30',
  },
  pink: {
    badgeDot: 'bg-brand-secondary',
    badgeText: 'text-brand-secondary',
    frameHover: 'group-hover/media:border-brand-secondary/30',
    cardHover: 'hover:border-brand-secondary/30',
  },
} as const;

/** Secondary CTA copy by release state — overridable per-game via GAME_ART. */
const SECONDARY_CTA_BY_STATUS: Record<GameStatus, string> = {
  'in-development': 'Join Playtest',
  planned: 'Wishlist',
  concept: 'Wishlist',
  released: 'Play Now',
};

interface GameShowcaseCardProps {
  game: FeaturedGame;
  index: number;
}

/**
 * Storefront-style feature card — hero media beside a compact info panel.
 * Answers exactly two questions (what is this, do I want it) and defers
 * everything else (gallery, roadmap, versions) to the dedicated game page
 * the hero itself links to.
 */
export function GameShowcaseCard({ game, index }: GameShowcaseCardProps) {
  const art = GAME_ART[game.slug];
  const accent = ACCENT[art?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];

  const thumbnailSrc = art?.thumbnail ?? game.bannerImageUrl ?? null;
  const iconSrc = art?.icon ?? thumbnailSrc;
  const logoSrc = art?.logo ?? game.logoImageUrl ?? null;

  const [thumbFailed, setThumbFailed] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pointer-tilt on the hero frame — subtle, premium, never exaggerated.
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 160, damping: 24 });
  const springY = useSpring(py, { stiffness: 160, damping: 24 });
  const rotateX = useTransform(springY, [0, 1], [2, -2]);
  const rotateY = useTransform(springX, [0, 1], [-2.5, 2.5]);

  const onFrameMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onFrameEnter = () => {
    setHovering(true);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const onFrameLeave = () => {
    setHovering(false);
    px.set(0.5);
    py.set(0.5);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const projectHref = game.projectLink ?? `/games/${game.slug}`;
  const secondaryLabel =
    art?.secondaryCta?.label ?? SECONDARY_CTA_BY_STATUS[game.status] ?? 'Follow Development';
  const secondaryHref = art?.secondaryCta?.href ?? game.followLink ?? projectHref;
  const tags = art?.tags ?? [game.genre, ...game.platforms];

  return (
    <FadeIn className="relative">
      <div className="relative">
        <article
          className={cn(
            'glass-panel group/card relative overflow-hidden rounded-4xl p-6 shadow-[0_40px_100px_-42px_rgba(0,0,0,0.6)] transition-colors duration-500 md:p-8 xl:p-10',
            accent.cardHover,
          )}
        >
          {/* Chapter numeral — bleeds into the top-right corner, like the Life Apps pillars */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-6 font-display text-[6rem] leading-none font-black text-brand-white/5 select-none transition-colors duration-500 group-hover/card:text-brand-white/8 md:right-8 md:text-[7rem]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* Hero media — the whole frame links to the dedicated game page */}
            <div className="lg:col-span-7">
              <div className="group/media relative">
                <MotionConfig reducedMotion="user">
                  <Link
                    href={projectHref}
                    aria-label={`${game.title} — view project`}
                    className="block"
                  >
                    <motion.div
                      ref={frameRef}
                      onMouseMove={onFrameMouseMove}
                      onMouseEnter={onFrameEnter}
                      onMouseLeave={onFrameLeave}
                      style={{ rotateX, rotateY, transformPerspective: 1400 }}
                      whileHover={{ scale: 1.015 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                      className={cn(
                        'relative aspect-video w-full overflow-hidden rounded-3xl border border-brand-white/10 bg-brand-black shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-500 group-hover/media:shadow-[0_36px_80px_-26px_rgba(0,0,0,0.72)]',
                        accent.frameHover,
                      )}
                    >
                      {thumbnailSrc && !thumbFailed ? (
                        <Image
                          src={thumbnailSrc}
                          alt={`${game.title} key art`}
                          fill
                          priority={index === 0}
                          onError={() => setThumbFailed(true)}
                          sizes="(min-width: 1024px) 55vw, 100vw"
                          className={cn(
                            'object-cover transition-opacity duration-700 ease-out',
                            hovering && game.trailerUrl ? 'opacity-0' : 'opacity-100',
                          )}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
                          <span className="label-overline text-brand-white/25">{game.title}</span>
                        </div>
                      )}

                      {/* Trailer — muted autoplay on hover, no controls, no UI */}
                      {game.trailerUrl && (
                        <video
                          ref={videoRef}
                          src={game.trailerUrl}
                          playsInline
                          preload="none"
                          loop
                          muted
                          className={cn(
                            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                            hovering ? 'opacity-100' : 'pointer-events-none opacity-0',
                          )}
                        />
                      )}

                      {/* Very subtle bottom gradient only — artwork stays vibrant */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-black/15 to-transparent" />
                    </motion.div>
                  </Link>
                </MotionConfig>
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5">
              {/* Branding — icon + logo as one identity */}
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-black shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)] sm:h-28 sm:w-28">
                  {iconSrc && !iconFailed ? (
                    <Image
                      src={iconSrc}
                      alt={`${game.title} icon`}
                      fill
                      onError={() => setIconFailed(true)}
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-white/8 to-brand-black">
                      <span className="font-display text-xl font-black text-brand-white/40">
                        {game.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {logoSrc && !logoFailed ? (
                  <div className="relative h-24 max-w-80 min-w-0 flex-1 sm:h-28">
                    <Image
                      src={logoSrc}
                      alt={`${game.title} logo`}
                      fill
                      onError={() => setLogoFailed(true)}
                      sizes="320px"
                      className="object-contain object-left mix-blend-screen"
                    />
                    <h3 className="sr-only">{game.title}</h3>
                  </div>
                ) : (
                  <h3 className="editorial-heading min-w-0 flex-1 text-2xl text-brand-white md:text-3xl">
                    {game.title}
                  </h3>
                )}
              </div>

              {/* Status badge */}
              <span
                className={cn(
                  'mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-white/10 bg-brand-white/5 px-3.5 py-1.5 font-accent text-[10px] tracking-[0.2em] uppercase',
                  accent.badgeText,
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', accent.badgeDot)} aria-hidden="true" />
                {gameStatusLabels[game.status] ?? 'In Development'}
              </span>

              {/* Tags */}
              <p className="mt-3 font-accent text-[10px] tracking-[0.22em] text-brand-white/40 uppercase">
                {tags.join(' • ')}
              </p>

              <p className="mt-5 line-clamp-3 max-w-md text-sm leading-8 text-brand-grey/80 md:text-base">
                {game.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-4">
                <CtaButton href={projectHref} variant="primary">
                  Explore Game
                </CtaButton>
                <CtaButton
                  href={secondaryHref}
                  variant="secondary"
                  external={art?.secondaryCta?.external ?? true}
                >
                  {secondaryLabel}
                </CtaButton>
              </div>
            </div>
          </div>
        </article>
      </div>
    </FadeIn>
  );
}
