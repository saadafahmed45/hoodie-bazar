"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import {
  DELIVERY_CHARGE_INSIDE_DHAKA,
  DELIVERY_CHARGE_OUTSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD,
  BANGLADESH_DISTRICTS,
} from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "Dhaka",
    area: "",
    address: "",
    note: "",
    paymentMethod: "CASH_ON_DELIVERY",
  });

  useEffect(() => {
    setMounted(true);
    if (user?.displayName && !form.name) {
      setForm((prev) => ({ ...prev, name: user.displayName }));
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#111111]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black font-editorial uppercase mb-2">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-xs text-[#666666] uppercase tracking-wider mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Button variant="lime" asChild>
          <Link href="/shop">EXPLORE SHOP</Link>
        </Button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const isDhaka = form.district.toLowerCase().includes("dhaka");
  let deliveryCharge = isDhaka
    ? DELIVERY_CHARGE_INSIDE_DHAKA
    : DELIVERY_CHARGE_OUTSIDE_DHAKA;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    deliveryCharge = 0;
  }

  const total = subtotal + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate phone number: 11 digits starting with 01
    const cleanPhone = form.phone.replace(/[\s\-\+]/g, "");
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678).");
      return;
    }

    if (!form.name.trim() || !form.address.trim()) {
      setErrorMsg("Please fill in all required shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            district: form.district,
            area: form.area,
            address: form.address,
            note: form.note,
            email: user?.email || "",
            userId: user?.uid || "",
          },
          items,
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process your order");
      }

      // Order created successfully!
      const order = data.order;
      clearCart();
      toast.success("Order placed successfully!");

      // Navigate to order success page with details in query params or session
      const queryParams = new URLSearchParams({
        id: order._id,
        name: order.customer.name,
        total: order.total,
        payment: order.paymentMethod,
        district: order.customer.district,
      });

      router.push(`/order-success?${queryParams.toString()}`);
    } catch (err) {
      console.error("Order submission error:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#E2E2E2]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
          CHECKOUT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          SHIPPING & PAYMENT
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer Info (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* User Account Banner */}
            {user ? (
              <div className="p-3.5 bg-[#F5F5F3] border border-[#E2E2E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-[#555555]">
                  Signed in as <strong className="text-[#111111]">{user.displayName || user.email}</strong>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 w-fit">
                  Orders linked to your account
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-[#F9F9F8] border border-[#E2E2E2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-[#666666]">Have a NIVORA account?</span>
                <Link
                  href="/login?redirect=/checkout"
                  className="font-bold text-[#111111] hover:underline uppercase text-[11px] tracking-wider"
                >
                  Sign In for faster checkout &rarr;
                </Link>
              </div>
            )}

            {/* Delivery Details */}
            <div className="border border-[#E2E2E2] p-6 space-y-4 bg-white">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] pb-3 border-b border-[#E2E2E2]">
                1. DELIVERY ADDRESS (BANGLADESH)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number (11 Digits) *</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="e.g. 01712345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={form.district}
                    onValueChange={(val) => setForm({ ...form, district: val })}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANGLADESH_DISTRICTS.map((dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="area">Thana / Area (Optional)</Label>
                  <Input
                    id="area"
                    placeholder="e.g. Dhanmondi / Uttara"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Full Delivery Address *</Label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  placeholder="House number, Road number, Sector, Landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="flex w-full bg-white px-3.5 py-2 text-sm text-[#111111] border border-[#E2E2E2] placeholder:text-[#888888] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note">Order Notes (Optional)</Label>
                <Input
                  id="note"
                  placeholder="Instructions for delivery courier (e.g. call before delivery)"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-[#E2E2E2] p-6 space-y-4 bg-white">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] pb-3 border-b border-[#E2E2E2]">
                2. PAYMENT METHOD
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery (Functional) */}
                <label className="flex items-start gap-3 p-4 border border-[#111111] bg-[#F5F5F3] cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="CASH_ON_DELIVERY"
                    checked={form.paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="mt-1 h-4 w-4 accent-[#111111]"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                      CASH ON DELIVERY (COD)
                    </span>
                    <span className="text-xs text-[#666666] block mt-0.5">
                      Pay with cash upon delivery of your garments to your doorstep.
                    </span>
                  </div>
                </label>

                {/* Optional bKash / Nagad info badges */}
                <div className="p-3 border border-[#E2E2E2] opacity-60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#e2136e] uppercase tracking-wider">
                      bKash / Nagad Online
                    </span>
                    <span className="text-[10px] uppercase tracking-widest bg-[#EEEEEE] px-2 py-0.5 font-bold">
                      AVAILABLE WITH COURIER
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888888] mt-1">
                    You can pay the courier rider directly via your bKash or Nagad app during parcel handover.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="border border-[#E2E2E2] bg-[#F5F5F3] p-6 sticky top-28 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#111111] pb-3 border-b border-[#E2E2E2]">
                ORDER SUMMARY ({items.length} ITEMS)
              </h2>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-[#E2E2E2] pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 bg-white border border-[#E2E2E2] overflow-hidden">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-wider text-[#111111] line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#666666] uppercase">
                          {item.size} &bull; {item.color} &times; {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#111111] shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-[#E2E2E2] space-y-2 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>
                    Delivery ({isDhaka ? "Inside Dhaka" : "Outside Dhaka"})
                  </span>
                  <span className="font-semibold text-[#111111]">
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </span>
                </div>
                {deliveryCharge === 0 && (
                  <p className="text-[10px] text-[#B6E600] font-bold">
                    * FREE SHIPPING APPLIED
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-[#E2E2E2] flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                  TOTAL AMOUNT
                </span>
                <span className="text-2xl font-black text-[#111111]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="lime"
                disabled={submitting}
                className="w-full h-13 text-xs font-bold uppercase tracking-wider shadow-md"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>VERIFYING & CONFIRMING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>PLACE ORDER (CASH ON DELIVERY)</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="text-[10px] text-[#888888] uppercase tracking-wider text-center space-y-1">
                <p>Prices verified securely on server.</p>
                <p>You can inspect parcel before giving payment to rider.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
