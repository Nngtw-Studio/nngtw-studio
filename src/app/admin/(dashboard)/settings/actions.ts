"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string; success?: undefined } | { error?: undefined; success?: boolean };

export async function upsertSettings(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const rows = [
    { key: "studio_name", value: String(formData.get("studio_name") ?? "") },
    { key: "tagline", value: String(formData.get("tagline") ?? "") },
    { key: "contact_email", value: String(formData.get("contact_email") ?? "") },
    { key: "site_url", value: String(formData.get("site_url") ?? "") },
  ];

  const { error } = await supabase.from("studio_settings").upsert(rows, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}
