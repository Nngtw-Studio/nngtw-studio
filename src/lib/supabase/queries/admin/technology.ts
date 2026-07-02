import { createClient } from "@/lib/supabase/server";

export interface AdminTechnologyCategoryRow {
  id: string;
  title: string;
  description: string | null;
  items: string[];
  order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminTechnologyCategories(): Promise<AdminTechnologyCategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_technology_categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminTechnologyCategoryById(id: string): Promise<AdminTechnologyCategoryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_technology_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
