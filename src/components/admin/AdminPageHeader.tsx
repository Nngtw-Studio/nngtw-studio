import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">{title}</h1>
        <p className="mt-2 text-sm text-brand-grey">{description}</p>
      </div>
      {action}
    </div>
  );
}
