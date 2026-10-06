import Hero from "@/components/home/Hero";
import BenefitsBar from "@/components/home/BenefitsBar";
import CategorySection from "@/components/home/CategorySection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import PromoBanner from "@/components/home/PromoBanner";
import TrendingSection from "@/components/home/TrendingSection";
import EditorialSection from "@/components/home/EditorialSection";
import SaleSection from "@/components/home/SaleSection";
import InstagramGallery from "@/components/home/InstagramGallery";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getProducts } from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts({}, { createdAt: -1 });

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Benefits Bar */}
      <BenefitsBar />

      {/* 3. Shop by Category */}
      <CategorySection />

      {/* 4. New Arrivals */}
      <NewArrivalsSection products={products} />

      {/* 5. Promotional Banners */}
      <PromoBanner />

      {/* 6. Trending Now */}
      <TrendingSection products={products} />

      {/* 7. Editorial Campaign */}
      <EditorialSection />

      {/* 8. Winter Sale Section */}
      <SaleSection />

      {/* 9. Instagram Gallery */}
      <InstagramGallery />

      {/* 10. Newsletter */}
      <NewsletterSection />
    </div>
  );
}
