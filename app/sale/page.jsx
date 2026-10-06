import { getProducts } from "@/lib/db";
import ProductCard from "@/components/products/ProductCard";

export const metadata = {
  title: "Winter Sale (Up to 30% Off) — NIVORA",
  description: "Shop discounted premium winter streetwear and essentials from NIVORA.",
};

export default async function SalePage() {
  const allProducts = await getProducts({}, { createdAt: -1 });
  const saleProducts = allProducts.filter(
    (p) => p.oldPrice && p.oldPrice > p.price
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 pb-6 border-b border-[#E2E2E2] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block px-2 py-0.5 bg-[#B6E600] text-[#111111] text-[10px] font-black uppercase tracking-widest mb-2">
            ARCHIVE SALE &bull; UP TO 30% OFF
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            WINTER SALE
          </h1>
          <p className="mt-1 text-xs text-[#666666] uppercase tracking-wider">
            Selected winter essentials with special seasonal markdown pricing.
          </p>
        </div>

        <span className="text-xs uppercase tracking-wider text-[#888888]">
          SHOWING <strong className="text-[#111111]">{saleProducts.length}</strong> SALE ITEMS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {saleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
