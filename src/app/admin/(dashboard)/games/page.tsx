import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminGames } from "@/lib/supabase/queries/admin/games";
import { gameStatusLabels } from "@/lib/data/content";
import { deleteGame } from "./actions";

export default async function AdminGamesPage() {
  const games = await getAdminGames();

  return (
    <div>
      <AdminPageHeader
        title="Games"
        description="Manage active and planned game projects."
        action={
          <Link
            href="/admin/games/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            Add Game
          </Link>
        }
      />

      <div className="space-y-3">
        {games.length === 0 && (
          <p className="text-sm text-brand-grey">No games yet. Click &quot;Add Game&quot; to create one.</p>
        )}
        {games.map((game) => (
          <div key={game.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div>
              <h3 className="text-sm text-brand-white">{game.title}</h3>
              <p className="text-xs text-brand-grey">
                {game.genre} · {gameStatusLabels[game.status] ?? game.status}
                {!game.published && " · Unpublished"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/games/${game.id}/edit`}
                className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteGame.bind(null, game.id)}
                confirmMessage={`Delete "${game.title}"? This cannot be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
