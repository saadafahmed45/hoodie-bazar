"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  PackageCheck,
  AlertCircle,
  Truck,
  ShieldCheck,
  Phone,
  HelpCircle,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialId = searchParams.get("id") || "";
  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [phoneInput, setPhoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrder = async (idToSearch, phoneToVerify) => {
    const trimmedId = idToSearch.trim();
    if (!trimmedId) {
      setErrorMsg("Please enter your 8-character Order ID (e.g. NV7K9P2X)");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setHasSearched(true);

    try {
      let url = `/api/orders/${encodeURIComponent(trimmedId)}`;
      if (phoneToVerify && phoneToVerify.trim()) {
        url += `?phone=${encodeURIComponent(phoneToVerify.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `No order found with ID #${trimmedId.toUpperCase()}`);
      }

      setOrder(data.order);
      // Update URL query param cleanly without reload
      router.replace(`/track-order?id=${encodeURIComponent(data.order.orderId || data.order._id)}`, {
        scroll: false,
      });
    } catch (err) {
      setOrder(null);
      setErrorMsg(err.message || "Failed to locate order. Please verify the ID.");
    } finally {
      setLoading(false);
    }
  };

  // If URL has ?id=..., trigger auto-search on initial load
  useEffect(() => {
    if (initialId) {
      setOrderIdInput(initialId);
      fetchOrder(initialId, "");
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput, phoneInput);
  };

  const handleClear = () => {
    setOrderIdInput("");
    setPhoneInput("");
    setOrder(null);
    setErrorMsg("");
    setHasSearched(false);
    router.replace("/track-order", { scroll: false });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime bg-[#111111] px-3 py-1 inline-block mb-3">
          LOGISTICS & FULFILLMENT
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase text-[#111111] mb-3">
          TRACK YOUR ORDER
        </h1>
        <p className="text-xs sm:text-sm text-nivora-muted uppercase tracking-wider">
          Enter your 8-character NIVORA order reference to check real-time dispatch, transit, and delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-nivora-border p-4 sm:p-6 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] mb-1">
                Order Reference (8 Characters) *
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                <Input
                  type="text"
                  required
                  placeholder="e.g. NV7K9P2X"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                  className="pl-10 pr-9 font-mono text-xs sm:text-sm uppercase font-bold rounded-none border-[#CCCCCC] focus-visible:ring-1 focus-visible:ring-[#111111] h-11"
                  maxLength={12}
                />
                {orderIdInput && (
                  <button
                    type="button"
                    onClick={() => setOrderIdInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888888] mb-1">
                Phone (Optional)
              </label>
              <Input
                type="tel"
                placeholder="017XXXXXXXX"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="font-mono text-xs rounded-none border-[#CCCCCC] focus-visible:ring-1 focus-visible:ring-[#111111] h-11"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#888888] font-mono order-2 sm:order-1">
              Sample ID format: <strong className="text-[#111111]">NV7K9P2X</strong>
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              {hasSearched && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="rounded-none text-xs font-bold uppercase tracking-wider h-10 px-4"
                >
                  Reset
                </Button>
              )}
              <Button
                type="submit"
                variant="lime"
                disabled={loading}
                className="flex-1 sm:flex-none rounded-none text-xs font-black uppercase tracking-wider h-10 px-7 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>LOCATING...</span>
                  </div>
                ) : (
                  <span>TRACK ORDER</span>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <div className="flex-1">
              <strong className="uppercase font-bold block mb-0.5">Order Not Found</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Order Status Result */}
      {order ? (
        <div className="animate-in fade-in duration-300">
          <OrderStatusTracker order={order} />
        </div>
      ) : !loading && !hasSearched ? (
        /* Explanatory Cards when no search performed */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 border-t border-nivora-border">
          <div className="p-5 bg-white border border-nivora-border text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-nivora-lime flex items-center justify-center mb-3">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Instant Verification
            </h3>
            <p className="text-[11px] text-nivora-muted">
              Every order placed at NIVORA generates a distinct 8-character reference (e.g. <strong>NV7K9P2X</strong>) displayed on your checkout receipt.
            </p>
          </div>

          <div className="p-5 bg-white border border-nivora-border text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-nivora-lime flex items-center justify-center mb-3">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Express Delivery
            </h3>
            <p className="text-[11px] text-nivora-muted">
              Dhaka city deliveries arrive within <strong>24 – 48 Hours</strong>. Orders outside Dhaka arrive in <strong>2 – 4 Business Days</strong>.
            </p>
          </div>

          <div className="p-5 bg-white border border-nivora-border text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-nivora-lime flex items-center justify-center mb-3">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Live Courier Tracking
            </h3>
            <p className="text-[11px] text-nivora-muted">
              Follow your winter streetwear from our central Dhaka warehouse straight to your doorstep with real-time status checkpoints.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#111111]" />
          <span className="text-xs uppercase font-bold tracking-wider text-[#888888] mt-2 block">
            Loading order tracker...
          </span>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
