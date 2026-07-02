import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "../TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <AdminPageHeader title="Add Member" description="Add a new team member profile." />
      <TeamMemberForm />
    </div>
  );
}
