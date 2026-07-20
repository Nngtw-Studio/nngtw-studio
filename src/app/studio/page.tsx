/** @format */

import type { Metadata } from 'next';
import { StudioHero } from '@/components/sections/StudioHero';
import { StudioStory } from '@/components/sections/StudioStory';
import { StudioPhilosophy } from '@/components/sections/StudioPhilosophy';
import { StudioProcess } from '@/components/sections/StudioProcess';
import { StudioRoadmap } from '@/components/sections/StudioRoadmap';
import { StudioTeam } from '@/components/sections/StudioTeam';
import { StudioCTA } from '@/components/sections/StudioCTA';
import { getTeamMembers } from '@/lib/supabase/queries/team';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Who we are, what we stand for, how we work, and the people behind Nngtw Studio — an independent game company building original worlds.',
};

/**
 * The Studio page as a narrative arc:
 * identity → vision & mission → values → process → roadmap → people → join.
 */
export default async function StudioPage() {
  const teamMembers = await getTeamMembers();

  return (
    <>
      <StudioHero teamCount={teamMembers.length} />
      <StudioStory />
      <StudioPhilosophy />
      <StudioProcess />
      <StudioRoadmap />
      <StudioTeam members={teamMembers} />
      <StudioCTA />
    </>
  );
}
