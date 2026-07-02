import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminCareerById } from "@/lib/supabase/queries/admin/careers";
import { CareerForm } from "../../CareerForm";

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const career = await getAdminCareerById(id);
  if (!career) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Role" description={career.title} />
      <CareerForm career={career} />
    </div>
  );
}
