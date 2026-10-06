"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import {
  DELIVERY_CHARGE_INSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#EEEEEE] w-48 mx-auto" />
          <div className="h-4 bg-[#EEEEEE] w-72 mx-auto" />
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const count = getCartCount();
  const deliveryEstimated =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE_INSIDE_DHAKA;
  const total = subtotal + deliveryEstimated;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#E2E2E2] flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
            SHOPPING BAG
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            YOUR CART ({count})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-[#888888] hover:text-[#111111] underline"
          >
            CLEAR BAG
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[#E2E2E2] p-8 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-[#F5F5F3] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-[#888888]" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-widest text-[#111111] mb-2">
            YOUR CART IS CURRENTLY EMPTY.
          </h2>
          <p className="text-xs text-[#666666] leading-relaxed mb-6">
            Explore our collection of heavyweight oversized hoodies, relaxed jackets, and knitwear.
          </p>
          <Button variant="lime" size="default" asChild>
            <Link href="/shop" className="flex items-center gap-2">
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="divide-y divide-[#E2E2E2] border border-[#E2E2E2]">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:bg-[#FAF9F7] transition-colors"
                >
                  {/* Image & Details */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-20 shrink-0 bg-[#F5F5F3] border border-[#E2E2E2] overflow-hidden">
                      <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#888888]">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                        <Link
                          href={`/product/${item.slug || ""}`}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#666666] uppercase tracking-wider mt-1">
                        SIZE: <strong className="text-[#111111]">{item.size}</strong> &bull; COLOR: <strong className="text-[#111111]">{item.color}</strong>
                      </p>
                      <p className="text-xs font-bold text-[#111111] mt-1 sm:hidden">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity, Item Total & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-[#EEEEEE]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E2E2E2] h-9">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="h-full px-2.5 flex items-center justify-center hover:bg-[#F5F5F3]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        className="h-full px-2.5 flex items-center justify-center hover:bg-[#F5F5F3]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Total for item */}
                    <span className="text-sm font-bold text-[#111111] min-w-[70px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="p-1.5 text-[#888888] hover:text-[#111111] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider text-[#111111] font-semibold hover:underline"
              >
                &larr; CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Order Summary Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="border border-[#E2E2E2] bg-[#F5F5F3] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#111111] pb-3 border-b border-[#E2E2E2]">
                ORDER SUMMARY
              </h2>

              <div className="space-y-2.5 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-[#666666]">
                  <span>SUBTOTAL</span>
                  <span className="font-semibold text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>DELIVERY (ESTIMATED)</span>
                  <span className="font-semibold text-[#111111]">
                    {deliveryEstimated === 0 ? "FREE" : formatPrice(deliveryEstimated)}
                  </span>
                </div>
                {deliveryEstimated === 0 && (
                  <p className="text-[10px] text-[#B6E600] font-bold">
                    * FREE SHIPPING QUALIFIED (ORDERS &gt; ৳{FREE_SHIPPING_THRESHOLD})
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E2E2E2] flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                  TOTAL
                </span>
                <span className="text-xl font-black text-[#111111]">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                variant="lime"
                className="w-full h-12 text-xs font-bold uppercase tracking-wider mt-4"
                asChild
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="pt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-[#888888]">
                <ShieldCheck className="h-4 w-4 text-[#111111]" />
                <span>SECURE CHECKOUT &bull; CASH ON DELIVERY</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
