"use client";

import { useActionState } from "react";
import { createGame, updateGame, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminGameRow } from "@/lib/supabase/queries/admin/games";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function GameForm({ game }: { game?: AdminGameRow }) {
  const action = game ? updateGame.bind(null, game.id) : createGame;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      {game && (
        <div className={blockClass}>
          <label className={labelClass}>Slug</label>
          <p className="text-sm text-brand-grey">{game.slug}</p>
        </div>
      )}

      <div className={blockClass}>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={game?.title} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="genre">Genre</label>
        <input id="genre" name="genre" defaultValue={game?.genre} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="engine">Engine</label>
        <input id="engine" name="engine" defaultValue={game?.engine} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={game?.status ?? "planned"} className={fieldClass}>
          <option value="in-development">In Development</option>
          <option value="planned">Planned</option>
          <option value="released">Released</option>
          <option value="concept">Concept</option>
        </select>
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={game?.description}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="platforms">Platforms (comma-separated)</label>
        <input
          id="platforms"
          name="platforms"
          defaultValue={game?.platforms?.join(", ")}
          placeholder="PC, Mobile, XR"
          className={fieldClass}
        />
      </div>

      <div className={`${blockClass} flex flex-wrap gap-6`}>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="published" defaultChecked={game?.published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="featured" defaultChecked={game?.featured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="active_development" defaultChecked={game?.active_development} />
          Active Development
        </label>
      </div>

      <SubmitButton label={game ? "Save Changes" : "Create Game"} />
    </form>
  );
}
