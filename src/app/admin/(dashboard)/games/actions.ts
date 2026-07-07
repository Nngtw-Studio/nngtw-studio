"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionResult = { error: string } | { error?: undefined };

function gameFieldsFromFormData(formData: FormData) {
  return {
    genre: String(formData.get("genre") ?? ""),
    engine: String(formData.get("engine") ?? ""),
    status: String(formData.get("status") ?? "planned"),
    description: String(formData.get("description") ?? ""),
    trailer_url: String(formData.get("trailer_url") ?? "").trim() || null,
    banner_image_url: String(formData.get("banner_image_url") ?? "").trim() || null,
    platforms: String(formData.get("platforms") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    active_development: formData.get("active_development") === "on",
  };
}

export async function createGame(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("studio_games").insert({
    slug: slugify(title),
    title,
    ...gameFieldsFromFormData(formData),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/games");
  revalidatePath("/games");
  redirect("/admin/games");
}

export async function updateGame(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { data: existing } = await supabase
    .from("studio_games")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("studio_games")
    .update({
      title,
      ...gameFieldsFromFormData(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/games");
  revalidatePath("/games");
  if (existing?.slug) revalidatePath(`/games/${existing.slug}`);
  redirect("/admin/games");
}

export async function deleteGame(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_games").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/games");
  revalidatePath("/games");
  return {};
}
