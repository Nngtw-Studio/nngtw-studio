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
        <label className={labelClass} htmlFor="contribution">Contribution (shown on the team card)</label>
        <textarea
          id="contribution"
          name="contribution"
          rows={2}
          defaultValue={member?.contribution ?? ""}
          placeholder="Leading NNGTW's vision, product strategy, creative direction..."
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="bio">Bio (longer-form, reserved for future profile pages)</label>
        <textarea id="bio" name="bio" rows={3} defaultValue={member?.bio ?? ""} className={`${fieldClass} resize-none`} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="avatar_url">Avatar Path (Supabase Storage, nngtw-assets bucket)</label>
        <input
          id="avatar_url"
          name="avatar_url"
          defaultValue={member?.avatar_url ?? ""}
          placeholder="profile/Nngtw_team/lenin.png"
          className={fieldClass}
        />
        <p className="mt-2 text-xs text-brand-grey/50">
          A storage path, not a full URL — resolved automatically on the site.
        </p>
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="profile_url">Profile Link</label>
        <input
          id="profile_url"
          name="profile_url"
          defaultValue={member?.profile_url ?? ""}
          placeholder="https://reagan.nngtw.com or /team/lenin"
          className={fieldClass}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="contribution_weight">
          Contribution Weight (drives bento card size — higher is larger)
        </label>
        <input
          id="contribution_weight"
          name="contribution_weight"
          type="number"
          min={1}
          max={100}
          defaultValue={member?.contribution_weight ?? 50}
          className={fieldClass}
        />
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
