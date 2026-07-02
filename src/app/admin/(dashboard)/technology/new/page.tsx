import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TechnologyForm } from "../TechnologyForm";

export default function NewTechnologyCategoryPage() {
  return (
    <div>
      <AdminPageHeader title="Add Category" description="Create a new technology category." />
      <TechnologyForm />
    </div>
  );
}
