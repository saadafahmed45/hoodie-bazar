import ProductCarousel from "@/components/products/ProductCarousel";

export default function NewArrivalsSection({ products = [], categories = [] }) {
  return (
    <section id="new-arrivals" className="py-16 sm:py-20 bg-white border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          badge="JUST DROPPED"
          title="NEW ARRIVALS"
          viewAllHref="/new-arrivals"
          viewAllText="VIEW ALL"
          products={products}
          categories={categories}
          showCategoryTabs={true}
          priorityCount={4}
        />
      </div>
    </section>
  );
}

