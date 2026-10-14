"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_STEPS = [
  {
    key: "Pending",
    label: "ORDER PLACED",
    description: "Order received & payment queued",
    icon: Clock,
  },
  {
    key: "Confirmed",
    label: "CONFIRMED",
    description: "Verified by fulfillment team",
    icon: CheckCircle2,
  },
  {
    key: "Processing",
    label: "PROCESSING",
    description: "Packed & quality inspected",
    icon: Package,
  },
  {
    key: "Shipped",
    label: "ON THE WAY",
    description: "Dispatched with courier",
    icon: Truck,
  },
  {
    key: "Delivered",
    label: "DELIVERED",
    description: "Successfully handed over",
    icon: Home,
  },
];

const STATUS_INDEX_MAP = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: -1,
};

export default function OrderStatusTracker({ order, showHeader = true }) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const orderId = order.orderId || order._id;
  const status = order.status || "Pending";
  const isCancelled = status === "Cancelled";
  const currentStepIndex = STATUS_INDEX_MAP[status] ?? 0;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success(`Order ID #${orderId} copied to clipboard!`, {
        description: "You can use this 8-character ID to track your order anytime.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy Order ID to clipboard");
    }
  };

  const isDhaka =
    (order.customer?.district || "").toLowerCase().includes("dhaka");
  const estimatedDelivery = isDhaka
    ? "24 – 48 Hours (Inside Dhaka)"
    : "2 – 4 Business Days (Outside Dhaka)";

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently placed";

  return (
    <div className="space-y-6">
      {/* Order Reference & Copy Bar */}
      <div className="bg-[#111111] text-white p-5 sm:p-6 border border-[#222222]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime">
                OFFICIAL ORDER REFERENCE
              </span>
              <span className="text-[10px] text-[#888888] font-mono">• 8 CHARACTERS</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                #{orderId}
              </h2>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white border border-[#444444] hover:border-nivora-lime text-xs font-bold uppercase tracking-wider transition-all cursor-pointer group"
                title="Copy Order ID to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-nivora-lime" />
                    <span className="text-nivora-lime">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#AAAAAA] group-hover:text-white" />
                    <span>COPY ID</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#888888] mt-1 font-mono">
              Placed on {formattedDate}
            </p>
          </div>

          <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#222222]">
            <span className="text-[10px] uppercase tracking-wider text-[#888888]">
              CURRENT STATUS
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isCancelled
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : status === "Delivered"
                  ? "bg-nivora-lime text-[#111111] font-black"
                  : status === "Shipped"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : status === "Processing"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              <span>{status.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Stepper Timeline */}
      <div className="bg-white border border-nivora-border p-5 sm:p-7">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-nivora-border">
          <h3 className="font-editorial text-lg font-black uppercase tracking-tight text-[#111111]">
            ORDER PROGRESS
          </h3>
          <span className="text-xs text-nivora-muted font-mono">
            Est. Delivery: <strong className="text-[#111111]">{estimatedDelivery}</strong>
          </span>
        </div>

        {isCancelled ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold uppercase mb-1">
                This Order Was Cancelled
              </strong>
              <p className="text-red-700">
                This order has been cancelled. If you believe this is an error or would like to reactivate your order, please contact our support team.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop Stepper (horizontal) */}
            <div className="hidden md:grid grid-cols-5 gap-2 relative">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {/* Connecting line */}
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 z-0 transition-colors ${
                          idx < currentStepIndex ? "bg-[#111111]" : "bg-nivora-border"
                        }`}
                      />
                    )}

                    {/* Step Icon circle */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-[#111111] text-nivora-lime ring-4 ring-[#B6E600]/30 shadow-md scale-110"
                          : isPassed
                          ? "bg-[#111111] text-white"
                          : "bg-nivora-soft text-[#AAAAAA] border border-[#CCCCCC]"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="h-4 w-4 stroke-3" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>

                    {/* Label & Description */}
                    <span
                      className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${
                        isCurrent
                          ? "text-[#111111] font-black"
                          : isPassed
                          ? "text-[#111111]"
                          : "text-[#888888]"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-[#888888] max-w-30 mt-0.5 line-clamp-2">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Stepper (vertical) */}
            <div className="md:hidden space-y-4">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-8 z-0 ${
                          idx < currentStepIndex ? "bg-[#111111]" : "bg-nivora-border"
                        }`}
                      />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        isCurrent
                          ? "bg-[#111111] text-nivora-lime ring-2 ring-[#B6E600]"
                          : isPassed
                          ? "bg-[#111111] text-white"
                          : "bg-nivora-soft text-[#AAAAAA] border border-[#CCCCCC]"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="h-3.5 w-3.5 stroke-3" />
                      ) : (
                        <StepIcon className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider block ${
                          isCurrent ? "text-[#111111]" : isPassed ? "text-[#111111]" : "text-[#888888]"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-[10px] text-[#888888]">{step.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Order Items & Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ordered Items (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-nivora-border p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-nivora-border">
            <h3 className="font-editorial text-base font-black uppercase tracking-tight text-[#111111]">
              ITEMS IN THIS ORDER ({order.items?.length || 0})
            </h3>
            <span className="text-[10px] text-[#888888] font-bold uppercase">
              {order.paymentMethod === "CASH_ON_DELIVERY" ? "COD" : order.paymentMethod}
            </span>
          </div>

          <div className="divide-y divide-nivora-border">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center gap-3">
                <div className="relative h-16 w-14 bg-nivora-soft border border-nivora-border shrink-0 overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#888888]">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-nivora-muted">
                    {item.size && (
                      <span className="bg-nivora-soft px-1.5 py-0.5 border border-nivora-border">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="bg-nivora-soft px-1.5 py-0.5 border border-nivora-border">
                        Color: {item.color}
                      </span>
                    )}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-[#111111]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="block text-[10px] text-[#888888] font-mono">
                      {formatPrice(item.price)} each
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-3 border-t border-nivora-border space-y-2 text-xs">
            <div className="flex justify-between text-nivora-muted">
              <span className="uppercase tracking-wider">Subtotal:</span>
              <span className="font-mono">{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-nivora-muted">
              <span className="uppercase tracking-wider">Delivery Fee:</span>
              <span className="font-mono">
                {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge || 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#111111] pt-2 border-t border-nivora-border">
              <span className="uppercase tracking-wider">Total Due (COD):</span>
              <span className="font-mono text-base">{formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Help (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-nivora-border p-5 sm:p-6 space-y-3">
            <h3 className="font-editorial text-base font-black uppercase tracking-tight text-[#111111] pb-2 border-b border-nivora-border flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>DELIVERY ADDRESS</span>
            </h3>

            <div className="text-xs space-y-1.5 text-[#444444]">
              <p className="font-bold text-[#111111] uppercase tracking-wider text-sm">
                {order.customer?.name}
              </p>
              <p className="flex items-center gap-1.5 font-mono text-nivora-muted">
                <Phone className="h-3 w-3" />
                <span>{order.customer?.phone}</span>
              </p>
              <p className="pt-1 text-[#333333]">
                {order.customer?.address}
                {order.customer?.area ? `, ${order.customer.area}` : ""}
              </p>
              <p className="font-bold text-[#111111] uppercase">
                {order.customer?.district}, Bangladesh
              </p>
              {order.customer?.note && (
                <div className="p-2 bg-[#F9F9F8] border border-nivora-border text-[11px] text-nivora-muted mt-2 italic">
                  Note: &ldquo;{order.customer.note}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Need Assistance Card */}
          <div className="bg-[#FAF9F7] border border-nivora-border p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
              <HelpCircle className="h-4 w-4" />
              <span>NEED HELP WITH THIS ORDER?</span>
            </div>
            <p className="text-[11px] text-nivora-muted">
              Have questions regarding sizing, delivery time, or order modifications? Quote your Order ID <strong>#{orderId}</strong> when contacting our team.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hello NIVORA, I have a query regarding my order #${orderId}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-[#111111] hover:bg-[#222222] text-nivora-lime text-center font-bold text-[10px] uppercase tracking-wider transition-colors inline-block"
              >
                WHATSAPP CHAT
              </a>
              <Link
                href="/contact"
                className="flex-1 py-2 px-3 bg-white hover:bg-nivora-soft border border-[#CCCCCC] text-[#111111] text-center font-bold text-[10px] uppercase tracking-wider transition-colors inline-block"
              >
                CONTACT DESK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
