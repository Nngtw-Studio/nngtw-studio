/** @format */

import Link from 'next/link';
import type { FeaturedGame } from '@/types';
import { FadeIn } from '@/components/motion/FadeIn';
import { GameShowcaseCard } from '@/components/sections/GameShowcaseCard';

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  if (!games.length) return null;

  return (
    <section
      id="featured-games"
      className="relative overflow-hidden border-t border-brand-white/5 bg-brand-black"
      aria-label="Featured games"
    >
      {/* Ambient lighting rig — echoes the hero and sibling sections so the
          showcase reads as part of the same world, not a bolted-on carousel. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 10% 8%, rgba(245,138,31,0.07), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 92%, rgba(223,19,138,0.08), transparent 68%)',
        }}
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        {/* Section header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <FadeIn className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-orange">Featured</p>
            </div>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              Games we&rsquo;re
              <br />
              bringing to life.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="text-base leading-8 text-brand-grey">
              Original titles in active development, each built with the same obsession for
              craft, feel, and long-term community.
            </p>
          </FadeIn>
        </div>

        {/* Showcase rows */}
        <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-36">
          {games.map((game, index) => (
            <GameShowcaseCard key={game.id} game={game} index={index} />
          ))}
        </div>

        {/* View all link */}
        <FadeIn className="mt-20 flex justify-center md:mt-28">
          <Link
            href="/games"
            className="cursor-target group inline-flex items-center gap-4 border border-brand-white/15 px-8 py-4 label-overline text-brand-white transition-colors duration-300 hover:border-brand-orange/60 hover:text-brand-orange"
          >
            View All Projects
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
