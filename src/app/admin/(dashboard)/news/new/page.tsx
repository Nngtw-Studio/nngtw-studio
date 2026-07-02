import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsForm } from "../NewsForm";

export default function NewArticlePage() {
  return (
    <div>
      <AdminPageHeader title="New Article" description="Publish a development log or announcement." />
      <NewsForm />
    </div>
  );
}
