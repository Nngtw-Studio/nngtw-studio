/** @format */

import { FadeIn } from '@/components/motion/FadeIn';
import { TeamShowcase } from '@/components/sections/TeamShowcase';
import { getTeamMembers } from '@/lib/supabase/queries/team';

export async function TeamSection() {
  const teamMembers = await getTeamMembers();
  if (teamMembers.length === 0) return null;

  return (
    <section
      id="team"
      className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black"
    >
      {/* Ambient treatment — a faint brand-orange bloom behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-140 w-140 rounded-full bg-brand-orange/5 blur-[140px]"
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <TeamShowcase members={teamMembers} />
        </FadeIn>
      </div>
    </section>
  );
}
