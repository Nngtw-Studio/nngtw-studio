import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminNewsById } from "@/lib/supabase/queries/admin/news";
import { NewsForm } from "../../NewsForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getAdminNewsById(id);
  if (!article) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Article" description={article.title} />
      <NewsForm article={article} />
    </div>
  );
}
