import { BRAND } from "@/lib/constants";

export default function AdminHomepagePage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Homepage</h1>
      <p className="mt-2 text-sm text-brand-grey">Edit hero content and featured sections.</p>

      <div className="mt-8 space-y-6">
        <div className="border border-brand-white/5 p-6">
          <label className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
            Hero Headline
          </label>
          <input
            defaultValue="BUILDING IMMERSIVE WORLDS."
            className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
            readOnly
          />
        </div>
        <div className="border border-brand-white/5 p-6">
          <label className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
            Hero Subtitle
          </label>
          <textarea
            defaultValue={BRAND.description}
            rows={3}
            className="w-full resize-none border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
