/** @format */

import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { getTeamMembers } from '@/lib/supabase/queries/team';

export async function AboutStudio() {
  const teamMembers = await getTeamMembers();
  const founder = teamMembers.find((m) => m.order === 1);
  const others = teamMembers.filter((m) => m.order !== 1);

  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div className="section-padding mx-auto max-w-[1600px]">

        {/* Studio intro — asymmetric 2-column */}
        <div className="grid gap-20 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-4">
            <p className="label-overline mb-8 text-brand-grey/60">About NNGTW Studio</p>
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
                NNGTW Studio is an independent game development company with a
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
                <p className="label-overline mb-4 text-brand-grey/60">The Team</p>
                <h3 className="editorial-heading text-3xl text-brand-white md:text-4xl">
                  Small team.
                  <br />
                  Big vision.
                </h3>
              </div>
            </div>
          </FadeIn>

          {/* Founder — featured, full-width */}
          {founder && (
            <FadeIn>
              <div className="mb-px grid lg:grid-cols-12">
                <div className="group lg:col-span-12 border border-brand-white/5 p-10 transition-colors duration-500 hover:border-brand-white/10 md:p-14">
                  <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-end">
                    <div className="lg:col-span-4">
                      <p className="label-overline text-brand-orange mb-6">
                        {founder.role}
                      </p>
                      <div className="h-px w-8 bg-brand-white/10" />
                    </div>
                    <div className="lg:col-span-7">
                      {founder.bio && (
                        <p className="text-base leading-9 text-brand-grey md:text-lg">
                          {founder.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Other team members — horizontal 3-col */}
          <StaggerContainer className="grid gap-px md:grid-cols-3">
            {others.map((member) => (
              <StaggerItem key={member.id}>
                <div className="group border border-brand-white/5 p-8 transition-colors duration-500 hover:border-brand-white/10 md:p-10 h-full">
                  <p className="label-overline text-brand-grey/50 mb-6">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-sm leading-8 text-brand-grey/60">
                      {member.bio}
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
