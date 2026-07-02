import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminTeamMembers } from "@/lib/supabase/queries/admin/team";
import { deleteTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const members = await getAdminTeamMembers();

  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="Manage team member profiles."
        action={
          <Link
            href="/admin/team/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            Add Member
          </Link>
        }
      />

      <div className="space-y-3">
        {members.length === 0 && (
          <p className="text-sm text-brand-grey">No team members yet. Click &quot;Add Member&quot; to create one.</p>
        )}
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div>
              <h3 className="text-sm text-brand-white">{member.name}</h3>
              <p className="text-xs text-brand-grey">
                {member.role}
                {!member.visible && " · Hidden"}
              </p>
              {member.bio && <p className="mt-1 text-xs text-brand-grey/70">{member.bio}</p>}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/team/${member.id}/edit`}
                className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteTeamMember.bind(null, member.id)}
                confirmMessage={`Delete "${member.name}"? This cannot be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
