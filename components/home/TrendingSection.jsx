import ProductCarousel from "@/components/products/ProductCarousel";

export default function TrendingSection({ products = [] }) {
  const trending = products.filter((p) => p.featured === true);
  const displayProducts =
    trending.length > 0
      ? trending
      : products.length > 4
      ? products.slice(4)
      : products;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          badge="COMMUNITY PICKS"
          title="TRENDING NOW"
          viewAllHref="/shop"
          viewAllText="VIEW ALL"
          products={displayProducts}
          priorityCount={4}
        />
      </div>
    </section>
  );
}

