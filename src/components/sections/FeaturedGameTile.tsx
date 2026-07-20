/** @format */

'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GAME_ART } from '@/lib/data/game-art';
import { gameStatusLabels } from '@/lib/data/content';
import { cn } from '@/lib/utils';
import type { FeaturedGame } from '@/types';

const ACCENT = {
  orange: {
    badge: 'border-brand-orange/40 bg-brand-orange/15 text-brand-orange',
    frameHover: 'group-hover:border-brand-orange/50',
    glow: 'group-hover:shadow-[0_0_50px_-12px_rgba(245,138,31,0.35)]',
  },
  pink: {
    badge: 'border-brand-secondary/40 bg-brand-secondary/15 text-brand-secondary',
    frameHover: 'group-hover:border-brand-secondary/50',
    glow: 'group-hover:shadow-[0_0_50px_-12px_rgba(223,19,138,0.35)]',
  },
} as const;

interface FeaturedGameTileProps {
  game: FeaturedGame;
  index: number;
}

/**
 * Compact key-art tile for the homepage's Featured section — distinct from
 * the Games page's full alternating showcase row (GameShowcaseCard). The
 * whole card links to the project page, the trailer auto-plays muted on
 * hover (desktop only, loaded lazily on first hover), and the logo + meta
 * sit on a legibility gradient. Designed to live in a grid — the section
 * stays one screen tall no matter how many titles are featured.
 */
export function FeaturedGameTile({ game, index }: FeaturedGameTileProps) {
  const art = GAME_ART[game.slug];
  const accent = ACCENT[art?.accent ?? (index % 2 === 1 ? 'pink' : 'orange')];
  const thumbnailSrc = art?.thumbnail ?? game.bannerImageUrl ?? null;
  const logoSrc = art?.logo ?? game.logoImageUrl ?? null;

  const [thumbFailed, setThumbFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);

  const handleEnter = useCallback(() => {
    setHovering(true);
    const v = videoRef.current;
    if (!v) return;
    if (!loadedRef.current) {
      loadedRef.current = true;
      v.load();
    }
    v.play().catch(() => {});
  }, []);

  const handleLeave = useCallback(() => {
    setHovering(false);
    videoRef.current?.pause();
  }, []);

  return (
    <Link
      href={game.projectLink ?? `/games/${game.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        'cursor-target group relative block overflow-hidden rounded-3xl border border-brand-white/10 bg-brand-black shadow-[0_28px_60px_-28px_rgba(0,0,0,0.7)] transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1',
        accent.frameHover,
        accent.glow,
      )}
      aria-label={`${game.title} — view project`}
    >
      <div className="relative aspect-video">
        {/* Key art */}
        {thumbnailSrc && !thumbFailed ? (
          <Image
            src={thumbnailSrc}
            alt={`${game.title} key art`}
            fill
            priority={index === 0}
            onError={() => setThumbFailed(true)}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn(
              'object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.05]',
              hovering && videoReady && 'opacity-0',
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
            <span className="label-overline text-brand-white/25">{game.title}</span>
          </div>
        )}

        {/* Hover trailer — muted, lazy-loaded on first hover */}
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

        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-black/85 via-brand-black/20 to-transparent" />

        {/* Status badge */}
        <span
          className={cn(
            'absolute top-4 left-4 inline-flex items-center border px-3 py-1 font-accent text-[9px] tracking-[0.22em] uppercase backdrop-blur-sm md:top-5 md:left-5',
            accent.badge,
          )}
        >
          {gameStatusLabels[game.status] ?? 'In Development'}
        </span>

        {/* Bottom overlay — logo, meta, cue */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
          <div className="min-w-0">
            {logoSrc && !logoFailed ? (
              <div className="relative h-14 w-40 sm:h-16 sm:w-48 md:h-20 md:w-56">
                <Image
                  src={logoSrc}
                  alt={`${game.title} logo`}
                  fill
                  onError={() => setLogoFailed(true)}
                  sizes="224px"
                  className="object-contain object-bottom-left mix-blend-screen drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                />
                <h3 className="sr-only">{game.title}</h3>
              </div>
            ) : (
              <h3 className="editorial-heading text-2xl text-brand-white md:text-3xl">
                {game.title}
              </h3>
            )}
            <p className="mt-2.5 truncate font-accent text-[9px] tracking-[0.25em] text-brand-white/50 uppercase">
              {game.genre} <span className="text-brand-white/20">·</span>{' '}
              {game.platforms.join(' · ')}
            </p>
          </div>

          {/* Cue — arrow chip that brightens on hover */}
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-white/20 bg-brand-black/40 text-brand-white/60 backdrop-blur-sm transition-all duration-300 group-hover:border-brand-white/50 group-hover:text-brand-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
