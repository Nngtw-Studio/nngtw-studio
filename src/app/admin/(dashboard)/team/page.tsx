import { teamMembers } from "@/lib/data/content";

export default function AdminTeamPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Team</h1>
          <p className="mt-2 text-sm text-brand-grey">Manage team member profiles.</p>
        </div>
        <button className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase">
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between border border-brand-white/5 p-4"
          >
            <div>
              <h3 className="text-sm text-brand-white">{member.role}</h3>
              <p className="text-xs text-brand-grey">{member.bio}</p>
            </div>
            <button className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
