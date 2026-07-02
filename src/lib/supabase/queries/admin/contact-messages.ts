import { createClient } from "@/lib/supabase/server";

export interface AdminContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export async function getAdminContactMessages(): Promise<AdminContactMessageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
