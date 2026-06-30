import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { philosophyValues } from "@/lib/data/content";
import type { PhilosophyValue } from "@/types";

interface StudioPhilosophyRow {
  id: string;
  title: string;
  description: string;
}

function mapValue(row: StudioPhilosophyRow): PhilosophyValue {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
  };
}

/** All visible philosophy values ordered by display order */
export async function getPhilosophyValues(): Promise<PhilosophyValue[]> {
  if (!isSupabaseConfigured()) return philosophyValues;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_philosophy_values")
      .select("id, title, description")
      .eq("visible", true)
      .order("order", { ascending: true });

    if (error || !data?.length) return philosophyValues;
    return data.map(mapValue);
  } catch {
    return philosophyValues;
  }
}
