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
import { Eye, Truck, User, MapPin, Phone, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { confirmAction, showSuccess, showError } from "@/lib/swal";

export default function AdminOrdersClient({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#E2E2E2]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
          FULFILLMENT & LOGISTICS
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          ORDERS ({orders.length})
        </h1>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E2E2E2] overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#888888] uppercase tracking-wider">
            No orders found in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F5F3] border-b border-[#E2E2E2] text-[#888888] uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6 font-bold">ORDER ID</th>
                  <th className="p-4 font-bold">CUSTOMER</th>
                  <th className="p-4 font-bold">PHONE</th>
                  <th className="p-4 font-bold">TOTAL</th>
                  <th className="p-4 font-bold">PAYMENT</th>
                  <th className="p-4 font-bold">STATUS</th>
                  <th className="p-4 font-bold">DATE</th>
                  <th className="p-4 pr-6 font-bold text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-[#111111]">
                      {ord._id}
                    </td>
                    <td className="p-4 font-semibold text-[#111111]">
                      {ord.customer?.name}
                      <span className="block text-[10px] text-[#888888] font-normal">
                        {ord.customer?.district}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[#666666]">
                      {ord.customer?.phone}
                    </td>
                    <td className="p-4 font-bold text-[#111111]">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 uppercase text-[10px] text-[#666666]">
                      {ord.paymentMethod === "CASH_ON_DELIVERY" ? "COD" : ord.paymentMethod}
                    </td>
                    <td className="p-4">
                      <div className="w-36">
                        <Select
                          disabled={updatingId === ord._id}
                          value={ord.status}
                          onValueChange={(val) => handleStatusChange(ord._id, val)}
                        >
                          <SelectTrigger className="h-8 text-[11px] font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((st) => (
                              <SelectItem key={st} value={st} className="text-xs">
                                {st}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="p-4 text-[#888888] text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 border border-[#E2E2E2] hover:border-[#111111] text-[#111111] transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>VIEW</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto bg-white p-6">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader className="pb-4 border-b border-[#E2E2E2]">
                <DialogTitle className="flex items-center justify-between">
                  <span>ORDER DETAILS</span>
                  <span className="font-mono text-xs text-[#888888]">
                    {selectedOrder._id}
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Customer Info */}
              <div className="bg-[#F5F5F3] p-4 border border-[#E2E2E2] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#111111] uppercase tracking-wider">
                  <User className="h-4 w-4" />
                  <span>{selectedOrder.customer?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#666666]">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{selectedOrder.customer?.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-[#666666]">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    {selectedOrder.customer?.address}, {selectedOrder.customer?.area}{" "}
                    {selectedOrder.customer?.district}
                  </span>
                </div>
                {selectedOrder.customer?.note && (
                  <p className="pt-2 border-t border-[#E2E2E2] text-[#888888] italic">
                    Note: &ldquo;{selectedOrder.customer.note}&rdquo;
                  </p>
                )}
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">
                  ITEMS PURCHASED ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-[#E2E2E2] border border-[#E2E2E2]">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 bg-[#F5F5F3] border border-[#E2E2E2] overflow-hidden shrink-0">
                          <Image
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-bold uppercase tracking-wider text-[#111111]">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#666666] uppercase">
                            SIZE: {item.size} &bull; COLOR: {item.color} &times; {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-[#111111]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-2 border-t border-[#E2E2E2] space-y-1.5 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">
                    {formatPrice(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[#111111]">
                    {selectedOrder.deliveryCharge === 0 ? "FREE" : formatPrice(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-[#E2E2E2]">
                  <span>Total Due</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update from modal */}
              <div className="pt-4 border-t border-[#E2E2E2] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  CURRENT STATUS:
                </span>
                <div className="w-44">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => handleStatusChange(selectedOrder._id, val)}
                  >
                    <SelectTrigger className="h-9 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((st) => (
                        <SelectItem key={st} value={st} className="text-xs">
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
