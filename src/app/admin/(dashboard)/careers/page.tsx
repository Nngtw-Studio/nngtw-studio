import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminCareers } from "@/lib/supabase/queries/admin/careers";
import { careerStatusLabels } from "@/lib/data/content";
import { deleteCareer } from "./actions";

export default async function AdminCareersPage() {
  const careers = await getAdminCareers();

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        description="Manage job listings and role statuses."
        action={
          <Link
            href="/admin/careers/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            Add Role
          </Link>
        }
      />

      <div className="space-y-3">
        {careers.length === 0 && (
          <p className="text-sm text-brand-grey">No roles yet. Click &quot;Add Role&quot; to create one.</p>
        )}
        {careers.map((career) => (
          <div key={career.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div>
              <h3 className="text-sm text-brand-white">{career.title}</h3>
              <p className="text-xs text-brand-grey">
                {career.department} · {careerStatusLabels[career.status] ?? career.status}
                {!career.published && " · Unpublished"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/careers/${career.id}/edit`}
                className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteCareer.bind(null, career.id)}
                confirmMessage={`Delete "${career.title}"? This cannot be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
