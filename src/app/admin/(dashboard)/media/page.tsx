import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminMedia } from "@/lib/supabase/queries/admin/media";
import { MediaUploadForm } from "./MediaUploadForm";
import { MediaGrid } from "./MediaGrid";

export default async function AdminMediaPage() {
  const items = await getAdminMedia();

  return (
    <div>
      <AdminPageHeader title="Media" description="Upload and manage images and video assets." />
      <MediaUploadForm />
      <MediaGrid items={items} />
    </div>
  );
}
