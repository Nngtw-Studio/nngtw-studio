"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string; success?: undefined } | { error?: undefined; success?: boolean };

export async function updateDiscordUrl(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const url = String(formData.get("discord_url") ?? "").trim();
  if (!url) return { error: "Discord invite URL is required." };

  const { error } = await supabase
    .from("studio_settings")
    .upsert({ key: "discord_url", value: url }, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/admin/discord");
  return { success: true };
}
