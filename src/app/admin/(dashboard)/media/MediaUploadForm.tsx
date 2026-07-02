"use client";

import { useActionState, useRef } from "react";
import { uploadMedia, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";

export function MediaUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(async (prevState, formData) => {
    const result = await uploadMedia(prevState, formData);
    if (!result?.error) formRef.current?.reset();
    return result;
  }, undefined);

  return (
    <form ref={formRef} action={formAction} className="mb-8 space-y-4 border border-brand-white/5 p-6">
      <FormError error={state?.error} />

      <div>
        <label className={labelClass} htmlFor="file">File</label>
        <input id="file" name="file" type="file" required accept="image/*,video/mp4" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="altText">Alt Text</label>
        <input id="altText" name="altText" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="context">Context</label>
        <select id="context" name="context" defaultValue="general" className={fieldClass}>
          <option value="general">General</option>
          <option value="game">Game</option>
          <option value="news">News</option>
          <option value="team">Team</option>
        </select>
      </div>

      <SubmitButton label="Upload" pendingLabel="Uploading..." />
    </form>
  );
}
