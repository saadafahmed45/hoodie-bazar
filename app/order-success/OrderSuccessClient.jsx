"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PackageCheck,
  ArrowRight,
  Home,
  Copy,
  Check,
  Truck,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";

export default function OrderSuccessClient({
  orderId,
  customerName,
  totalAmount,
  paymentMethod,
  district,
}) {
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (res.ok && data.success && data.order) {
          setOrder(data.order);
        } else {
          // Fallback mock order structure from URL params
          setOrder({
            _id: orderId,
            orderId: orderId,
            status: "Pending",
            createdAt: new Date().toISOString(),
            customer: {
              name: customerName,
              district: district,
            },
            total: totalAmount,
            paymentMethod: paymentMethod,
            items: [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, customerName, totalAmount, paymentMethod, district]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success(`Order ID #${orderId} copied to clipboard!`, {
        description: "Save this 8-character ID to track your order anytime.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy Order ID");
    }
  };

  const isDhaka = (district || "").toLowerCase().includes("dhaka");
  const estimatedDelivery = isDhaka
    ? "24 – 48 Hours (Inside Dhaka)"
    : "2 – 4 Business Days (Outside Dhaka)";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Celebration Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="h-20 w-20 rounded-full bg-nivora-lime/20 border border-nivora-lime flex items-center justify-center mx-auto mb-5 text-[#111111] animate-in zoom-in duration-300">
          <PackageCheck className="h-10 w-10 stroke-[2.5]" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime bg-[#111111] px-3.5 py-1 inline-block mb-3">
          ORDER PLACED SUCCESSFULLY
        </span>

        <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase text-[#111111] mb-3">
          THANK YOU FOR SHOPPING WITH NIVORA.
        </h1>

        <p className="text-xs sm:text-sm text-nivora-muted uppercase tracking-wider">
          Hello <strong className="text-[#111111]">{customerName}</strong>, your winter order has been received and our Dhaka fulfillment team has queued your parcel for packing.
        </p>
      </div>

      {/* Prominent Copy Order ID Card */}
      <div className="bg-[#111111] text-white p-6 sm:p-8 mb-8 border border-[#222222] shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime block mb-1">
              YOUR UNIQUE ORDER ID (8 CHARACTERS)
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-white selection:bg-nivora-lime selection:text-[#111111]">
                #{orderId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-2 px-4 py-2 bg-nivora-lime hover:bg-[#a5d200] text-[#111111] font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Copy your Order ID"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 stroke-3" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>COPY ORDER ID</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#888888] mt-2 font-mono">
              Save or copy this ID to track your parcel status anytime at <span className="text-white">/track-order</span>
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 border-t sm:border-t-0 sm:border-l border-[#333333] pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[10px] text-[#888888] uppercase tracking-wider">
              ESTIMATED ARRIVAL
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
              <Truck className="h-4 w-4 text-nivora-lime" />
              <span>{estimatedDelivery}</span>
            </div>
            <Link
              href={`/track-order?id=${encodeURIComponent(orderId)}`}
              className="text-[10px] text-nivora-lime hover:underline font-bold uppercase tracking-wider flex items-center gap-1 mt-1"
            >
              <span>Live Tracking View</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Live Order Status Stepper & Detailed Breakdown */}
      {loading ? (
        <div className="p-12 text-center bg-white border border-nivora-border">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#111111]" />
          <span className="text-xs uppercase font-bold text-[#888888] mt-2 block tracking-wider">
            Loading your order status...
          </span>
        </div>
      ) : order ? (
        <div className="mb-10">
          <OrderStatusTracker order={order} />
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-nivora-border">
        <Button variant="lime" size="lg" asChild className="w-full sm:w-auto font-black cursor-pointer">
          <Link href={`/track-order?id=${encodeURIComponent(orderId)}`} className="flex items-center gap-2">
            <span>TRACK THIS ORDER LIVE</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto font-bold cursor-pointer">
          <Link href="/shop" className="flex items-center gap-2">
            <span>CONTINUE SHOPPING</span>
          </Link>
        </Button>
        <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto font-bold cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>RETURN HOME</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
