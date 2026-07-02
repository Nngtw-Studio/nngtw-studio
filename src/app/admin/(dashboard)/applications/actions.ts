"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { error?: undefined };

export async function updateApplicationStatus(id: string, status: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("studio_career_applications")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  return {};
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_career_applications").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  return {};
}
