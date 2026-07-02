import { createClient } from "@/lib/supabase/server";

export interface AdminTeamMemberRow {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminTeamMembers(): Promise<AdminTeamMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_team_members")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminTeamMemberById(id: string): Promise<AdminTeamMemberRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_team_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
