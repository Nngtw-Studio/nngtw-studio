import { createClient } from "@/lib/supabase/server";

export interface AdminNewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published_at: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminNews(): Promise<AdminNewsRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_news_articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminNewsById(id: string): Promise<AdminNewsRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_news_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
