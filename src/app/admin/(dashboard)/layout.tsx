import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen lg:ml-64">
        <main className="p-8 pt-20 lg:pt-8">{children}</main>
      </div>
    </>
  );
}
