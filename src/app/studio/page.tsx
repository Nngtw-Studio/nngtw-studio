/** @format */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/FadeIn';
import { studioContent } from '@/lib/data/content';
import { getTeamMembers } from '@/lib/supabase/queries/team';
import { getPhilosophyValues } from '@/lib/supabase/queries/philosophy';
import { BRAND_ASSETS } from '@/lib/brand';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Learn about NNGTW Studio — our vision, mission, values, team, and long-term goals.',
};

export default async function StudioPage() {
  const [teamMembers, values] = await Promise.all([
    getTeamMembers(),
    getPhilosophyValues(),
  ]);

  return (
    <>
      <PageHeader
        label="About"
        title="The Studio"
        description="An independent game development company with a clear long-term vision for immersive interactive experiences."
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <FadeIn className="mb-20">
          <img
            src={BRAND_ASSETS.primaryLogoTagline}
            alt="NNGTW Studio"
            className="h-20 w-auto"
          />
        </FadeIn>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <div>
              <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
                Vision
              </h2>
              <p className="mt-6 text-base leading-8 text-brand-grey md:text-lg">
                {studioContent.vision}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
                Mission
              </h2>
              <p className="mt-6 text-base leading-8 text-brand-grey md:text-lg">
                {studioContent.mission}
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-24">
          <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
            Values
          </h2>
          <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.id}>
                <div className="border border-brand-white/5 p-8">
                  <h3 className="font-display text-sm tracking-[0.08em] text-brand-orange uppercase">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-brand-grey">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>

        <FadeIn className="mt-24">
          <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
            Development Philosophy
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-brand-grey md:text-lg">
            {studioContent.developmentPhilosophy}
          </p>
        </FadeIn>

        <FadeIn className="mt-24">
          <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
            Long-term Goals
          </h2>
          <ul className="mt-8 space-y-4">
            {studioContent.longTermGoals.map((goal, i) => (
              <li
                key={i}
                className="flex items-start gap-4 text-base text-brand-grey"
              >
                <span className="mt-2 h-px w-6 shrink-0 bg-brand-orange" />
                {goal}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="mt-24">
          <h2 className="font-display text-2xl tracking-[0.02em] text-brand-white uppercase md:text-3xl">
            Team
          </h2>
          <p className="mt-4 text-sm text-brand-grey">
            A small, focused team with room to grow.
          </p>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <StaggerItem key={member.id}>
                <div className="glass-panel p-8">
                  <div className="mb-4 h-px w-8 bg-brand-orange" />
                  <h3 className="font-display text-sm tracking-[0.08em] text-brand-white uppercase">
                    {member.role}
                  </h3>
                  {member.bio && (
                    <p className="mt-3 text-sm leading-7 text-brand-grey">
                      {member.bio}
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      </section>
    </>
  );
}
