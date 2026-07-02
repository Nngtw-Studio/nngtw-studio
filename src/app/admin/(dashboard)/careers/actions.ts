"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionResult = { error: string } | { error?: undefined };

function careerFieldsFromFormData(formData: FormData) {
  return {
    department: String(formData.get("department") ?? ""),
    location: String(formData.get("location") ?? ""),
    type: String(formData.get("type") ?? ""),
    status: String(formData.get("status") ?? "future"),
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    order: Number(formData.get("order") ?? 0),
    published: formData.get("published") === "on",
  };
}

export async function createCareer(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { error } = await supabase.from("studio_careers").insert({
    slug: slugify(title),
    title,
    ...careerFieldsFromFormData(formData),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers");
}

export async function updateCareer(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const { data: existing } = await supabase
    .from("studio_careers")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("studio_careers")
    .update({
      title,
      ...careerFieldsFromFormData(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  if (existing?.slug) revalidatePath(`/careers/${existing.slug}`);
  redirect("/admin/careers");
}

export async function deleteCareer(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_careers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  return {};
}
