import { BRAND } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Settings</h1>
      <p className="mt-2 text-sm text-brand-grey">Global site configuration.</p>

      <div className="mt-8 space-y-6">
        {[
          { label: "Studio Name", value: BRAND.name },
          { label: "Tagline", value: BRAND.tagline },
          { label: "Contact Email", value: BRAND.email },
          { label: "Site URL", value: BRAND.url },
        ].map((setting) => (
          <div key={setting.label} className="border border-brand-white/5 p-6">
            <label className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
              {setting.label}
            </label>
            <input
              defaultValue={setting.value}
              className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
}
