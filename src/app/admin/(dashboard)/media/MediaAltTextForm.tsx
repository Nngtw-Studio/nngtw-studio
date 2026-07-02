"use client";

import { useTransition } from "react";
import { updateMediaAltText } from "./actions";

export function MediaAltTextForm({ id, altText }: { id: string; altText: string | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData: FormData) => {
        startTransition(async () => {
          const result = await updateMediaAltText(id, formData);
          if (result?.error) alert(result.error);
        });
      }}
      className="mt-2 flex gap-1"
    >
      <input
        name="altText"
        defaultValue={altText ?? ""}
        placeholder="Alt text"
        className="w-full border border-brand-white/10 bg-transparent px-2 py-1 text-xs text-brand-white outline-none focus:border-brand-orange"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 px-2 py-1 text-xs text-brand-grey hover:text-brand-white disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
}
