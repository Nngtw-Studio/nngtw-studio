import { createClient } from "@/lib/supabase/server";

export interface AdminCareerRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description: string;
  requirements: string[];
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export async function getAdminCareers(): Promise<AdminCareerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_careers")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminCareerById(id: string): Promise<AdminCareerRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_careers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
