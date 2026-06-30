import { SOCIAL } from "@/lib/constants";

export default function AdminDiscordPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Discord Links</h1>
      <p className="mt-2 text-sm text-brand-grey">Manage Discord integration across the site.</p>

      <div className="mt-8 border border-brand-white/5 p-6">
        <label className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
          Discord Invite URL
        </label>
        <input
          defaultValue={SOCIAL.discord}
          className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
          readOnly
        />
        <p className="mt-3 text-xs text-brand-grey">
          This URL is used in the homepage community section, footer, contact page, and game pages.
        </p>
      </div>
    </div>
  );
}
