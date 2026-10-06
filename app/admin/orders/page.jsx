import { getAdminSession } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = {
  title: "Manage Orders — NIVORA Admin",
};

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const orders = await getOrders();

  return (
    <AdminLayout session={session}>
      <AdminOrdersClient initialOrders={orders} />
    </AdminLayout>
  );
}
