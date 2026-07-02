"use client";

import { useActionState } from "react";
import { createTeamMember, updateTeamMember, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminTeamMemberRow } from "@/lib/supabase/queries/admin/team";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function TeamMemberForm({ member }: { member?: AdminTeamMemberRow }) {
  const action = member ? updateTeamMember.bind(null, member.id) : createTeamMember;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <FormError error={state?.error} />

      <div className={blockClass}>
        <label className={labelClass} htmlFor="name">Name</label>
        <input id="name" name="name" required defaultValue={member?.name} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="role">Role</label>
        <input id="role" name="role" defaultValue={member?.role} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" rows={3} defaultValue={member?.bio ?? ""} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="avatar_url">Avatar URL</label>
        <input id="avatar_url" name="avatar_url" defaultValue={member?.avatar_url ?? ""} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="order">Order</label>
        <input id="order" name="order" type="number" defaultValue={member?.order ?? 0} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className="flex items-center gap-2 text-sm text-brand-white">
          <input type="checkbox" name="visible" defaultChecked={member?.visible ?? true} />
          Visible
        </label>
      </div>

      <SubmitButton label={member ? "Save Changes" : "Add Member"} />
    </form>
  );
}
