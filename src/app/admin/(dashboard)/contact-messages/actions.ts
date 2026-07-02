"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { error?: undefined };

export async function toggleMessageRead(id: string, current: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("studio_contact_messages")
    .update({ read: !current })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/contact-messages");
  return {};
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/contact-messages");
  return {};
}
