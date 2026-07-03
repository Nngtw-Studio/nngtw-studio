import Link from "next/link";
import {
  ADMIN_SECTIONS,
  ADMIN_SECTION_GROUPS,
} from "@/lib/admin/sections";
import { ADMIN_ICONS } from "@/components/admin/AdminIcons";
import { getAdminCounts } from "@/lib/supabase/queries/admin/counts";

export default async function AdminDashboard() {
  const counts = await getAdminCounts();

  const stats = [
    { label: "Active Games", value: counts.games },
    { label: "News Articles", value: counts.news },
    { label: "Career Roles", value: counts.careers },
    { label: "Pending Applications", value: counts.pendingApplications },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-brand-orange" />
          <p className="font-accent text-[10px] tracking-[0.35em] text-brand-grey/60 uppercase">
            Overview
          </p>
        </div>
        <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-brand-grey">
          Manage all content for Nngtw Studio.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-lg border border-brand-white/8 bg-brand-white/2 p-6 transition-colors hover:border-brand-white/15"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-orange/60 to-transparent" />
            <p className="font-accent text-[10px] tracking-[0.25em] text-brand-grey/60 uppercase">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-4xl text-brand-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Grouped content sections */}
      {ADMIN_SECTION_GROUPS.map((group) => {
        const items = ADMIN_SECTIONS.filter((s) => s.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="mb-12 last:mb-0">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-accent text-[11px] tracking-[0.3em] text-brand-grey/70 uppercase">
                {group}
              </h2>
              <span className="h-px flex-1 bg-brand-white/6" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((section) => {
                const Icon = ADMIN_ICONS[section.key];
                return (
                  <Link
                    key={section.key}
                    href={section.href}
                    className="group flex items-start gap-4 rounded-lg border border-brand-white/8 bg-brand-white/1 p-6 transition-all hover:border-brand-orange/25 hover:bg-brand-white/3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brand-white/8 bg-brand-white/3 text-brand-grey transition-colors group-hover:border-brand-orange/30 group-hover:text-brand-orange">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-semibold tracking-wide text-brand-white uppercase transition-colors group-hover:text-brand-orange">
                        {section.label}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-brand-grey">
                        {section.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
