import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { careers } from "@/lib/data/content";
import type { Career, CareerStatus } from "@/types";

interface StudioCareerRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description: string;
  requirements: string[];
}

function mapCareer(row: StudioCareerRow): Career {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    status: row.status as CareerStatus,
    description: row.description,
    requirements: row.requirements ?? [],
  };
}

const COLUMNS =
  "id, slug, title, department, location, type, status, description, requirements";

/** All published careers — used for careers listing page and generateStaticParams */
export async function getAllCareers(): Promise<Career[]> {
  if (!isSupabaseConfigured()) return careers;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_careers")
      .select(COLUMNS)
      .eq("published", true)
      .order("order", { ascending: true });

    if (error || !data?.length) return careers;
    return data.map(mapCareer);
  } catch {
    return careers;
  }
}

/** Non-closed careers up to a limit — used on the homepage */
export async function getActiveCareers(limit = 6): Promise<Career[]> {
  if (!isSupabaseConfigured()) {
    return careers.filter((c) => c.status !== "closed").slice(0, limit);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_careers")
      .select(COLUMNS)
      .eq("published", true)
      .neq("status", "closed")
      .order("order", { ascending: true })
      .limit(limit);

    if (error || !data?.length) {
      return careers.filter((c) => c.status !== "closed").slice(0, limit);
    }
    return data.map(mapCareer);
  } catch {
    return careers.filter((c) => c.status !== "closed").slice(0, limit);
  }
}

/** Single career by slug — used for career detail pages */
export async function getCareerBySlug(slug: string): Promise<Career | null> {
  if (!isSupabaseConfigured()) {
    return careers.find((c) => c.slug === slug) ?? null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_careers")
      .select(COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return careers.find((c) => c.slug === slug) ?? null;
    return mapCareer(data as StudioCareerRow);
  } catch {
    return careers.find((c) => c.slug === slug) ?? null;
  }
}
