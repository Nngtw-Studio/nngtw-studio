import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStorageUrl } from "@/lib/brand";
import { teamMembers } from "@/lib/data/content";
import type { TeamMember } from "@/types";

interface StudioTeamRow {
  id: string;
  name: string;
  role: string;
  contribution: string | null;
  bio: string | null;
  /** Storage path relative to the nngtw-assets bucket, e.g. "profile/Nngtw_team/lenin.png" — never a full URL. */
  avatar_url: string | null;
  profile_url: string | null;
  contribution_weight: number | null;
  order: number;
}

function mapMember(row: StudioTeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    contribution: row.contribution ?? undefined,
    bio: row.bio ?? undefined,
    image: row.avatar_url ? getStorageUrl(row.avatar_url) : null,
    profileUrl: row.profile_url ?? undefined,
    contributionWeight: row.contribution_weight ?? 50,
    order: row.order,
  };
}

/** All visible team members ordered by display order */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return teamMembers;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_team_members")
      .select("id, name, role, contribution, bio, avatar_url, profile_url, contribution_weight, order")
      .eq("visible", true)
      .order("order", { ascending: true });

    if (error || !data?.length) return teamMembers;
    return data.map(mapMember);
  } catch {
    return teamMembers;
  }
}
