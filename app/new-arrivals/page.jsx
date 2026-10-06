import { getProducts } from "@/lib/db";
import ProductCard from "@/components/products/ProductCard";

export const metadata = {
  title: "New Arrivals — NIVORA | Winter Streetwear",
  description: "Explore the latest winter drop from NIVORA. Heavyweight oversized hoodies, jackets, and knitwear.",
};

export default async function NewArrivalsPage() {
  const allProducts = await getProducts({}, { createdAt: -1 });
  const newArrivals = allProducts.filter((p) => p.newArrival === true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 pb-6 border-b border-[#E2E2E2]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
          JUST LANDED
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          NEW ARRIVALS
        </h1>
        <p className="mt-1 text-xs text-[#666666] uppercase tracking-wider">
          The newest additions to our winter lineup. Limited seasonal quantities.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
