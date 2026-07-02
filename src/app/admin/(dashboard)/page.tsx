import Link from "next/link";
import { ADMIN_SECTIONS } from "@/lib/admin/sections";
import { getAdminCounts } from "@/lib/supabase/queries/admin/counts";

export default async function AdminDashboard() {
  const counts = await getAdminCounts();

  const stats = [
    { label: "Active Games", value: counts.games },
    { label: "News Articles", value: counts.news },
    { label: "Career Roles", value: counts.careers },
    { label: "Pending Applications", value: counts.pendingApplications },
    { label: "Unread Messages", value: counts.unreadMessages },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-brand-grey">
          Manage all content for Nngtw Studio.
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-brand-white/5 p-6">
            <p className="text-xs tracking-wider text-brand-grey uppercase">{stat.label}</p>
            <p className="mt-2 font-display text-4xl text-brand-orange">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 font-display text-xl tracking-wide text-brand-white uppercase">
        Content Sections
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className="group border border-brand-white/5 p-6 transition-colors hover:border-brand-orange/20"
          >
            <h3 className="font-display text-sm tracking-wider text-brand-white uppercase transition-colors group-hover:text-brand-orange">
              {section.label}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-brand-grey">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
