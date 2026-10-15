import { getAdminSession } from "@/lib/auth";
import { getOrderById } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import OrderInvoice from "@/components/admin/OrderInvoice";

export const metadata = {
  title: "Order Invoice — Hoodie Bazar Admin",
};

export default async function OrderInvoicePage({ params, searchParams }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const sParams = await searchParams;
  const shouldAutoPrint = sParams?.print === "true";
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <OrderInvoice order={order} autoPrint={shouldAutoPrint} />
    </div>
  );
}
