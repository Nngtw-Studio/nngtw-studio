import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminApplications } from "@/lib/supabase/queries/admin/applications";
import { formatDate } from "@/lib/utils";
import { deleteApplication } from "./actions";
import { ApplicationStatusSelect } from "./ApplicationStatusSelect";

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications();

  return (
    <div>
      <AdminPageHeader title="Applications" description="Review and manage career applications." />

      <div className="space-y-3">
        {applications.length === 0 && (
          <p className="text-sm text-brand-grey">No applications yet.</p>
        )}
        {applications.map((application) => (
          <div key={application.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div>
              <h3 className="text-sm text-brand-white">{application.name}</h3>
              <p className="text-xs text-brand-grey">
                {application.email} · Applied for {application.studio_careers?.title ?? "a role"} ·{" "}
                {formatDate(application.created_at)}
              </p>
              {application.message && (
                <p className="mt-1 max-w-xl text-xs text-brand-grey/70">{application.message}</p>
              )}
              {application.portfolio_url && (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-brand-orange hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ApplicationStatusSelect id={application.id} status={application.status} />
              <DeleteButton
                action={deleteApplication.bind(null, application.id)}
                confirmMessage={`Delete this application from "${application.name}"?`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
