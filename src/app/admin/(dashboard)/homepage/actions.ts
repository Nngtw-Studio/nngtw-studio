"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string; success?: undefined } | { error?: undefined; success?: boolean };

export async function updateHomepageContent(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const content = {
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    ctaPrimaryLabel: String(formData.get("ctaPrimaryLabel") ?? ""),
    ctaPrimaryHref: String(formData.get("ctaPrimaryHref") ?? ""),
    ctaSecondaryLabel: String(formData.get("ctaSecondaryLabel") ?? ""),
    ctaSecondaryHref: String(formData.get("ctaSecondaryHref") ?? ""),
  };

  const { error } = await supabase
    .from("studio_pages")
    .update({
      content,
      seo_title: String(formData.get("seo_title") ?? ""),
      seo_description: String(formData.get("seo_description") ?? ""),
      og_image: String(formData.get("og_image") ?? "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", "homepage");

  if (error) return { error: error.message };

  revalidatePath("/admin/homepage");
  return { success: true };
}
