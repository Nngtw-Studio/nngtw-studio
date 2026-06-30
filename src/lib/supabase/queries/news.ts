import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { newsArticles } from "@/lib/data/content";
import type { NewsArticle } from "@/types";

interface StudioNewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published_at: string;
  featured: boolean;
}

function mapArticle(row: StudioNewsRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category as NewsArticle["category"],
    publishedAt: row.published_at,
    featured: row.featured ?? false,
  };
}

const COLUMNS =
  "id, slug, title, excerpt, content, category, published_at, featured";

/** All published articles — used for news listing page and generateStaticParams */
export async function getAllNews(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return newsArticles;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_news_articles")
      .select(COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error || !data?.length) return newsArticles;
    return data.map(mapArticle);
  } catch {
    return newsArticles;
  }
}

/** Latest N articles — used on the homepage */
export async function getLatestNews(limit = 4): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return newsArticles.slice(0, limit);

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_news_articles")
      .select(COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) return newsArticles.slice(0, limit);
    return data.map(mapArticle);
  } catch {
    return newsArticles.slice(0, limit);
  }
}

/** Single article by slug — used for article detail pages */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) {
    return newsArticles.find((a) => a.slug === slug) ?? null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("studio_news_articles")
      .select(COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return newsArticles.find((a) => a.slug === slug) ?? null;
    return mapArticle(data as StudioNewsRow);
  } catch {
    return newsArticles.find((a) => a.slug === slug) ?? null;
  }
}
