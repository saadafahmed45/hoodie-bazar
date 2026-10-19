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
import { getProducts, getCategories, getHeroSlides } from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, heroSlides] = await Promise.all([
    getProducts({}, { createdAt: -1 }),
    getCategories(),
    getHeroSlides({ activeOnly: true }),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Hoodie Bazar",
    alternateName: ["NIVORA", "HoodieBazar BD"],
    url: siteUrl,
    logo: `${siteUrl}/images/whatsapp-avatar.svg`,
    description:
      "Architectural heavyweight hoodies, oversized sweatshirts, jackets, and winter streetwear essentials crafted for Bangladesh.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801700000000",
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["English", "Bengali"],
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://tiktok.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hoodie Bazar",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* 1. Hero */}
      <Hero initialSlides={heroSlides} />

      {/* 2. Benefits Bar */}
      <BenefitsBar />

      {/* 3. Shop by Category */}
      <CategorySection categories={categories} />

      {/* 4. New Arrivals */}
      <NewArrivalsSection products={products} categories={categories} />

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
