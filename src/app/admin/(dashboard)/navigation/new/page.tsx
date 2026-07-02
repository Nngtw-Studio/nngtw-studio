import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NavigationItemForm } from "../NavigationItemForm";

export default function NewNavItemPage() {
  return (
    <div>
      <AdminPageHeader title="Add Nav Item" description="Create a new navigation link." />
      <NavigationItemForm />
    </div>
  );
}
