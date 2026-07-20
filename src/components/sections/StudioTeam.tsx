/** @format */

import { FadeIn } from '@/components/motion/FadeIn';
import { TeamShowcase } from '@/components/sections/TeamShowcase';
import type { TeamMember } from '@/types';

/**
 * The people behind Nngtw — the interactive bento showcase, re-voiced for the
 * Studio narrative (on the home page it introduced the team; here it is the
 * payoff the whole page has been building toward).
 */
export function StudioTeam({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

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
          <TeamShowcase
            members={members}
            eyebrow="The People"
            title={
              <>
                The people
                <br />
                behind the worlds.
              </>
            }
            subtitle="Every discipline in-house — vision, engineering, art, and community."
          />
        </FadeIn>
      </div>
    </section>
  );
}
