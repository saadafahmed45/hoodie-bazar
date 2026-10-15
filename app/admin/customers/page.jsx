import { getAdminSession } from "@/lib/auth";
import { getCustomers } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminCustomersClient from "./AdminCustomersClient";

export const metadata = {
  title: "Customer Management — Hoodie Bazar",
  description: "Browse customer accounts, view spending history, fulfillment districts, and customer profiles.",
};

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const customers = await getCustomers();

  return (
    <AdminLayout session={session}>
      <AdminCustomersClient initialCustomers={customers} currentAdmin={session} />
    </AdminLayout>
  );
}
