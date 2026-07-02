import { createClient } from "@/lib/supabase/server";

export interface AdminApplicationRow {
  id: string;
  career_id: string | null;
  name: string;
  email: string;
  portfolio_url: string | null;
  message: string;
  status: string;
  created_at: string;
  studio_careers: { title: string } | null;
}

export async function getAdminApplications(): Promise<AdminApplicationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_career_applications")
    .select("*, studio_careers(title)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as AdminApplicationRow[]) ?? [];
}
