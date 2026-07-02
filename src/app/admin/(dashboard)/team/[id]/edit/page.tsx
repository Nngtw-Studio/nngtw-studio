import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminTeamMemberById } from "@/lib/supabase/queries/admin/team";
import { TeamMemberForm } from "../../TeamMemberForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getAdminTeamMemberById(id);
  if (!member) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Member" description={member.name} />
      <TeamMemberForm member={member} />
    </div>
  );
}
