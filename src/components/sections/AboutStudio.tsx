/** @format */

import { FadeIn } from '@/components/motion/FadeIn';
import { TeamShowcase } from '@/components/sections/TeamShowcase';
import { getTeamMembers } from '@/lib/supabase/queries/team';

export async function AboutStudio() {
  const teamMembers = await getTeamMembers();

  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div className="section-padding mx-auto max-w-[1600px]">

        {/* Studio intro — asymmetric 2-column */}
        <div className="grid gap-20 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-4">
            <div className="mb-8 flex items-center gap-4">
              <div className="accent-line" />
              <p className="label-overline text-brand-grey/60">About Nngtw Studio</p>
            </div>
            <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
              An independent
              <br />
              studio with
              <br />
              AAA ambitions.
            </h2>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-7 lg:col-start-6 lg:pt-4">
            <div className="space-y-7 text-base leading-9 text-brand-grey md:text-lg">
              <p>
                Nngtw Studio is an independent game development company with a
                clear long-term vision. We create original games for PC, mobile,
                and eventually XR platforms — built by a small but growing team
                with a belief that quality scales independently of budget.
              </p>
              <p>
                Our focus is on player-first experiences, fair monetization, and
                worlds that players want to return to. Independent studios can
                compete on craft, not just scale.
              </p>
              <p>
                Beyond games, we&apos;re gradually expanding into interactive
                applications, gamified digital experiences, and immersive
                technologies — XR, VR, and mixed reality are part of our
                long-term roadmap.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Team section */}
        <div className="mt-32">
          <FadeIn>
            <div className="mb-16 flex items-end justify-between border-b border-brand-white/5 pb-8">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="accent-line" />
                  <p className="label-overline text-brand-grey/60">The Team</p>
                </div>
                <h3 className="editorial-heading text-3xl text-brand-white md:text-4xl">
                  Small team.
                  <br />
                  Big vision.
                </h3>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <TeamShowcase members={teamMembers} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
