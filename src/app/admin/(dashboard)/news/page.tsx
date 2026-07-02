import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminNews } from "@/lib/supabase/queries/admin/news";
import { newsCategoryLabels } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";
import { deleteArticle } from "./actions";

export default async function AdminNewsPage() {
  const articles = await getAdminNews();

  return (
    <div>
      <AdminPageHeader
        title="News"
        description="Development logs, updates, and announcements."
        action={
          <Link
            href="/admin/news/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            New Article
          </Link>
        }
      />

      <div className="space-y-3">
        {articles.length === 0 && (
          <p className="text-sm text-brand-grey">No articles yet. Click &quot;New Article&quot; to create one.</p>
        )}
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div>
              <h3 className="text-sm text-brand-white">{article.title}</h3>
              <p className="text-xs text-brand-grey">
                {newsCategoryLabels[article.category] ?? article.category} · {formatDate(article.published_at)}
                {!article.published && " · Unpublished"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/news/${article.id}/edit`}
                className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteArticle.bind(null, article.id)}
                confirmMessage={`Delete "${article.title}"? This cannot be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
