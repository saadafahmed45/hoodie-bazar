"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Crown,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCustomersClient({ initialCustomers = [], currentAdmin }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Compute metrics
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.ordersCount > 1).length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpendPerCustomer = totalCustomers > 0 ? totalCustomerSpend / totalCustomers : 0;

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.district.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "ALL" ||
      c.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      toast.info("No customers to export.");
      return;
    }

    const headers = "Customer ID,Name,Phone,Email,District,Address,Orders Count,Total Spent,Status,Last Order Date";
    const rows = filteredCustomers.map(
      (c) =>
        `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.district}","${c.address || ""}","${c.ordersCount}","${c.totalSpent}","${c.status}","${new Date(c.lastOrderDate).toLocaleDateString()}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hoodie_bazar_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer database exported to CSV");
  };

  const handleOpenDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailsModalOpen(true);
  };

  const handleUpdateStatus = async (customerId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("Failed to update customer status");

      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
      );
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Customer status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
            STORE RELATIONSHIPS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            Customer Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Browse buyer profiles, delivery districts, order frequencies, and lifetime value
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition active:scale-95"
          >
            <Download className="w-4 h-4 text-[#b6e600]" />
            <span>Export Customers CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-[#111111] text-white rounded-2xl p-5 border border-[#222222] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Total Buyers
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#222222] flex items-center justify-center text-[#b6e600]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{totalCustomers}</div>
            <p className="text-[11px] text-[#b6e600] font-bold uppercase tracking-wider mt-1">
              • Verified purchasing clients
            </p>
          </div>
        </div>

        {/* Repeat Buyers */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Repeat Buyers
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#111111]">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{repeatCustomers}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Multi-order customers
            </p>
          </div>
        </div>

        {/* Customer Lifetime Spend */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Customer Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#111111]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{formatPrice(totalCustomerSpend)}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Total volume across all orders
            </p>
          </div>
        </div>

        {/* Avg Spend per Customer */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Avg Spend / Buyer
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{formatPrice(avgSpendPerCustomer)}</div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Average order value
            </p>
          </div>
        </div>
      </div>

      {/* Customer List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider">
            {["ALL", "VIP", "Repeat", "Active"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === st
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                {st === "ALL" ? "All Customers" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                <th className="py-3 px-3">Customer Profile</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Delivery District</th>
                <th className="py-3 px-3">Orders</th>
                <th className="py-3 px-3">Total Spend</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    <Users className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>No customer records match your search filter.</span>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isVip = cust.status === "VIP" || cust.totalSpent >= 2500;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50 transition group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#111111] font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            {cust.name?.slice(0, 2).toUpperCase() || "CU"}
                          </div>
                          <div>
                            <span className="font-bold text-[#111111] block leading-snug">
                              {cust.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              First ordered {new Date(cust.firstOrderDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[#111111] font-medium flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cust.phone}</span>
                          </span>
                          {cust.email && cust.email !== "N/A" && (
                            <span className="text-[11px] text-slate-500 truncate max-w-[160px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{cust.email}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* District */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{cust.district}</span>
                        </span>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-3 font-bold text-[#111111]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                          <ShoppingBag className="w-3 h-3" />
                          <span>{cust.ordersCount} orders</span>
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td className="py-3.5 px-3 font-black text-[#111111] text-sm">
                        {formatPrice(cust.totalSpent)}
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-3">
                        {isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-[#b6e600] border border-[#222222]">
                            <Crown className="w-3 h-3" />
                            <span>VIP Buyer</span>
                          </span>
                        ) : cust.ordersCount > 1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                            <span>Repeat</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(cust)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#111111] bg-slate-100 hover:bg-[#111111] hover:text-white rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details / Order History Modal */}
      {detailsModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#b6e600] font-black text-sm flex items-center justify-center">
                  {selectedCustomer.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black font-editorial tracking-tight uppercase text-[#111111]">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedCustomer.phone} • {selectedCustomer.district}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Customer Summary Bar */}
            <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Orders
                </span>
                <span className="text-lg font-black text-[#111111]">
                  {selectedCustomer.ordersCount} Purchases
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Lifetime Value
                </span>
                <span className="text-lg font-black text-[#111111]">
                  {formatPrice(selectedCustomer.totalSpent)}
                </span>
              </div>
            </div>

            {/* Quick Status Setter */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Customer Tier:
              </span>
              <div className="flex items-center gap-1.5">
                {["Active", "VIP", "Blocked"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedCustomer.id, tier)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                      selectedCustomer.status === tier
                        ? "bg-[#111111] text-[#b6e600] shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders History List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                Order History ({selectedCustomer.orders.length})
              </h4>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedCustomer.orders.map((ord, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-black transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#111111]">
                          #{String(ord.orderId).slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold uppercase text-slate-700">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {new Date(ord.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-xs text-[#111111] block">
                        {formatPrice(ord.total)}
                      </span>
                      <Link
                        href="/admin/orders"
                        className="text-[10px] font-bold text-[#111111] hover:underline"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition hover:bg-[#222222]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
