import { createClient } from "@/lib/supabase/server";

export interface AdminMediaRow {
  id: string;
  filename: string;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  context: string | null;
  created_at: string;
}

export async function getAdminMedia(): Promise<AdminMediaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
