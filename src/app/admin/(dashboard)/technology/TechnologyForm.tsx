"use client";

import { useActionState } from "react";
import { createTechCategory, updateTechCategory, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminTechnologyCategoryRow } from "@/lib/supabase/queries/admin/technology";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function TechnologyForm({ category }: { category?: AdminTechnologyCategoryRow }) {
  const action = category ? updateTechCategory.bind(null, category.id) : createTechCategory;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      <div className={blockClass}>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={category?.title} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={category?.description ?? ""} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="items">Items (one per line)</label>
        <textarea
          id="items"
          name="items"
          rows={6}
          defaultValue={category?.items?.join("\n")}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="order">Order</label>
        <input id="order" name="order" type="number" defaultValue={category?.order ?? 0} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="visible" defaultChecked={category?.visible ?? true} />
          Visible
        </label>
      </div>

      <SubmitButton label={category ? "Save Changes" : "Add Category"} />
    </form>
  );
}
