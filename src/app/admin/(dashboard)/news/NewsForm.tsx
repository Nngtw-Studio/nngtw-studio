"use client";

import { useActionState } from "react";
import { createArticle, updateArticle, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminNewsRow } from "@/lib/supabase/queries/admin/news";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function NewsForm({ article }: { article?: AdminNewsRow }) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      {article && (
        <div className={blockClass}>
          <label className={labelClass}>Slug</label>
          <p className="text-sm text-brand-grey">{article.slug}</p>
        </div>
      )}

      <div className={blockClass}>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={article?.title} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={8} defaultValue={article?.content} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="category">Category</label>
        <select id="category" name="category" defaultValue={article?.category ?? "studio-news"} className={fieldClass}>
          <option value="development-log">Development Logs</option>
          <option value="game-update">Game Updates</option>
          <option value="studio-news">Studio News</option>
          <option value="technology">Technology</option>
          <option value="announcement">Announcements</option>
        </select>
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="published_at">Published At</label>
        <input
          id="published_at"
          name="published_at"
          type="date"
          defaultValue={article?.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
          className={fieldClass}
        />
      </div>

      <div className={`${blockClass} flex flex-wrap gap-6`}>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="published" defaultChecked={article?.published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="featured" defaultChecked={article?.featured} />
          Featured
        </label>
      </div>

      <SubmitButton label={article ? "Save Changes" : "Create Article"} />
    </form>
  );
}
