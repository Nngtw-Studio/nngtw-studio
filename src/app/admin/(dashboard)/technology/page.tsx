import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminTechnologyCategories } from "@/lib/supabase/queries/admin/technology";
import { deleteTechCategory } from "./actions";

export default async function AdminTechnologyPage() {
  const categories = await getAdminTechnologyCategories();

  return (
    <div>
      <AdminPageHeader
        title="Technology"
        description="Manage technology categories and items."
        action={
          <Link
            href="/admin/technology/new"
            className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase"
          >
            Add Category
          </Link>
        }
      />

      <div className="space-y-4">
        {categories.length === 0 && (
          <p className="text-sm text-brand-grey">No categories yet. Click &quot;Add Category&quot; to create one.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="border border-brand-white/5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-brand-white">
                {cat.title}
                {!cat.visible && <span className="ml-2 text-xs text-brand-grey">(Hidden)</span>}
              </h3>
              <div className="flex gap-2">
                <Link
                  href={`/admin/technology/${cat.id}/edit`}
                  className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteTechCategory.bind(null, cat.id)}
                  confirmMessage={`Delete "${cat.title}"? This cannot be undone.`}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span key={item} className="border border-brand-white/10 px-2 py-1 text-xs text-brand-grey">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
