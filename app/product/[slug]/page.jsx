import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductGallery from "@/components/products/ProductGallery";
import ProductPurchaseArea from "@/components/products/ProductPurchaseArea";
import ProductCard from "@/components/products/ProductCard";

export async function generateMetadata(props) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested winter garment could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";
  const productUrl = `${siteUrl}/product/${slug}`;
  const firstImage = product.images?.[0] || `${siteUrl}/images/placeholder.jpg`;

  return {
    title: `${product.name} — Premium Heavyweight Streetwear`,
    description:
      product.description ||
      `Buy ${product.name} online at Hoodie Bazar. Premium heavyweight cotton, boxy relaxed cut, and nationwide Cash on Delivery in Bangladesh.`,
    keywords: [
      product.name,
      product.category,
      "hoodie bazar",
      "heavyweight hoodie",
      "winter streetwear bangladesh",
      "cash on delivery",
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | Hoodie Bazar`,
      description:
        product.description ||
        `Buy ${product.name} at Hoodie Bazar. 100% combed cotton, 7-day returns, nationwide delivery.`,
      url: productUrl,
      siteName: "Hoodie Bazar",
      locale: "en_BD",
      type: "website",
      images: [
        {
          url: firstImage,
          width: 1000,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Hoodie Bazar`,
      description: product.description,
      images: [firstImage],
    },
  };
}

export default async function ProductDetailPage(props) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black font-editorial uppercase text-[#111111] mb-2">
          PRODUCT NOT FOUND
        </h1>
        <p className="text-xs text-nivora-muted uppercase tracking-wider mb-8">
          The requested garment might have sold out or been removed from the archive.
        </p>
        <Link href="/shop" className="btn-primary-lime text-xs">
          BACK TO ALL PRODUCTS
        </Link>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";
  const productUrl = `${siteUrl}/product/${slug}`;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [`${siteUrl}/images/placeholder.jpg`];

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: images,
    description:
      product.description ||
      `Premium ${product.category} from Hoodie Bazar. Crafted for colder days.`,
    sku: String(product._id || slug),
    brand: {
      "@type": "Brand",
      name: "Hoodie Bazar",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Hoodie Bazar",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${siteUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${siteUrl}/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  // Fetch 4 related products in same category or featured
  const allProducts = await getProducts({}, { createdAt: -1 });
  const relatedProducts = allProducts
    .filter((p) => p._id !== product._id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Product & Breadcrumb JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-[#888888]">
        <Link href="/shop" className="hover:text-[#111111] flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          SHOP
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-[#111111]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#111111] font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Two-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (7 columns) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images || []} name={product.name} />
        </div>

        {/* Right: Purchase & Details (5 columns) */}
        <div className="lg:col-span-5">
          <ProductPurchaseArea product={product} />
        </div>
      </div>

      {/* YOU MAY ALSO LIKE Section */}
      <div className="mt-20 sm:mt-28 pt-12 border-t border-nivora-border">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-nivora-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
              CURATED PAIRINGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              YOU MAY ALSO LIKE
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
          >
            VIEW ALL &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel._id} product={rel} />
          ))}
        </div>
      </div>
    </div>
  );
}
