import { NAV_LINKS } from "@/lib/constants";

export default function AdminNavigationPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Navigation</h1>
      <p className="mt-2 text-sm text-brand-grey">Manage site navigation items.</p>

      <div className="mt-8 space-y-3">
        {NAV_LINKS.map((link, i) => (
          <div
            key={link.href}
            className="flex items-center justify-between border border-brand-white/5 p-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-brand-grey">{i + 1}</span>
              <span className="text-sm text-brand-white">{link.label}</span>
              <span className="text-xs text-brand-grey">{link.href}</span>
            </div>
            <span className="text-xs text-green-400">Visible</span>
          </div>
        ))}
      </div>
    </div>
  );
}
