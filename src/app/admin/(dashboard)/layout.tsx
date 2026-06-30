import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen">
        <main className="p-8">{children}</main>
      </div>
    </>
  );
}
