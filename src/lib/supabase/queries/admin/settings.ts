import { createClient } from "@/lib/supabase/server";

export interface AdminSettings {
  studio_name: string;
  tagline: string;
  contact_email: string;
  site_url: string;
  discord_url: string;
}

const DEFAULTS: AdminSettings = {
  studio_name: "",
  tagline: "",
  contact_email: "",
  site_url: "",
  discord_url: "",
};

export async function getAdminSettings(): Promise<AdminSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("studio_settings").select("key, value");

  if (error) throw new Error(error.message);

  const settings = { ...DEFAULTS };
  for (const row of data ?? []) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = String(row.value ?? "");
    }
  }
  return settings;
}
