"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product._id);

  const primaryImage = product.images?.[0] || "/images/placeholder.jpg";
  const secondaryImage = product.images?.[1] || primaryImage;

  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      size: product.sizes?.[0] || "M",
      color: product.colors?.[0] || "Standard",
      quantity: 1,
    });
    setAdded(true);
    toast.success(`${product.name} added to bag`);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const addedToWishlist = toggleWishlist(product);
    if (addedToWishlist) {
      toast.success(`${product.name} added to wishlist`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-[#E2E2E2]">
        <Link href={`/product/${product.slug}`} className="relative block h-full w-full">
          {/* Main Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              hovered && secondaryImage !== primaryImage
                ? "opacity-0 scale-105"
                : "opacity-100 group-hover:scale-105"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Secondary Hover Image */}
          {secondaryImage && secondaryImage !== primaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className={`object-cover transition-all duration-500 ${
                hovered ? "opacity-100 scale-105" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {hasDiscount && (
            <Badge variant="sale" className="text-[10px]">
              -{discountPercent}%
            </Badge>
          )}
          {product.newArrival && !hasDiscount && (
            <Badge variant="default" className="text-[10px]">
              NEW
            </Badge>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111111] hover:scale-110 transition-transform shadow-xs"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorited ? "fill-black text-black" : "text-[#111111]"
            }`}
          />
        </button>

        {/* Quick Add Button (Bottom of Image on Desktop Hover / Mobile Tap) */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full h-10 bg-[#111111] text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#B6E600] hover:text-[#111111] transition-all shadow-md active:scale-98"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                ADDED TO BAG
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                QUICK ADD
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#888888]">
          <span>{product.category}</span>
          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  title={col}
                  className="h-2 w-2 rounded-full border border-neutral-300"
                  style={{
                    backgroundColor:
                      col.toLowerCase().includes("black") || col.toLowerCase().includes("onyx")
                        ? "#111111"
                        : col.toLowerCase().includes("cream") || col.toLowerCase().includes("white") || col.toLowerCase().includes("chalk") || col.toLowerCase().includes("ivory")
                        ? "#f5f5f0"
                        : col.toLowerCase().includes("brown") || col.toLowerCase().includes("cocoa") || col.toLowerCase().includes("mocha")
                        ? "#6d4c41"
                        : col.toLowerCase().includes("grey") || col.toLowerCase().includes("charcoal")
                        ? "#757575"
                        : col.toLowerCase().includes("olive")
                        ? "#556b2f"
                        : col.toLowerCase().includes("mustard")
                        ? "#e1ad01"
                        : "#222222",
                  }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-[#888888]">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-xs font-black tracking-tight text-[#111111]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] text-[#888888] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
