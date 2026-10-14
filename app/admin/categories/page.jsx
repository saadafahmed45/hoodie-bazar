import { getAdminSession } from "@/lib/auth";
import { getCategoriesWithProductCounts } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminCategoriesClient from "./AdminCategoriesClient";

export const metadata = {
  title: "Manage Categories — NIVORA Admin",
};

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const categories = await getCategoriesWithProductCounts();

  return (
    <AdminLayout session={session}>
      <AdminCategoriesClient initialCategories={categories} />
    </AdminLayout>
  );
}
