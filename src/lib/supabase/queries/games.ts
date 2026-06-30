import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { activeGames, allGames, plannedGames, newsArticles } from "@/lib/data/content";
import { SOCIAL } from "@/lib/constants";
import type { Game, GameStatus, NewsArticle } from "@/types";

interface StudioGameRow {
  id: string;
  slug: string;
  title: string;
  genre: string;
  platforms: string[];
  engine: string;
  status: string;
  description: string;
  concept: string | null;
  overview: string | null;
  featured: boolean;
  active_development: boolean;
  featured_order: number | null;
  trailer_url: string | null;
  banner_image_url: string | null;
  project_link: string | null;
  follow_link: string | null;
  gallery: unknown;
  roadmap: unknown;
  created_at: string;
  updated_at: string;
}

function mapGame(row: StudioGameRow): Game {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    genre: row.genre,
    platforms: row.platforms ?? [],
    engine: row.engine,
    status: row.status as GameStatus,
    description: row.description,
    concept: row.concept ?? undefined,
    overview: row.overview ?? undefined,
    featured: row.featured,
    activeDevelopment: row.active_development,
    featuredOrder: row.featured_order ?? 0,
    trailerUrl: row.trailer_url,
    bannerImageUrl: row.banner_image_url,
    projectLink: row.project_link ?? `/games/${row.slug}`,
    followLink: row.follow_link ?? SOCIAL.discord,
    gallery: (row.gallery as string[]) ?? [],
    roadmap: (row.roadmap as Array<{ phase: string; description: string }>) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All published games — used for generateStaticParams and games listing page */
export async function getAllGames(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return allGames;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_games")
      .select("*")
      .eq("published", true)
      .order("active_development", { ascending: false })
      .order("featured_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data?.length) return allGames;
    return data.map(mapGame);
  } catch {
    return allGames;
  }
}

/** Games currently in active development */
export async function getActiveGames(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return activeGames;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_games")
      .select("*")
      .eq("published", true)
      .eq("active_development", true)
      .order("featured_order", { ascending: true });

    if (error || !data?.length) return activeGames;
    return data.map(mapGame);
  } catch {
    return activeGames;
  }
}

/** Planned / concept games (not yet in active development) */
export async function getPlannedGames(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return plannedGames;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_games")
      .select("*")
      .eq("published", true)
      .eq("active_development", false)
      .order("created_at", { ascending: true });

    if (error || !data?.length) return plannedGames;
    return data.map(mapGame);
  } catch {
    return plannedGames;
  }
}

/** Single game by slug — used for game detail pages */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (!isSupabaseConfigured()) {
    return allGames.find((g) => g.slug === slug) ?? null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_games")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return allGames.find((g) => g.slug === slug) ?? null;
    return mapGame(data as StudioGameRow);
  } catch {
    return allGames.find((g) => g.slug === slug) ?? null;
  }
}

/** News articles related to a game — used on the game detail page */
export async function getRelatedNews(gameTitle: string): Promise<NewsArticle[]> {
  const keyword = gameTitle.split(" ")[0].toLowerCase();

  if (!isSupabaseConfigured()) {
    return newsArticles
      .filter(
        (n) =>
          n.title.toLowerCase().includes(keyword) ||
          n.category === "game-update" ||
          n.category === "development-log"
      )
      .slice(0, 3);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_news_articles")
      .select("id, slug, title, excerpt, content, category, published_at, featured")
      .eq("published", true)
      .or(`title.ilike.%${keyword}%,category.eq.game-update,category.eq.development-log`)
      .order("published_at", { ascending: false })
      .limit(3);

    if (error || !data?.length) {
      return newsArticles
        .filter(
          (n) =>
            n.title.toLowerCase().includes(keyword) ||
            n.category === "game-update" ||
            n.category === "development-log"
        )
        .slice(0, 3);
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category as NewsArticle["category"],
      publishedAt: row.published_at,
      featured: row.featured ?? false,
    }));
  } catch {
    return newsArticles
      .filter(
        (n) =>
          n.title.toLowerCase().includes(keyword) ||
          n.category === "game-update" ||
          n.category === "development-log"
      )
      .slice(0, 3);
  }
}
