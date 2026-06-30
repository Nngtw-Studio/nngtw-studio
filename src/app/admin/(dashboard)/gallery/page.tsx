function AdminPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-brand-white uppercase">{title}</h1>
      <p className="mt-2 text-sm text-brand-grey">{description}</p>
      <div className="mt-12 border border-dashed border-brand-white/10 p-12 text-center">
        <p className="text-sm text-brand-grey">
          Connect Supabase to enable full CRUD operations for this section.
        </p>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  return <AdminPlaceholder title="Gallery" description="Manage game and studio gallery images." />;
}
