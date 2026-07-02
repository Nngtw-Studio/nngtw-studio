import { createClient } from "@/lib/supabase/server";

export interface AdminCounts {
  games: number;
  news: number;
  careers: number;
  pendingApplications: number;
  unreadMessages: number;
}

export async function getAdminCounts(): Promise<AdminCounts> {
  const supabase = await createClient();

  const [games, news, careers, pendingApplications, unreadMessages] = await Promise.all([
    supabase.from("studio_games").select("*", { count: "exact", head: true }),
    supabase.from("studio_news_articles").select("*", { count: "exact", head: true }),
    supabase.from("studio_careers").select("*", { count: "exact", head: true }),
    supabase.from("studio_career_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("studio_contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
  ]);

  return {
    games: games.count ?? 0,
    news: news.count ?? 0,
    careers: careers.count ?? 0,
    pendingApplications: pendingApplications.count ?? 0,
    unreadMessages: unreadMessages.count ?? 0,
  };
}
