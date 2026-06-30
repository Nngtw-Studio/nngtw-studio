import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { technologyCategories } from "@/lib/data/content";
import type { TechnologyCategory } from "@/types";

interface StudioTechRow {
  id: string;
  title: string;
  description: string | null;
  items: string[];
}

function mapCategory(row: StudioTechRow): TechnologyCategory {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    items: row.items ?? [],
  };
}

/** All visible technology categories ordered by display order */
export async function getTechnologyCategories(): Promise<TechnologyCategory[]> {
  if (!isSupabaseConfigured()) return technologyCategories;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_technology_categories")
      .select("id, title, description, items")
      .eq("visible", true)
      .order("order", { ascending: true });

    if (error || !data?.length) return technologyCategories;
    return data.map(mapCategory);
  } catch {
    return technologyCategories;
  }
}
