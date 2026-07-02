"use client";

import { useActionState } from "react";
import { createNavItem, updateNavItem, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminNavigationItemRow } from "@/lib/supabase/queries/admin/navigation";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function NavigationItemForm({ item }: { item?: AdminNavigationItemRow }) {
  const action = item ? updateNavItem.bind(null, item.id) : createNavItem;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      <div className={blockClass}>
        <label className={labelClass} htmlFor="label">Label</label>
        <input id="label" name="label" required defaultValue={item?.label} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="href">Href</label>
        <input id="href" name="href" required defaultValue={item?.href} placeholder="/games" className={fieldClass} />
      </div>

      <SubmitButton label={item ? "Save Changes" : "Add Nav Item"} />
    </form>
  );
}
