import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Collections — NIVORA | Winter Streetwear",
  description: "Curated seasonal capsules and winter fashion collections designed by NIVORA.",
};

const COLLECTIONS_LIST = [
  {
    title: "Winter Essentials",
    slug: "winter-essentials",
    category: "All",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85",
    description: "The core foundational pieces for colder days. Boxy heavyweight cuts designed to be lived in.",
    count: "12 Styles",
  },
  {
    title: "Streetwear",
    slug: "streetwear",
    category: "Hoodies",
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85",
    description: "Raw silhouettes, architectural draping, and contemporary utilitarian aesthetics.",
    count: "8 Styles",
  },
  {
    title: "Premium Hoodies",
    slug: "premium-hoodies",
    category: "Hoodies",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
    description: "480–500 GSM loopback and French terry fleece with seamless double-lined hoods.",
    count: "6 Styles",
  },
  {
    title: "Everyday Layers",
    slug: "everyday-layers",
    category: "Sweatshirts",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85",
    description: "Clean crewnecks and minimalist knitwear built for effortless modular layering.",
    count: "7 Styles",
  },
  {
    title: "Accessories",
    slug: "accessories",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=85",
    description: "Heavy circular rib beanies, fringed wool scarves, and winter hardware.",
    count: "5 Styles",
  },
];

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12 pb-6 border-b border-[#E2E2E2] text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-2">
          CURATED CAPSULES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          COLLECTIONS
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#666666] uppercase tracking-wider">
          Explore our seasonal drops, material explorations, and streetwear silhouettes.
        </p>
      </div>

      {/* Grid of Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {COLLECTIONS_LIST.map((col, idx) => (
          <div
            key={col.slug}
            className={`group relative overflow-hidden bg-[#181818] border border-[#E2E2E2] flex flex-col justify-end p-8 sm:p-12 ${
              idx === 0 ? "md:col-span-2 aspect-[16/8] sm:aspect-[21/9]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={col.image}
              alt={col.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-[1.08]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="relative z-10 text-white max-w-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600] block mb-1">
                {col.count}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase leading-tight text-white group-hover:text-[#B6E600] transition-colors">
                {col.title}
              </h2>
              <p className="mt-2 text-xs text-[#CCCCCC] leading-relaxed uppercase tracking-wider">
                {col.description}
              </p>
              <div className="mt-6">
                <Link
                  href={`/shop?category=${col.category}`}
                  className="btn-primary-lime text-xs inline-flex items-center gap-2"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
