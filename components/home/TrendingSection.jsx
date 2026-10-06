import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function TrendingSection({ products = [] }) {
  // Take products 6 to 12 or featured products
  const trendingProducts = products.length >= 6 ? products.slice(6, 12) : products.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E2E2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-[#E2E2E2]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
              COMMUNITY PICKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              TRENDING NOW
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#666666] transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
