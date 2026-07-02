import { createClient } from "@/lib/supabase/server";

export interface AdminGameRow {
  id: string;
  slug: string;
  title: string;
  genre: string;
  platforms: string[];
  engine: string;
  status: string;
  description: string;
  featured: boolean;
  active_development: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/** All games, all statuses, published or not — admin list view */
export async function getAdminGames(): Promise<AdminGameRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_games")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Single game by id — admin edit form */
export async function getAdminGameById(id: string): Promise<AdminGameRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_games")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
