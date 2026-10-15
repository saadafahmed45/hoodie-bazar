import { getAdminSession } from "@/lib/auth";
import { getAdminUsers } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminStaffClient from "./AdminStaffClient";

export const metadata = {
  title: "Admin Users & Staff — Hoodie Bazar",
  description: "Manage store administrators, staff roles, and customer management permissions.",
};

export default async function AdminStaffPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const admins = await getAdminUsers();

  return (
    <AdminLayout session={session}>
      <AdminStaffClient initialAdmins={admins} currentAdmin={session} />
    </AdminLayout>
  );
}
