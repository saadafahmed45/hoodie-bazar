import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { getOrders, getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import SalesOvertimeChart from "@/components/admin/SalesOvertimeChart";
import TopSellingProducts from "@/components/admin/TopSellingProducts";
import LatestOrdersTable from "@/components/admin/LatestOrdersTable";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Package,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — Hoodie Bazar",
  description: "E-commerce sales overview and administrative control panel",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    return <AdminLoginForm />;
  }

  // Fetch real orders and products
  let orders = [];
  let products = [];
  try {
    const [fetchedOrders, fetchedProducts] = await Promise.all([
      getOrders(),
      getProducts(),
    ]);
    orders = fetchedOrders || [];
    products = fetchedProducts || [];
  } catch (err) {
    console.warn("Database fetch warning:", err.message);
  }

  // Compute live metrics
  const totalSales = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((ord) => ord.status === "Pending" || !ord.status).length;
  const totalProducts = products.length;

  const adminName = session?.name || "Admin";

  return (
    <AdminLayout session={session}>
      <div className="space-y-6">
        {/* Top Welcome Section & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              Welcome back , {adminName} !
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Here&apos;s your current store performance and fulfillment overview
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#222222] rounded-xl transition shadow-xs"
            >
              <Package className="w-3.5 h-3.5 text-[#b6e600]" />
              <span>Catalog</span>
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#b6e600] hover:bg-[#a4cf00] rounded-xl shadow-xs transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards with site primary color scheme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: TOTAL SALES (Nivora Editorial Black + Electric Lime) */}
          <div className="bg-[#111111] text-white rounded-2xl p-5 shadow-xs border border-[#222222] relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#888888] tracking-widest uppercase text-[11px]">
                Total Sales
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#222222] flex items-center justify-center text-[#b6e600]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {formatPrice(totalSales)}
              </div>
              <div className="text-[11px] text-[#b6e600] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                <span>• Lifetime store revenue</span>
              </div>
            </div>
          </div>

          {/* Card 2: TOTAL ORDERS (White Card) */}
          <div className="bg-white text-[#111111] rounded-2xl p-5 shadow-xs border border-slate-200/80 relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#888888] tracking-widest uppercase text-[11px]">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#111111]">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] mt-1">
                {totalOrders}
              </div>
              <div className="text-[11px] text-[#888888] font-medium mt-1.5">
                Customer purchases
              </div>
            </div>
          </div>

          {/* Card 3: PENDING ORDERS (White Card with Amber highlight) */}
          <div className="bg-white text-[#111111] rounded-2xl p-5 shadow-xs border border-slate-200/80 relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#888888] tracking-widest uppercase text-[11px]">
                Pending Orders
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-orange-600 mt-1">
                {pendingOrders}
              </div>
              <div className="text-[11px] text-orange-600/90 font-semibold mt-1.5">
                Awaiting fulfillment
              </div>
            </div>
          </div>

          {/* Card 4: ACTIVE CATALOG (White Card with Lime highlight) */}
          <div className="bg-white text-[#111111] rounded-2xl p-5 shadow-xs border border-slate-200/80 relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#888888] tracking-widest uppercase text-[11px]">
                Active Catalog
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#111111]">
                <Package className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] mt-1">
                {totalProducts}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1.5">
                Active winter catalog items
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: 2 Columns (Sales Over Time Chart & Top Catalog Products) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Sales Over Time Chart */}
          <div className="lg:col-span-7 h-full">
            <SalesOvertimeChart orders={orders} />
          </div>

          {/* Top Catalog Products */}
          <div className="lg:col-span-5 h-full">
            <TopSellingProducts storeProducts={products} />
          </div>
        </div>

        {/* Bottom Section: Recent Orders Table */}
        <div>
          <LatestOrdersTable liveOrders={orders} />
        </div>
      </div>
    </AdminLayout>
  );
}
