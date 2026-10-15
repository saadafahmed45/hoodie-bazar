"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function TopSellingProducts({ storeProducts = [] }) {
  const productsToDisplay = (storeProducts.length > 0 ? storeProducts : [
    {
      _id: "p-1",
      name: "Premium Oversized Hoodie",
      category: "Hoodies",
      price: 1490,
      stock: 28,
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"],
    },
    {
      _id: "p-2",
      name: "Heavyweight Crewneck",
      category: "Sweatshirts",
      price: 1690,
      stock: 22,
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=300&q=80"],
    },
    {
      _id: "p-3",
      name: "Urban Puffer Winter Jacket",
      category: "Jackets",
      price: 2490,
      stock: 8,
      images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80"],
    },
  ]).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div>
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
            Top Catalog Products
          </h2>
          <p className="text-[11px] text-[#888888] font-medium">
            Best-selling winter outerwear
          </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#111111] hover:underline transition"
        >
          <span>All Products</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product List */}
      <div className="space-y-3.5 my-auto">
        {productsToDisplay.map((prod) => {
          const isAvailable = (prod.stock || 0) > 0;
          const isLowStock = isAvailable && prod.stock <= 10;
          const imgUrl = prod.images?.[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80";

          return (
            <div
              key={prod._id}
              className="flex items-center justify-between gap-3 group hover:bg-slate-50 p-1.5 rounded-xl transition"
            >
              {/* Left: Thumbnail + Name + Price */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/80">
                  <Image
                    src={imgUrl}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#111111] truncate leading-snug transition uppercase tracking-tight">
                    {prod.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold text-[#111111]">
                      {formatPrice(prod.price)}
                    </span>
                    <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider">
                      • {prod.category || "Apparel"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Status + Stock Count */}
              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLowStock
                        ? "bg-amber-500"
                        : isAvailable
                        ? "bg-[#557700]"
                        : "bg-rose-500"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isLowStock
                        ? "text-amber-700"
                        : isAvailable
                        ? "text-[#557700]"
                        : "text-rose-600"
                    }`}
                  >
                    {isLowStock ? "Low Stock" : isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-[9px] text-[#888888] mt-0.5 font-medium">
                  {isAvailable ? `${prod.stock} in stock` : "Restocking soon"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
