"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCartStore();

  const total = getCartTotal();
  const count = getCartCount();
  const freeShippingDiff = FREE_SHIPPING_THRESHOLD - total;
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="p-5 border-b border-nivora-border bg-white">
          <div className="flex items-center justify-between pr-6">
            <SheetTitle className="text-sm font-bold uppercase tracking-widest text-[#111111] flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              SHOPPING BAG ({count})
            </SheetTitle>
          </div>
          {/* Free shipping progress bar */}
          <div className="pt-3">
            <div className="flex justify-between text-[11px] uppercase tracking-wider mb-1.5">
              {freeShippingDiff > 0 ? (
                <span className="text-nivora-muted">
                  ADD <strong className="text-[#111111]">{formatPrice(freeShippingDiff)}</strong> FOR FREE SHIPPING
                </span>
              ) : (
                <span className="text-[#111111] font-bold text-xs">
                  🎉 YOU UNLOCKED FREE SHIPPING!
                </span>
              )}
              <span className="font-bold text-[#111111]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-nivora-light overflow-hidden">
              <div
                className="h-full bg-[#111111] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-nivora-light">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 rounded-full bg-nivora-soft flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-[#888888]" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-1">
                YOUR BAG IS EMPTY
              </p>
              <p className="text-xs text-nivora-muted max-w-xs mb-6">
                Discover our latest drop of heavyweight hoodies, jackets, and knitwear.
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => setDrawerOpen(false)}
                asChild
              >
                <Link href="/shop">EXPLORE COLLECTION</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="py-4 flex gap-4">
                <div className="relative h-24 w-20 shrink-0 bg-nivora-soft border border-nivora-border overflow-hidden">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.slug || ""}`}
                        onClick={() => setDrawerOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-[#888888] hover:text-[#111111] p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-nivora-muted uppercase tracking-wider mt-0.5">
                      SIZE: {item.size} &bull; COLOR: {item.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-nivora-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        className="h-7 w-7 flex items-center justify-center hover:bg-nivora-soft transition-colors"
                        aria-label="Decrease quantity"
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
                        className="h-7 w-7 flex items-center justify-center hover:bg-nivora-soft transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#111111]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer footer with Subtotal & Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-nivora-border bg-nivora-soft space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider font-semibold">
              <span className="text-nivora-muted">SUBTOTAL</span>
              <span className="text-sm font-bold text-[#111111]">{formatPrice(total)}</span>
            </div>
            <p className="text-[10px] text-[#888888] uppercase tracking-wider">
              Shipping & taxes calculated at checkout.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => setDrawerOpen(false)}
                asChild
              >
                <Link href="/cart">VIEW CART</Link>
              </Button>
              <Button
                variant="lime"
                className="w-full text-xs font-bold"
                onClick={() => setDrawerOpen(false)}
                asChild
              >
                <Link href="/checkout" className="flex items-center justify-center gap-1">
                  CHECKOUT
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
