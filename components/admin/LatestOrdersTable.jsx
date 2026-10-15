"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Filter,
  Download,
  Eye,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function LatestOrdersTable({ liveOrders = [] }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter orders by status
  const filteredOrders = liveOrders.filter((ord) => {
    if (filterStatus === "ALL") return true;
    return ord.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.info("No orders to export.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order ID,Customer Name,Phone,District,Total,Status,Date"]
        .concat(
          filteredOrders.map(
            (o) =>
              `"${o._id}","${o.customer?.name || ""}","${o.customer?.phone || ""}","${o.customer?.district || ""}","${o.total || 0}","${o.status || ""}","${new Date(o.createdAt || Date.now()).toLocaleDateString()}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hoodie_bazar_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";
      case "Shipped":
        return "bg-blue-50 text-blue-700";
      case "Processing":
        return "bg-slate-100 text-[#111111] font-bold";
      case "Confirmed":
        return "bg-indigo-50 text-indigo-700";
      case "Cancelled":
        return "bg-rose-50 text-rose-700";
      default:
        return "bg-amber-50 text-amber-700 font-bold";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mt-6">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
            Recent Customer Orders
          </h2>
          <p className="text-[11px] text-[#888888] font-medium">
            Live orders awaiting fulfillment & dispatch
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                filterStatus !== "ALL"
                  ? "border-[#111111] text-[#111111] bg-slate-100"
                  : "border-slate-200 text-slate-700 hover:text-black hover:bg-slate-50"
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{filterStatus === "ALL" ? "Filter" : filterStatus}</span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20 text-xs">
                {["ALL", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setFilterStatus(st);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition ${
                      filterStatus === st
                        ? "bg-[#111111] text-white font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {st === "ALL" ? "All Orders" : st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-black px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>

          {/* Manage Orders Link */}
          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#b6e600] hover:bg-[#a4cf00] px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">District</th>
              <th className="py-3 px-3">Total</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  <span>No orders found matching the criteria.</span>
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, 6).map((ord) => (
                <tr
                  key={ord._id}
                  className="hover:bg-slate-50 transition group"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-[#111111]">
                    #{String(ord._id).slice(-6).toUpperCase()}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#111111] block">
                      {ord.customer?.name || "Customer"}
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">
                      {ord.customer?.phone || ""}
                    </span>
                  </td>

                  {/* District */}
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {ord.customer?.district || "Dhaka"}
                  </td>

                  {/* Total Price */}
                  <td className="py-3.5 px-3 font-black text-[#111111]">
                    {formatPrice(ord.total || 0)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status || "Pending"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#111111] hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
