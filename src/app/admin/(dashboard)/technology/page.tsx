import { technologyCategories } from "@/lib/data/content";

export default function AdminTechnologyPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Technology</h1>
      <p className="mt-2 text-sm text-brand-grey">Manage technology categories and items.</p>

      <div className="mt-8 space-y-4">
        {technologyCategories.map((cat) => (
          <div key={cat.id} className="border border-brand-white/5 p-6">
            <h3 className="text-sm text-brand-white">{cat.title}</h3>
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
