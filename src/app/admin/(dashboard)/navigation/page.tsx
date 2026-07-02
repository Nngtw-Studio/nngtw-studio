import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminNavigationItems } from "@/lib/supabase/queries/admin/navigation";
import { deleteNavItem } from "./actions";
import { NavItemReorderButtons } from "./NavItemReorderButtons";

export default async function AdminNavigationPage() {
  const items = await getAdminNavigationItems();

  return (
    <div>
      <AdminPageHeader
        title="Navigation"
        description="Manage site navigation items."
        action={
          <Link
            href="/admin/navigation/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            Add Nav Item
          </Link>
        }
      />

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-brand-grey">No navigation items yet.</p>
        )}
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between border border-brand-white/5 p-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-brand-grey">{index + 1}</span>
              <span className="text-sm text-brand-white">{item.label}</span>
              <span className="text-xs text-brand-grey">{item.href}</span>
              <span className={`text-xs ${item.visible ? "text-green-400" : "text-brand-grey"}`}>
                {item.visible ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <NavItemReorderButtons
                id={item.id}
                visible={item.visible}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
              <Link
                href={`/admin/navigation/${item.id}/edit`}
                className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
              >
                Edit
              </Link>
              <DeleteButton
                action={deleteNavItem.bind(null, item.id)}
                confirmMessage={`Delete "${item.label}"?`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-brand-grey">
        The live site header/footer still read the hardcoded NAV_LINKS constant — wiring them to this table is a follow-up.
      </p>
    </div>
  );
}
