import { createClient } from "@/lib/supabase/server";

export interface AdminNavigationItemRow {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminNavigationItems(): Promise<AdminNavigationItemRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_navigation_items")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminNavigationItemById(id: string): Promise<AdminNavigationItemRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_navigation_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
