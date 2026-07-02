import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CareerForm } from "../CareerForm";

export default function NewCareerPage() {
  return (
    <div>
      <AdminPageHeader title="Add Role" description="Create a new job listing." />
      <CareerForm />
    </div>
  );
}
