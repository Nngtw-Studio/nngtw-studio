/** @format */

import Link from 'next/link';
import type { FeaturedGame } from '@/types';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { FeaturedGameTile } from '@/components/sections/FeaturedGameTile';

interface FeaturedGamesShowcaseProps {
  games: FeaturedGame[];
}

/**
 * Single-screen showcase: a compact editorial header row plus a grid of
 * key-art tiles. Adding more featured games tightens the grid rather than
 * lengthening the page — the section never exceeds one viewport by design.
 * Deliberately its own layout, distinct from the Games page's full
 * alternating showcase (GameShowcaseCard) — the two never share a section.
 */
export function FeaturedGamesShowcase({ games }: FeaturedGamesShowcaseProps) {
  if (!games.length) return null;

  return (
    <section
      id="featured-games"
      className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black"
      aria-label="Featured games"
    >
      {/* Ambient lighting rig — echoes the hero so the section reads as part of the same world */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 10% 8%, rgba(245,138,31,0.07), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 92%, rgba(223,19,138,0.08), transparent 68%)',
        }}
      />

      <div className="relative mx-auto flex min-h-svh max-w-[1600px] flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-20 xl:px-28">
        {/* Header row — label + heading left, support copy + view-all right */}
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
              <p className="max-w-sm text-sm leading-7 text-brand-grey lg:text-right">
                Original titles in active development, built with the same obsession for
                craft, feel, and community.
              </p>
              <Link
                href="/games"
                className="cursor-target group inline-flex items-center gap-3 label-overline text-brand-white/70 transition-colors duration-300 hover:text-brand-orange"
              >
                View All Projects
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Card grid — grows sideways, never downward */}
        <StaggerContainer className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {games.map((game, index) => (
            <StaggerItem key={game.id}>
              <FeaturedGameTile game={game} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
