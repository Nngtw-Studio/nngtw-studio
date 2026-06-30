import { allGames, gameStatusLabels } from "@/lib/data/content";

export default function AdminGamesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Games</h1>
          <p className="mt-2 text-sm text-brand-grey">Manage active and planned game projects.</p>
        </div>
        <button className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase">
          Add Game
        </button>
      </div>

      <div className="space-y-3">
        {allGames.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between border border-brand-white/5 p-4"
          >
            <div>
              <h3 className="text-sm text-brand-white">{game.title}</h3>
              <p className="text-xs text-brand-grey">
                {game.genre} · {gameStatusLabels[game.status]}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white">Edit</button>
              <button className="px-3 py-1 text-xs text-red-400/60 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
