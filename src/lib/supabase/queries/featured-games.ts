import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fallbackFeaturedGames } from "@/lib/data/featured-games";
import { SOCIAL } from "@/lib/constants";
import type { FeaturedGame, GameStatus } from "@/types";

interface GameRow {
  id: string;
  slug: string;
  title: string;
  genre: string;
  platforms: string[];
  engine: string;
  status: string;
  description: string;
  trailer_url: string | null;
  banner_image_url: string | null;
  project_link: string | null;
  follow_link: string | null;
  featured_order: number | null;
}

function mapRow(row: GameRow): FeaturedGame {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    genre: row.genre,
    platforms: row.platforms ?? [],
    engine: row.engine,
    status: row.status as GameStatus,
    description: row.description,
    trailerUrl: row.trailer_url,
    bannerImageUrl: row.banner_image_url,
    projectLink: row.project_link ?? `/games/${row.slug}`,
    followLink: row.follow_link ?? SOCIAL.discord,
    featuredOrder: row.featured_order ?? 0,
  };
}

export async function getFeaturedGames(): Promise<FeaturedGame[]> {
  if (!isSupabaseConfigured()) {
    return fallbackFeaturedGames;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_games")
      .select(
        "id, slug, title, genre, platforms, engine, status, description, trailer_url, banner_image_url, project_link, follow_link, featured_order"
      )
      .eq("featured", true)
      .eq("active_development", true)
      .order("featured_order", { ascending: true });

    if (error || !data?.length) {
      return fallbackFeaturedGames;
    }

    return data.map(mapRow);
  } catch {
    return fallbackFeaturedGames;
  }
}
