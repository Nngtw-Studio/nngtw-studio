/** @format */

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gameStatusLabels } from '@/lib/data/content';
import type { Game } from '@/types';

interface ComingSoonCardProps {
  game: Game;
  index: number;
}

/**
 * Concept-stage title card — deliberately quieter than the in-development
 * panels: no art, just type, atmosphere, and a cursor-following spotlight
 * that gives the grid a premium tactility on hover.
 */
export function ComingSoonCard({ game, index }: ComingSoonCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Link href={`/games/${game.slug}`} className="cursor-target group block h-full">
      <article
        ref={cardRef}
        onMouseMove={onMouseMove}
        className="relative flex h-full flex-col overflow-hidden border border-brand-white/8 bg-brand-white/2 p-8 transition-colors duration-500 group-hover:border-brand-orange/30 md:p-10"
      >
        {/* Cursor spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(245,138,31,0.08), transparent 70%)',
          }}
        />

        {/* Oversized numeral, echoing the featured panels' chapter marks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem] leading-none font-black text-brand-white/6 select-none transition-colors duration-500 group-hover:text-brand-white/10"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative flex h-full flex-col">
          <span className="inline-flex w-fit items-center border border-brand-white/15 px-3 py-1 label-overline text-[10px] text-brand-white/50">
            {gameStatusLabels[game.status] ?? 'Planned'}
          </span>

          <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-brand-white transition-colors duration-300 group-hover:text-brand-orange md:text-3xl">
            {game.title}
          </h3>
          <p className="mt-2 font-accent text-[10px] tracking-[0.26em] text-brand-secondary uppercase">
            {game.genre}
          </p>

          <p className="mt-5 flex-1 text-sm leading-7 text-brand-grey">
            {game.concept ?? game.description}
          </p>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-brand-white/8 pt-5">
            <span className="font-accent text-[10px] tracking-[0.22em] text-brand-white/40 uppercase">
              {game.platforms.join(' · ')} · {game.engine}
            </span>
            <span
              className="text-brand-white/35 transition-[color,transform] duration-300 group-hover:translate-x-1.5 group-hover:text-brand-orange"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
