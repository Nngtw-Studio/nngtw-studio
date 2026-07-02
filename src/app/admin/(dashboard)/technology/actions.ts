"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { error?: undefined };

function techFieldsFromFormData(formData: FormData) {
  return {
    description: String(formData.get("description") ?? ""),
    items: String(formData.get("items") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  };
}

function revalidateTechPaths() {
  revalidatePath("/admin/technology");
  revalidatePath("/");
  revalidatePath("/technology");
}

export async function createTechCategory(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("studio_technology_categories").insert({
    title,
    ...techFieldsFromFormData(formData),
  });

  if (error) return { error: error.message };

  revalidateTechPaths();
  redirect("/admin/technology");
}

export async function updateTechCategory(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { error } = await supabase
    .from("studio_technology_categories")
    .update({
      title,
      ...techFieldsFromFormData(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateTechPaths();
  redirect("/admin/technology");
}

export async function deleteTechCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_technology_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateTechPaths();
  return {};
}
