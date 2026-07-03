import AdminLayout from "@frontend/modules/Admin/AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
