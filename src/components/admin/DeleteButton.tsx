"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => Promise<{ error?: string }>;
  confirmMessage: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action();
          if (result?.error) alert(result.error);
        });
      }}
      className="px-3 py-1 text-xs text-red-400/60 hover:text-red-400 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
