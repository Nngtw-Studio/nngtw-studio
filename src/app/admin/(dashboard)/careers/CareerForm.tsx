"use client";

import { useActionState } from "react";
import { createCareer, updateCareer, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminCareerRow } from "@/lib/supabase/queries/admin/careers";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function CareerForm({ career }: { career?: AdminCareerRow }) {
  const action = career ? updateCareer.bind(null, career.id) : createCareer;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      {career && (
        <div className={blockClass}>
          <label className={labelClass}>Slug</label>
          <p className="text-sm text-brand-grey">{career.slug}</p>
        </div>
      )}

      <div className={blockClass}>
        <label className={labelClass} htmlFor="title">Title</label>
        <input id="title" name="title" required defaultValue={career?.title} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="department">Department</label>
        <input id="department" name="department" defaultValue={career?.department} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="location">Location</label>
        <input id="location" name="location" defaultValue={career?.location} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="type">Type</label>
        <input id="type" name="type" defaultValue={career?.type} placeholder="Full-time" className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={career?.status ?? "future"} className={fieldClass}>
          <option value="open">Open</option>
          <option value="internship">Internship</option>
          <option value="future">Future Opportunity</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={career?.description} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="requirements">Requirements (one per line)</label>
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          defaultValue={career?.requirements?.join("\n")}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="order">Order</label>
        <input id="order" name="order" type="number" defaultValue={career?.order ?? 0} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="published" defaultChecked={career?.published ?? true} />
          Published
        </label>
      </div>

      <SubmitButton label={career ? "Save Changes" : "Create Role"} />
    </form>
  );
}
