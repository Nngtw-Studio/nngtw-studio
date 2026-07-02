"use client";

import { useActionState } from "react";
import { upsertSettings, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminSettings } from "@/lib/supabase/queries/admin/settings";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function SettingsForm({ settings }: { settings: AdminSettings }) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(upsertSettings, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <FormError error={state?.error} />
      {state?.success && <p className="mb-4 text-sm text-green-400">Settings saved.</p>}

      <div className={blockClass}>
        <label className={labelClass} htmlFor="studio_name">Studio Name</label>
        <input id="studio_name" name="studio_name" defaultValue={settings.studio_name} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="tagline">Tagline</label>
        <input id="tagline" name="tagline" defaultValue={settings.tagline} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="contact_email">Contact Email</label>
        <input id="contact_email" name="contact_email" type="email" defaultValue={settings.contact_email} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="site_url">Site URL</label>
        <input id="site_url" name="site_url" defaultValue={settings.site_url} className={fieldClass} />
      </div>

      <SubmitButton label="Save Settings" />
    </form>
  );
}
