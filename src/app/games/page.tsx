/** @format */

import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import {
  activeGames,
  plannedGames,
  gameStatusLabels,
} from '@/lib/data/content';
import { SOCIAL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Games',
  description:
    'Explore games in active development and planned projects from NNGTW Studio.',
};

export default function GamesPage() {
  return (
    <>
      <PageHeader
        label="Projects"
        title="Games"
        description="Original titles in active development and future concepts from NNGTW Studio."
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-12">
            <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
              Currently Developing
            </h2>
            <p className="mt-3 text-sm leading-7 text-brand-grey">
              Active projects with ongoing development.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-8 lg:grid-cols-2">
          {activeGames.map((game) => (
            <StaggerItem key={game.id}>
              <Link href={`/games/${game.slug}`} className="group block">
                <article className="border border-brand-white/5 transition-colors hover:border-brand-orange/20">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-orange/10 to-brand-black">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-5xl tracking-[0.06em] text-brand-white/5 uppercase">
                        {game.title.split(' ')[0]}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
                    <div className="absolute right-0 bottom-0 left-0 p-8">
                      <span className="font-secondary text-[10px] tracking-[0.2em] text-brand-orange uppercase">
                        {gameStatusLabels[game.status]}
                      </span>
                      <h3 className="mt-2 font-display text-3xl tracking-[0.02em] text-brand-white uppercase">
                        {game.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-sm leading-8 text-brand-grey">
                      {game.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4 font-secondary text-xs tracking-[0.2em] text-brand-grey uppercase">
                      <span>{game.genre}</span>
                      <span className="text-brand-white/20">·</span>
                      <span>{game.platforms.join(', ')}</span>
                      <span className="text-brand-white/20">·</span>
                      <span>{game.engine}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-32">
          <div className="mb-12">
            <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
              Planned Projects
            </h2>
            <p className="mt-3 text-sm leading-7 text-brand-grey">
              Future titles in concept and planning stages. No release dates —
              just vision.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plannedGames.map((game) => (
            <StaggerItem key={game.id}>
              <Link href={`/games/${game.slug}`} className="group block h-full">
                <article className="flex h-full flex-col border border-brand-white/5 p-8 transition-colors hover:border-brand-white/15">
                  <span className="font-secondary text-[10px] tracking-[0.2em] text-brand-grey uppercase">
                    {gameStatusLabels[game.status]}
                  </span>
                  <h3 className="mt-3 font-display text-xl tracking-[0.02em] text-brand-white uppercase transition-colors group-hover:text-brand-orange">
                    {game.title}
                  </h3>
                  <p className="mt-1 font-secondary text-xs tracking-[0.2em] text-brand-orange uppercase">
                    {game.genre}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-8 text-brand-grey">
                    {game.concept ?? game.description}
                  </p>
                  <div className="mt-6 font-secondary text-xs tracking-[0.2em] text-brand-grey uppercase">
                    {game.platforms.join(' · ')} · {game.engine}
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-20 text-center">
          <p className="mb-6 text-sm leading-7 text-brand-grey">
            Want to follow development and share feedback?
          </p>
          <Button href={SOCIAL.discord} variant="discord" external>
            Join Discord
          </Button>
        </FadeIn>
      </section>
    </>
  );
}
