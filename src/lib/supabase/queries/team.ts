import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { teamMembers } from "@/lib/data/content";
import type { TeamMember } from "@/types";

interface StudioTeamRow {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  order: number;
}

function mapMember(row: StudioTeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio ?? undefined,
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
      .select("id, name, role, bio, avatar_url, order")
      .eq("visible", true)
      .order("order", { ascending: true });

    if (error || !data?.length) return teamMembers;
    return data.map(mapMember);
  } catch {
    return teamMembers;
  }
}
