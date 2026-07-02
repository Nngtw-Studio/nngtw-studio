import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminSettings } from "@/lib/supabase/queries/admin/settings";
import { DiscordForm } from "./DiscordForm";

export default async function AdminDiscordPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <AdminPageHeader title="Discord Links" description="Manage the Discord invite URL." />
      <DiscordForm discordUrl={settings.discord_url} />
    </div>
  );
}
