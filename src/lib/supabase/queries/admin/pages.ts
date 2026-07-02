import { createClient } from "@/lib/supabase/server";

export interface HomepageContent {
  heroSubtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export interface AdminHomepageRow {
  id: string;
  slug: string;
  content: HomepageContent;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
}

export async function getHomepagePage(): Promise<AdminHomepageRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("studio_pages")
    .select("id, slug, content, seo_title, seo_description, og_image")
    .eq("slug", "homepage")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as AdminHomepageRow | null;
}
