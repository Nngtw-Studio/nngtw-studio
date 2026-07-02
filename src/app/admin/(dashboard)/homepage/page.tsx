import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getHomepagePage } from "@/lib/supabase/queries/admin/pages";
import { HomepageForm } from "./HomepageForm";

export default async function AdminHomepagePage() {
  const page = await getHomepagePage();

  return (
    <div>
      <AdminPageHeader title="Homepage" description="Edit hero content and SEO defaults." />
      {page ? (
        <HomepageForm page={page} />
      ) : (
        <p className="mt-8 text-sm text-brand-grey">
          No homepage row found yet — run supabase/migrations/006_navigation_and_homepage.sql to seed it.
        </p>
      )}
    </div>
  );
}
