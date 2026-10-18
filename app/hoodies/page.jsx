import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import HoodiesClient from "./HoodiesClient";

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";

export const metadata = {
  title: "Hoodies for Women — Solid Color & Oversized Hoodie Styles",
  description:
    "Shop solid color hoodies and oversized hoodie styles for women. Clear hoodie price in Bangladesh on every card, nationwide Cash on Delivery & 7-day returns.",
  keywords: [
    "solid color hoodies",
    "hoodies for women",
    "oversized hoodie",
    "hoodie price in Bangladesh",
    "solid color hoodies for women",
    "oversized hoodie bd",
    "heavyweight hoodies dhaka",
    "buy hoodies online bangladesh",
    "cotton fleece hoodie bd",
  ],
  alternates: {
    canonical: "/hoodies",
  },
  openGraph: {
    title: "Solid Color & Oversized Hoodies for Women | Hoodie Bazar",
    description:
      "Solid color hoodies and oversized hoodie styles for women, with hoodie price in Bangladesh shown upfront. Free delivery over ৳1,499.",
    url: "/hoodies",
    siteName: "Hoodie Bazar",
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: "/images/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Solid color hoodies for women — Hoodie Bazar collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solid Color & Oversized Hoodies for Women | Hoodie Bazar",
    description:
      "Shop solid color hoodies and oversized hoodie styles with clear hoodie prices in Bangladesh.",
    images: ["/images/placeholder.jpg"],
  },
};

const PRICE_TIERS = [
  { label: "Under ৳1,500", min: 0, max: 1499 },
  { label: "৳1,500 – ৳2,499", min: 1500, max: 2499 },
  { label: "৳2,500 & above", min: 2500, max: Number.POSITIVE_INFINITY },
];

const RELATED_LINKS = [
  { label: "All Hoodies", href: "/shop?category=Hoodies" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Premium Hoodies", href: "/collections" },
  { label: "Winter Sale", href: "/sale" },
];

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function HoodiesPage() {
  const [products, categories] = await Promise.all([
    getProducts({}, { createdAt: -1 }),
    getCategories(),
  ]);

  const allProducts = Array.isArray(products) ? products : [];
  const hoodies = allProducts.filter((p) =>
    /^hoodies?$/i.test(String(p.category || "").trim())
  );

  const oversizedHoodies = hoodies.filter((p) =>
    /oversized|boxy|drop[- ]?shoulder|relaxed/i.test(
      `${p.name || ""} ${p.description || ""} ${(p.tags || []).join(" ")}`
    )
  );

  const solidColorHoodies = hoodies.filter(
    (p) => Array.isArray(p.colors) && p.colors.length <= 1
  );

  const hoodiePrices = hoodies
    .map((p) => Number(p.price))
    .filter((price) => Number.isFinite(price) && price > 0);
  const minPrice = hoodiePrices.length ? Math.min(...hoodiePrices) : null;
  const maxPrice = hoodiePrices.length ? Math.max(...hoodiePrices) : null;

  const priceFAQs = [
    {
      question: "What is the hoodie price in Bangladesh at Hoodie Bazar?",
      answer:
        minPrice && maxPrice
          ? `Hoodie price in Bangladesh at Hoodie Bazar starts at ${formatPrice(minPrice)} for everyday styles and goes up to ${formatPrice(maxPrice)} for heavyweight premium fleece. Every product card shows the final price in BDT, and nationwide Cash on Delivery is available on all hoodies.`
          : "Hoodie price in Bangladesh at Hoodie Bazar is listed upfront in BDT on every product card, with lightweight styles priced affordably and heavyweight premium fleece hoodies priced higher. Nationwide Cash on Delivery is available on every order.",
    },
    {
      question: "Do you have hoodies for women in solid colors?",
      answer:
        "Yes. Our solid color hoodies for women are cut from soft cotton-blend fleece in black, white, grey, navy, olive, beige and more. Use the solid color swatches on this page to filter the collection instantly.",
    },
    {
      question: "What size should I choose for an oversized hoodie?",
      answer:
        "Every oversized hoodie on this page is designed with a boxy, drop-shoulder fit and runs from S to XXL. Choose your usual size for a relaxed streetwear fit, or size up one for an extra-baggy silhouette.",
    },
    {
      question: "Do you deliver hoodies outside Dhaka?",
      answer:
        "We deliver hoodies across Bangladesh, including Dhaka, Chattogram, Sylhet and Khulna, typically within 2–4 business days. Delivery is free on orders over ৳1,499, with a 7-day return guarantee.",
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hoodies",
        item: `${siteUrl}/hoodies`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hoodies for Women — Solid Color & Oversized Hoodies",
    description:
      "Solid color hoodies, oversized hoodie styles and heavyweight fleece hoodies for women, with hoodie price in Bangladesh listed in BDT.",
    url: `${siteUrl}/hoodies`,
    isPartOf: {
      "@type": "WebSite",
      name: "Hoodie Bazar",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: hoodies.length,
      itemListElement: hoodies.slice(0, 12).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          url: `${siteUrl}/product/${product.slug}`,
          image: product.images?.[0],
          brand: { "@type": "Brand", name: "Hoodie Bazar" },
          color: product.colors?.[0],
          size: product.sizes?.join(", "),
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "BDT",
            availability:
              Number(product.stock) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${siteUrl}/product/${product.slug}`,
          },
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: priceFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-white">
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#888888]">
            <li>
              <Link href="/" className="hover:text-[#111111] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#cccccc]">
              /
            </li>
            <li aria-current="page" className="text-[#111111]">
              Hoodies
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="mb-12 pb-8 border-b border-nivora-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-2">
            WINTER 2026 · HOODIE COLLECTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase text-[#111111] max-w-3xl">
            Hoodies for Women — Solid Color &amp; Oversized Hoodie Styles
          </h1>
          <p className="mt-4 text-sm text-nivora-muted leading-relaxed max-w-2xl">
            Our edit of solid color hoodies for women is built from heavyweight
            cotton-blend fleece in clean, wearable tones. Every oversized hoodie
            is cut boxy with a drop-shoulder line, and hoodie price in
            Bangladesh is shown upfront in BDT — no surprises at checkout.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-[#111111]">
            {[
              minPrice ? `Starting at ${formatPrice(minPrice)}` : "Priced in BDT",
              "Free delivery over ৳1,499",
              "Cash on Delivery nationwide",
              "7-day returns",
            ].map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-nivora-lime"
                />
                {fact}
              </li>
            ))}
          </ul>
        </header>

        {/* Main Product Section */}
        <section aria-labelledby="shop-hoodies-heading" className="mb-20">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2
                id="shop-hoodies-heading"
                className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]"
              >
                Shop Solid Color Hoodies
              </h2>
              <p className="mt-1 text-xs text-nivora-muted uppercase tracking-wider">
                Filter by category, solid color swatch, size and price.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-[11px] font-bold uppercase tracking-widest text-[#111111] hover:text-nivora-muted inline-flex items-center gap-1.5 transition-colors"
            >
              VIEW FULL SHOP
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <HoodiesClient
            initialProducts={allProducts}
            initialCategories={categories}
            initialCategory="Hoodies"
          />
        </section>

        {/* Oversized Hoodie Collection */}
        <section aria-labelledby="oversized-heading" className="mb-20">
          <h2
            id="oversized-heading"
            className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]"
          >
            Oversized Hoodie Collection
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nivora-muted leading-relaxed">
            An oversized hoodie is measured by its drape: a wider chest, dropped
            shoulders and a longer back hem. These are the boxiest heavyweight
            cuts in our hoodie collection for women and men.
          </p>

          {oversizedHoodies.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {oversizedHoodies.slice(0, 4).map((product, idx) => (
                <li key={product._id || product.slug}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-nivora-soft border border-nivora-border">
                      <Image
                        src={product.images?.[0] || "/images/placeholder.jpg"}
                        alt={`${product.name} — oversized hoodie`}
                        fill
                        priority={idx < 2}
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="mt-3 text-xs font-bold uppercase tracking-wider text-[#111111] group-hover:text-nivora-muted transition-colors line-clamp-1">
                      {product.name}
                    </span>
                    <span className="mt-1 text-xs font-black tracking-tight text-[#111111]">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              aria-hidden="true"
            >
              {Array.from({ length: 4 }).map((_, idx) => (
                <li key={idx} className="flex flex-col">
                  <div className="aspect-3/4 w-full bg-nivora-soft border border-dashed border-nivora-border" />
                  <span className="mt-3 text-xs font-bold uppercase tracking-wider text-[#888888]">
                    Oversized hoodie — arriving soon
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6">
            <Link
              href="/shop?category=Hoodies"
              className="btn-primary-lime text-xs inline-flex items-center gap-2"
            >
              <span>SHOP ALL OVERSIZED HOODIES</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </p>
        </section>

        {/* Hoodie Price in Bangladesh */}
        <section aria-labelledby="price-heading" className="mb-20">
          <h2
            id="price-heading"
            className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]"
          >
            Hoodie Price in Bangladesh
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-nivora-muted leading-relaxed">
            Hoodie price in Bangladesh varies by fabric weight and finish. Here
            is how our current hoodie collection is priced, updated automatically
            as styles come in and out of stock.
          </p>

          <div className="mt-6 overflow-hidden border border-nivora-border">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">
                Hoodie price in Bangladesh by price range at Hoodie Bazar
              </caption>
              <thead>
                <tr className="bg-nivora-soft text-[10px] uppercase tracking-widest text-[#111111]">
                  <th scope="col" className="px-4 sm:px-6 py-3 font-bold">
                    Price Range (BDT)
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 font-bold">
                    Hoodie Styles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nivora-border text-nivora-muted">
                {PRICE_TIERS.map((tier) => {
                  const count = hoodies.filter((p) => {
                    const price = Number(p.price);
                    return (
                      Number.isFinite(price) && price >= tier.min && price <= tier.max
                    );
                  }).length;

                  return (
                    <tr key={tier.label}>
                      <th
                        scope="row"
                        className="px-4 sm:px-6 py-4 font-bold text-[#111111] uppercase tracking-wider"
                      >
                        {tier.label}
                      </th>
                      <td className="px-4 sm:px-6 py-4">
                        {count > 0
                          ? `${count} ${count === 1 ? "style" : "styles"}`
                          : "Coming soon"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div className="mt-10">
            <h3 className="text-lg font-black font-editorial tracking-tight uppercase text-[#111111]">
              Hoodie Shopping FAQ
            </h3>
            <dl className="mt-4 divide-y divide-nivora-border border-y border-nivora-border">
              {priceFAQs.map((faq) => (
                <div key={faq.question} className="py-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm text-nivora-muted leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Related Collections */}
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-2xl font-black font-editorial tracking-tight uppercase text-[#111111]"
          >
            Shop Related Collections
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center border border-nivora-border px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#111111] hover:bg-nivora-soft transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
