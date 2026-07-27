import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { careers } from "@/lib/data/content";
import type { Career, CareerStatus } from "@/types";

/**
 * Reads `public.careers` — the table the admin's Careers module owns
 * (nngtw-admin/supabase/migrations/0005_careers.sql). Two state columns
 * matter here and they are not the same thing:
 *
 *   status        — editorial. Only 'published' rows are readable at all;
 *                   that's enforced by the table's RLS policy, not by
 *                   this file, so a draft can't leak even if a query
 *                   here forgot to filter.
 *   hiring_status — candidate-facing. Maps 1:1 onto the site's
 *                   CareerStatus union and drives the badge and which
 *                   band the role renders in.
 *
 * Every function falls back to the hardcoded roster in
 * `lib/data/content.ts` when Supabase is unconfigured or returns
 * nothing, so the site still renders a full careers page against an
 * empty database.
 */

interface CareerRow {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  hiring_status: string;
  description: string;
  requirements: string[];
  apply_url: string | null;
}

function mapCareer(row: CareerRow): Career {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.employment_type,
    status: row.hiring_status as CareerStatus,
    description: row.description,
    requirements: row.requirements ?? [],
    applyUrl: row.apply_url ?? null,
  };
}

const COLUMNS =
  "id, slug, title, department, location, employment_type, hiring_status, description, requirements, apply_url";

/** All live careers — used for the careers listing page and generateStaticParams */
export async function getAllCareers(): Promise<Career[]> {
  if (!isSupabaseConfigured()) return careers;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("careers")
      .select(COLUMNS)
      .eq("status", "published")
      .neq("hiring_status", "closed")
      .order("position", { ascending: true });

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
      .from("careers")
      .select(COLUMNS)
      .eq("status", "published")
      .neq("hiring_status", "closed")
      .order("position", { ascending: true })
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
      .from("careers")
      .select(COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return careers.find((c) => c.slug === slug) ?? null;
    return mapCareer(data as CareerRow);
  } catch {
    return careers.find((c) => c.slug === slug) ?? null;
  }
}
