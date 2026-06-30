import { careers, careerStatusLabels } from "@/lib/data/content";

export default function AdminCareersPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">Careers</h1>
          <p className="mt-2 text-sm text-brand-grey">Manage job listings and role statuses.</p>
        </div>
        <button className="bg-brand-orange px-6 py-2 font-display text-xs tracking-widest text-brand-black uppercase">
          Add Role
        </button>
      </div>

      <div className="space-y-3">
        {careers.map((career) => (
          <div
            key={career.id}
            className="flex items-center justify-between border border-brand-white/5 p-4"
          >
            <div>
              <h3 className="text-sm text-brand-white">{career.title}</h3>
              <p className="text-xs text-brand-grey">
                {career.department} · {careerStatusLabels[career.status]}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs text-brand-grey hover:text-brand-white">Edit</button>
              <button className="px-3 py-1 text-xs text-red-400/60 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
