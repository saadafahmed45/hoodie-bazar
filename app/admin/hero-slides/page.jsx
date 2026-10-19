import { getAdminSession } from "@/lib/auth";
import { getHeroSlides } from "@/lib/db";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminHeroSlidesClient from "./AdminHeroSlidesClient";

export const metadata = {
  title: "Hero Slider Management — NIVORA Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminHeroSlidesPage() {
  const session = await getAdminSession();
  if (!session) {
    return <AdminLoginForm />;
  }

  const slides = await getHeroSlides({ activeOnly: false });

  return (
    <AdminLayout session={session}>
      <AdminHeroSlidesClient initialSlides={slides} />
    </AdminLayout>
  );
}
