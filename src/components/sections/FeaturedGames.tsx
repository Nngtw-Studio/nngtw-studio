import { getFeaturedGames } from "@/lib/supabase/queries/featured-games";
import { FeaturedGamesShowcase } from "@/components/sections/FeaturedGamesShowcase";

export async function FeaturedGames() {
  const games = await getFeaturedGames();
  return <FeaturedGamesShowcase games={games} />;
}
