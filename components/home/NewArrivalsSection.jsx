import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function NewArrivalsSection({ products = [] }) {
  // Take up to 6 products
  const displayProducts = products.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-nivora-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
              JUST DROPPED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-nivora-muted transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
