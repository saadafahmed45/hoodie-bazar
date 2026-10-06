import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getOrders, getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Admin Dashboard — NIVORA",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    return <AdminLoginForm />;
  }

  const [orders, products] = await Promise.all([getOrders(), getProducts()]);

  // Compute metrics
  const totalSales = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((ord) => ord.status === "Pending").length;
  const totalProducts = products.length;

  const recentOrders = orders.slice(0, 6);

  return (
    <AdminLayout session={session}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E2E2]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="btn-secondary-dark text-xs py-2 px-4"
            >
              MANAGE PRODUCTS
            </Link>
            <Link
              href="/admin/orders"
              className="btn-primary-lime text-xs py-2 px-4"
            >
              VIEW ALL ORDERS
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL SALES */}
          <Card className="border-[#E2E2E2]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-[#888888]">TOTAL SALES</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#B6E600]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-[#111111]">
                {formatPrice(totalSales)}
              </div>
              <p className="text-[10px] text-[#666666] uppercase tracking-wider mt-1">
                Lifetime revenue
              </p>
            </CardContent>
          </Card>

          {/* TOTAL ORDERS */}
          <Card className="border-[#E2E2E2]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-[#888888]">TOTAL ORDERS</CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#111111]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-[#111111]">
                {totalOrders}
              </div>
              <p className="text-[10px] text-[#666666] uppercase tracking-wider mt-1">
                Customer purchases
              </p>
            </CardContent>
          </Card>

          {/* PENDING ORDERS */}
          <Card className="border-[#E2E2E2]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-[#888888]">PENDING ORDERS</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-orange-600">
                {pendingOrders}
              </div>
              <p className="text-[10px] text-[#666666] uppercase tracking-wider mt-1">
                Awaiting fulfillment
              </p>
            </CardContent>
          </Card>

          {/* TOTAL PRODUCTS */}
          <Card className="border-[#E2E2E2]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs text-[#888888]">TOTAL PRODUCTS</CardTitle>
              <Package className="h-4 w-4 text-[#111111]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-[#111111]">
                {totalProducts}
              </div>
              <p className="text-[10px] text-[#666666] uppercase tracking-wider mt-1">
                Active catalog items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Section */}
        <Card className="border-[#E2E2E2]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">RECENT ORDERS</CardTitle>
              <CardDescription className="text-xs">
                Latest customer purchases and shipping statuses
              </CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888888] uppercase tracking-wider">
                No orders have been placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F5F3] border-y border-[#E2E2E2] text-[#888888] uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 pl-6 font-bold">ORDER ID</th>
                      <th className="p-3.5 font-bold">CUSTOMER</th>
                      <th className="p-3.5 font-bold">DISTRICT</th>
                      <th className="p-3.5 font-bold">TOTAL</th>
                      <th className="p-3.5 font-bold">STATUS</th>
                      <th className="p-3.5 pr-6 font-bold text-right">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E2E2]">
                    {recentOrders.map((ord) => (
                      <tr
                        key={ord._id}
                        className="hover:bg-[#FAF9F7] transition-colors"
                      >
                        <td className="p-3.5 pl-6 font-mono font-bold text-[#111111]">
                          {ord._id}
                        </td>
                        <td className="p-3.5 font-semibold text-[#111111]">
                          {ord.customer?.name}
                          <span className="block text-[10px] text-[#888888] font-normal">
                            {ord.customer?.phone}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#666666]">
                          {ord.customer?.district}
                        </td>
                        <td className="p-3.5 font-bold text-[#111111]">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : ord.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : ord.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : ord.status === "Processing"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-6 text-right text-[#888888] text-[11px]">
                          {new Date(ord.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
