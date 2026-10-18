"use client";

import { useState } from "react";
import Image from "next/image";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Truck,
  User,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  Trash2,
  Printer,
  FileText,
  Search,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction, showSuccess, showError } from "@/lib/swal";
import OrderInvoice from "@/components/admin/OrderInvoice";

export default function AdminOrdersClient({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Summary Metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const pendingOrders = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
  const confirmedOrders = orders.filter((o) => ["confirmed", "shipped"].includes((o.status || "").toLowerCase())).length;
  const deliveredOrders = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length;

  // Search & Filter Logic
  const filteredOrders = orders.filter((ord) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (ord.orderId && ord.orderId.toLowerCase().includes(term)) ||
      (ord._id && String(ord._id).toLowerCase().includes(term)) ||
      (ord.customer?.name && ord.customer.name.toLowerCase().includes(term)) ||
      (ord.customer?.phone && ord.customer.phone.toLowerCase().includes(term)) ||
      (ord.customer?.district && ord.customer.district.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "ALL" ||
      (ord.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    const confirmed = await confirmAction({
      title: "UPDATE STATUS?",
      text: `Change order <strong>#${orderId}</strong> to <span class="font-bold uppercase text-[#111111]">${newStatus}</span>?`,
      confirmText: "UPDATE",
      cancelText: "CANCEL",
      icon: newStatus === "Cancelled" ? "warning" : "question",
    });

    if (!confirmed) return;

    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order status");
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      showSuccess("ORDER UPDATED", `Order #${orderId} marked as ${newStatus}.`, 1800);
    } catch (err) {
      showError("UPDATE FAILED", err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Order Deletion
  const handleDeleteOrder = async (order) => {
    const orderDisplayId = order.orderId || order._id;
    const confirmed = await confirmAction({
      title: "DELETE ORDER?",
      text: `Are you sure you want to permanently delete order <strong>#${orderDisplayId}</strong> for <strong>${order.customer?.name || "Customer"}</strong>?<br/><span class="text-xs text-rose-600 block mt-1.5 font-semibold">This action cannot be undone.</span>`,
      confirmText: "YES, DELETE",
      cancelText: "KEEP ORDER",
      icon: "warning",
    });

    if (!confirmed) return;

    setDeletingId(order._id);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete order from system");
      }

      setOrders((prev) => prev.filter((o) => o._id !== order._id));
      if (selectedOrder && selectedOrder._id === order._id) {
        setSelectedOrder(null);
      }
      showSuccess("ORDER DELETED", `Order #${orderDisplayId} was removed from database.`, 2000);
    } catch (err) {
      showError("DELETE FAILED", err.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
            FULFILLMENT & DISPATCH LOGISTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            Orders Management ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor customer purchases, download printable PDF invoices, dispatch goods, and manage fulfillment
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#111111] text-white p-5 rounded-2xl shadow-xs border border-[#222222] relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
              TOTAL ORDER VALUE
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-[11px] font-semibold text-nivora-lime mt-2 flex items-center gap-1.5">
              <span>●</span> Across {orders.length} total orders
            </p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              PENDING FULFILLMENT
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
            {pendingOrders}
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2">
            Awaiting verification & pack
          </p>
        </div>

        {/* Processing / Confirmed */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              CONFIRMED & DISPATCHED
            </span>
            <Truck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
            {confirmedOrders}
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2">
            In courier transit
          </p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              COMPLETED / DELIVERED
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
            {deliveredOrders}
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2">
            Delivered & payment settled
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, phone, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["ALL", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-black"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Orders Match Filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or status filter to locate store orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6 font-bold">ORDER ID</th>
                  <th className="p-4 font-bold">CUSTOMER</th>
                  <th className="p-4 font-bold">ITEMS</th>
                  <th className="p-4 font-bold">TOTAL</th>
                  <th className="p-4 font-bold">PAYMENT</th>
                  <th className="p-4 font-bold">STATUS</th>
                  <th className="p-4 font-bold">DATE</th>
                  <th className="p-4 pr-6 font-bold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const displayId = ord.orderId || ord._id;
                  const customerName = ord.customer?.name || "Customer";
                  const initials = customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const statusColors = {
                    Pending: "bg-amber-50 text-amber-700 border-amber-200",
                    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
                    Shipped: "bg-sky-50 text-sky-700 border-sky-200",
                    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order ID */}
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px] border border-slate-200">
                          #{displayId}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {customerName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                              {ord.customer?.phone || "No phone"} • {ord.customer?.district || "Dhaka"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Items Count */}
                      <td className="p-4 font-semibold text-slate-700">
                        <span className="font-mono">{ord.items?.length || 1}</span> item
                        {(ord.items?.length || 1) > 1 ? "s" : ""}
                      </td>

                      {/* Total */}
                      <td className="p-4 font-mono font-black text-slate-900 text-sm">
                        {formatPrice(ord.total)}
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {ord.paymentMethod === "CASH_ON_DELIVERY" ? "COD" : ord.paymentMethod || "COD"}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <div className="w-36">
                          <Select
                            disabled={updatingId === ord._id}
                            value={ord.status || "Pending"}
                            onValueChange={(val) => handleStatusChange(ord._id, val)}
                          >
                            <SelectTrigger className="h-8 text-[11px] font-bold rounded-lg border-slate-200 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {ORDER_STATUSES.map((st) => (
                                <SelectItem key={st} value={st} className="text-xs">
                                  {st}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice PDF Download / View */}
                          <button
                            type="button"
                            title="Download Invoice (PDF)"
                            onClick={() => setInvoiceOrder(ord)}
                            className="p-2 bg-slate-100 hover:bg-[#111111] hover:text-nivora-lime text-slate-700 rounded-lg transition active:scale-95 cursor-pointer"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          {/* View Order Details */}
                          <button
                            type="button"
                            title="View Order Details"
                            onClick={() => setSelectedOrder(ord)}
                            className="p-2 bg-slate-100 hover:bg-[#111111] hover:text-white text-slate-700 rounded-lg transition active:scale-95 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Delete Order */}
                          <button
                            type="button"
                            title="Delete Order"
                            disabled={deletingId === ord._id}
                            onClick={() => handleDeleteOrder(ord)}
                            className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === ord._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto bg-white p-6 rounded-3xl border border-slate-200">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader className="pb-4 border-b border-slate-200">
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#111111]" />
                    <span className="font-editorial font-black text-xl text-[#111111]">
                      ORDER DETAILS
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                    #{selectedOrder.orderId || selectedOrder._id}
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Customer Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CUSTOMER RECIPIENT
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>{selectedOrder.customer?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-mono">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <span>{selectedOrder.customer?.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                  <span>
                    {selectedOrder.customer?.address}
                    {selectedOrder.customer?.area ? `, ${selectedOrder.customer.area}` : ""}
                    {" • "}
                    <strong className="text-slate-800">{selectedOrder.customer?.district}</strong>
                  </span>
                </div>
                {selectedOrder.customer?.note && (
                  <p className="pt-2 border-t border-slate-200 text-slate-600 italic">
                    Note: &ldquo;{selectedOrder.customer.note}&rdquo;
                  </p>
                )}
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  ITEMS PURCHASED ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                          <Image
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-tight text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase mt-0.5">
                            SIZE: <span className="font-bold text-slate-700">{item.size}</span> &bull; COLOR:{" "}
                            <span className="font-bold text-slate-700">{item.color}</span> &times;{" "}
                            <span className="font-bold text-slate-900">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatPrice(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.deliveryCharge || 70))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedOrder.deliveryCharge === 0 ? "FREE" : formatPrice(selectedOrder.deliveryCharge || 70)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="font-mono text-[#111111]">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Invoice PDF & Delete */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedOrder;
                    setSelectedOrder(null);
                    setInvoiceOrder(ord);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-nivora-lime" />
                  <span>Download / Print Invoice (PDF)</span>
                </button>

                <button
                  type="button"
                  disabled={deletingId === selectedOrder._id}
                  onClick={() => handleDeleteOrder(selectedOrder)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-200 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {deletingId === selectedOrder._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete Order</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice PDF Preview & Print Modal */}
      <Dialog
        open={Boolean(invoiceOrder)}
        onOpenChange={(open) => !open && setInvoiceOrder(null)}
      >
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 bg-white border border-slate-300 rounded-2xl">
          {invoiceOrder && (
            <OrderInvoice
              order={invoiceOrder}
              onClose={() => setInvoiceOrder(null)}
              autoPrint={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
