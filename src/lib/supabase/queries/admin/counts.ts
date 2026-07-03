import { createClient } from "@/lib/supabase/server";

export interface AdminCounts {
  games: number;
  news: number;
  careers: number;
  pendingApplications: number;
}

export async function getAdminCounts(): Promise<AdminCounts> {
  const supabase = await createClient();

  const [games, news, careers, pendingApplications] = await Promise.all([
    supabase.from("studio_games").select("*", { count: "exact", head: true }),
    supabase.from("studio_news_articles").select("*", { count: "exact", head: true }),
    supabase.from("studio_careers").select("*", { count: "exact", head: true }),
    supabase.from("studio_career_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    games: games.count ?? 0,
    news: news.count ?? 0,
    careers: careers.count ?? 0,
    pendingApplications: pendingApplications.count ?? 0,
  };
}
