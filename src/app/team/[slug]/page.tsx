/** @format */

import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { getTeamMembers } from '@/lib/supabase/queries/team';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Matches "/team/lenin" against a member's first name — best-effort only,
 *  this page never 404s since the whole point is a friendly placeholder. */
async function findMemberBySlug(slug: string) {
  const members = await getTeamMembers();
  return members.find((m) => m.name.toLowerCase().startsWith(slug.toLowerCase()));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);
  return { title: member ? `${member.name} — Coming Soon` : 'Coming Soon' };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <FadeIn>
        <p className="label-overline text-brand-orange">
          {member ? member.role : 'Team Profile'}
        </p>
        <h1 className="editorial-heading mt-4 text-5xl text-brand-white md:text-7xl">
          {member ? member.name : 'Coming Soon'}
        </h1>
        <p className="mt-6 max-w-md text-sm text-brand-grey">
          {member
            ? `${member.name.split(' ')[0]}'s full profile is on its way. Check back soon.`
            : "This profile hasn't been published yet."}
        </p>
        <div className="mt-10">
          <Button href="/studio" variant="primary">
            Back to Studio
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
