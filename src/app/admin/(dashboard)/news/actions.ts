"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionResult = { error: string } | { error?: undefined };

function newsFieldsFromFormData(formData: FormData) {
  return {
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "studio-news"),
    published_at: String(formData.get("published_at") ?? new Date().toISOString().slice(0, 10)),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createArticle(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("studio_news_articles").insert({
    slug: slugify(title),
    title,
    ...newsFieldsFromFormData(formData),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateArticle(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { data: existing } = await supabase
    .from("studio_news_articles")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("studio_news_articles")
    .update({
      title,
      ...newsFieldsFromFormData(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  if (existing?.slug) revalidatePath(`/news/${existing.slug}`);
  redirect("/admin/news");
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_news_articles").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/news");
  return {};
}
