import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminNavigationItemById } from "@/lib/supabase/queries/admin/navigation";
import { NavigationItemForm } from "../../NavigationItemForm";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminNavigationItemById(id);
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Nav Item" description={item.label} />
      <NavigationItemForm item={item} />
    </div>
  );
}
