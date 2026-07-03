import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
  overline,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  overline?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-brand-white/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-brand-orange" />
          <p className="font-accent text-[10px] tracking-[0.35em] text-brand-grey/60 uppercase">
            {overline ?? "Manage"}
          </p>
        </div>
        <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">
          {title}
        </h1>
        <p className="mt-2 text-sm text-brand-grey">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
