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
      title: "Product Not Found — NIVORA",
      description: "The requested winter garment could not be found.",
    };
  }

  return {
    title: `${product.name} — NIVORA | Winter Streetwear`,
    description: product.description || `Buy ${product.name} at NIVORA. Premium winter wear crafted for Bangladesh.`,
    openGraph: {
      title: `${product.name} | NIVORA`,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
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
        <p className="text-xs text-[#666666] uppercase tracking-wider mb-8">
          The requested garment might have sold out or been removed from the archive.
        </p>
        <Link href="/shop" className="btn-primary-lime text-xs">
          BACK TO ALL PRODUCTS
        </Link>
      </div>
    );
  }

  // Fetch 4 related products in same category or featured
  const allProducts = await getProducts({}, { createdAt: -1 });
  const relatedProducts = allProducts
    .filter((p) => p._id !== product._id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
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
      <div className="mt-20 sm:mt-28 pt-12 border-t border-[#E2E2E2]">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E2E2E2]">
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
