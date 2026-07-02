"use client";

import { useActionState } from "react";
import { updateHomepageContent, type ActionResult } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FormError } from "@/components/admin/FormError";
import type { AdminHomepageRow } from "@/lib/supabase/queries/admin/pages";

const fieldClass =
  "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange";
const labelClass = "mb-2 block text-xs tracking-wider text-brand-grey uppercase";
const blockClass = "border border-brand-white/5 p-6";

export function HomepageForm({ page }: { page: AdminHomepageRow }) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(updateHomepageContent, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <FormError error={state?.error} />
      {state?.success && <p className="mb-4 text-sm text-green-400">Homepage content saved.</p>}

      <h2 className="font-display text-sm tracking-widest text-brand-grey uppercase">Hero Content</h2>

      <div className={blockClass}>
        <label className={labelClass}>Hero Headline</label>
        <p className="text-sm text-brand-grey">
          Hero headline is hardcoded in Hero.tsx due to its custom highlight SVG treatment around
          &quot;immersive&quot; — edit the component directly to change it.
        </p>
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="heroSubtitle">Hero Subtitle</label>
        <textarea
          id="heroSubtitle"
          name="heroSubtitle"
          rows={3}
          defaultValue={page.content.heroSubtitle}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="ctaPrimaryLabel">Primary CTA Label</label>
        <input id="ctaPrimaryLabel" name="ctaPrimaryLabel" defaultValue={page.content.ctaPrimaryLabel} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="ctaPrimaryHref">Primary CTA Href</label>
        <input id="ctaPrimaryHref" name="ctaPrimaryHref" defaultValue={page.content.ctaPrimaryHref} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="ctaSecondaryLabel">Secondary CTA Label</label>
        <input id="ctaSecondaryLabel" name="ctaSecondaryLabel" defaultValue={page.content.ctaSecondaryLabel} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="ctaSecondaryHref">Secondary CTA Href</label>
        <input id="ctaSecondaryHref" name="ctaSecondaryHref" defaultValue={page.content.ctaSecondaryHref} className={fieldClass} />
      </div>

      <h2 className="font-display text-sm tracking-widest text-brand-grey uppercase">SEO Defaults</h2>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="seo_title">SEO Title</label>
        <input id="seo_title" name="seo_title" defaultValue={page.seo_title ?? ""} className={fieldClass} />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="seo_description">SEO Description</label>
        <textarea
          id="seo_description"
          name="seo_description"
          rows={3}
          defaultValue={page.seo_description ?? ""}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className={blockClass}>
        <label className={labelClass} htmlFor="og_image">OG Image URL</label>
        <input id="og_image" name="og_image" defaultValue={page.og_image ?? ""} className={fieldClass} />
      </div>

      <SubmitButton label="Save Changes" />
    </form>
  );
}
