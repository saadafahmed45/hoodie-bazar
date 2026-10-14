import { getAdminSession } from "@/lib/auth";
import { getProducts, getCategories } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminProductsClient from "./AdminProductsClient";

export const metadata = {
  title: "Manage Products — NIVORA Admin",
};

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const products = await getProducts({}, { createdAt: -1 });
  const categories = await getCategories();

  return (
    <AdminLayout session={session}>
      <AdminProductsClient
        initialProducts={products}
        initialCategories={categories}
      />
    </AdminLayout>
  );
}
