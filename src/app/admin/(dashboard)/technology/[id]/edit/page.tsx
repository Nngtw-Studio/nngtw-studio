import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminTechnologyCategoryById } from "@/lib/supabase/queries/admin/technology";
import { TechnologyForm } from "../../TechnologyForm";

export default async function EditTechnologyCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getAdminTechnologyCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Category" description={category.title} />
      <TechnologyForm category={category} />
    </div>
  );
}
