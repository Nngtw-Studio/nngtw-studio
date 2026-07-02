"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "./actions";

export function ApplicationStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(async () => {
          const result = await updateApplicationStatus(id, newStatus);
          if (result?.error) alert(result.error);
        });
      }}
      className="border border-brand-white/10 bg-transparent px-3 py-1 text-xs text-brand-white outline-none focus:border-brand-orange disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="reviewing">Reviewing</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}
