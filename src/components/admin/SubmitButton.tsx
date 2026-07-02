"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase disabled:opacity-50"
    >
      {pending ? (pendingLabel ?? "Saving...") : label}
    </button>
  );
}
