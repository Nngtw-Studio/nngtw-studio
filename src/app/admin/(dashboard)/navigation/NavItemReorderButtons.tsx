"use client";

import { useTransition } from "react";
import { reorderNavItem, toggleNavItemVisible } from "./actions";

export function NavItemReorderButtons({
  id,
  visible,
  isFirst,
  isLast,
}: {
  id: string;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ error?: string }>) => {
    startTransition(async () => {
      const result = await fn();
      if (result?.error) alert(result.error);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending || isFirst}
        onClick={() => run(() => reorderNavItem(id, "up"))}
        className="px-2 py-1 text-xs text-brand-grey hover:text-brand-white disabled:opacity-30"
      >
        Move Up
      </button>
      <button
        type="button"
        disabled={isPending || isLast}
        onClick={() => run(() => reorderNavItem(id, "down"))}
        className="px-2 py-1 text-xs text-brand-grey hover:text-brand-white disabled:opacity-30"
      >
        Move Down
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => run(() => toggleNavItemVisible(id, visible))}
        className="px-2 py-1 text-xs text-brand-grey hover:text-brand-white disabled:opacity-50"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
