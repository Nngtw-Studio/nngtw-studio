/** @format */

import type { Metadata } from 'next';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { GamesHero } from '@/components/games/GamesHero';
import { GamesSectionNav } from '@/components/games/GamesSectionNav';
import { GameShowcaseCard } from '@/components/sections/GameShowcaseCard';
import { ComingSoonCard } from '@/components/games/ComingSoonCard';
import { LifeAppsSection } from '@/components/games/LifeAppsSection';
import { CtaButton } from '@/components/ui/CtaButton';
import { getActiveGames, getPlannedGames } from '@/lib/supabase/queries/games';
import { SOCIAL } from '@/lib/constants';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Games',
  description:
    'Explore Nngtw Studio’s worlds — King Summon and Arithmetic Destination in active development, concept titles on the horizon, and gamified life apps beyond.',
};

export default async function GamesPage() {
  const [activeGames, plannedGames] = await Promise.all([
    getActiveGames(),
    getPlannedGames(),
  ]);

  const navItems = [
    ...(activeGames.length
      ? [{ id: 'in-development', label: 'In Development', count: activeGames.length }]
      : []),
    ...(plannedGames.length
      ? [{ id: 'coming-soon', label: 'Coming Soon', count: plannedGames.length }]
      : []),
    { id: 'life-apps', label: 'Life Apps' },
  ];

  return (
    <>
      <GamesHero games={activeGames} conceptCount={plannedGames.length} />
      <GamesSectionNav items={navItems} />

      {/* ── In Development ─────────────────────────────────────────────── */}
      {activeGames.length > 0 && (
        <section
          id="in-development"
          aria-label="Games in active development"
          className="relative snap-start scroll-mt-36 overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 10% 8%, rgba(245,138,31,0.07), transparent 65%), radial-gradient(ellipse 55% 50% at 95% 92%, rgba(223,19,138,0.08), transparent 68%)',
            }}
          />

          <div className="section-padding relative mx-auto max-w-[1600px]">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <FadeIn className="lg:col-span-7">
                <div className="mb-8 flex items-center gap-4">
                  <div className="accent-line" />
                  <p className="label-overline text-brand-orange">Now in Development</p>
                </div>
                <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                  Built in
                  <br />
                  the open.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-2">
                <p className="text-base leading-8 text-brand-grey">
                  Two original titles moving from prototype to polish — shaped in
                  public, with our community playing, breaking, and steering every
                  milestone.
                </p>
              </FadeIn>
            </div>

            {/* Same showcase treatment as the homepage's Featured section */}
            <div className="mt-20 flex flex-col gap-28 md:mt-28 md:gap-36">
              {activeGames.map((game, index) => (
                <GameShowcaseCard key={game.id} game={game} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Coming Soon ────────────────────────────────────────────────── */}
      {plannedGames.length > 0 && (
        <section
          id="coming-soon"
          aria-label="Planned games"
          className="relative snap-start scroll-mt-36 overflow-hidden border-t border-brand-white/5"
        >
          <div className="section-padding relative mx-auto max-w-[1600px]">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
              <FadeIn className="lg:col-span-7">
                <div className="mb-8 flex items-center gap-4">
                  <div className="accent-line" />
                  <p className="label-overline text-brand-orange">Coming Soon</p>
                </div>
                <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                  Worlds still
                  <br />
                  forming.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pb-2">
                <p className="text-base leading-8 text-brand-grey">
                  Concepts we return to between milestones — no dates, no
                  promises, just the directions we&rsquo;re dreaming in next.
                </p>
              </FadeIn>
            </div>

            <StaggerContainer className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
              {plannedGames.map((game, index) => (
                <StaggerItem key={game.id} className="h-full">
                  <ComingSoonCard game={game} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ── Gamified Life Apps ─────────────────────────────────────────── */}
      <LifeAppsSection />

      {/* ── Closing CTA ────────────────────────────────────────────────── */}
      <section
        aria-label="Follow development"
        className="relative snap-start overflow-hidden border-t border-brand-white/5"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 100%, rgba(245,138,31,0.07), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[1600px] px-6 py-24 text-center md:px-12 md:py-32 lg:px-20">
          <FadeIn>
            <p className="label-overline text-brand-orange">Stay Close</p>
            <h2 className="editorial-heading mx-auto mt-6 max-w-2xl text-4xl text-brand-white md:text-5xl">
              Be first into our worlds.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-brand-grey md:text-base">
              Playtests, dev logs, and every announcement land on Discord before
              anywhere else. Come build these worlds with us.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
              <CtaButton href={SOCIAL.discord} variant="discord" external>
                Join the Discord
              </CtaButton>
              <CtaButton href="/news" variant="secondary">
                Development News
              </CtaButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
