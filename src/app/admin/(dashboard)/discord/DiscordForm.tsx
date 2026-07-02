"use client";

import { useActionState } from "react";
import { updateDiscordUrl, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";

export function DiscordForm({ discordUrl }: { discordUrl: string }) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(updateDiscordUrl, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <FormError error={state?.error} />
      {state?.success && <p className="mb-4 text-sm text-green-400">Discord URL saved.</p>}

      <div className="border border-brand-white/5 p-6">
        <label className="mb-2 block text-xs tracking-wider text-brand-grey uppercase" htmlFor="discord_url">
          Discord Invite URL
        </label>
        <input
          id="discord_url"
          name="discord_url"
          type="url"
          defaultValue={discordUrl}
          className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
        />
        <p className="mt-3 text-xs text-brand-grey">
          Saved here for reference. The live site currently still uses the hardcoded Discord URL in
          src/lib/constants.ts — wiring the public site to read this value is a follow-up.
        </p>
      </div>

      <SubmitButton label="Save" />
    </form>
  );
}
