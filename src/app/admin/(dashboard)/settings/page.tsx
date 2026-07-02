import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminSettings } from "@/lib/supabase/queries/admin/settings";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Global site configuration." />
      <SettingsForm settings={settings} />
    </div>
  );
}
