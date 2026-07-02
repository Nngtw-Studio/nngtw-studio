"use client";

import { useTransition } from "react";
import { toggleMessageRead } from "./actions";

export function MessageReadToggle({ id, read }: { id: string; read: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleMessageRead(id, read);
          if (result?.error) alert(result.error);
        });
      }}
      className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white disabled:opacity-50"
    >
      {read ? "Mark Unread" : "Mark Read"}
    </button>
  );
}
