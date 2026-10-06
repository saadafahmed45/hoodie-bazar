import Link from "next/image";
import NextLink from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function CategorySection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-2">
            ESSENTIAL SILHOUETTES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            SHOP BY CATEGORY
          </h2>
          <div className="h-0.5 w-12 bg-[#111111] mx-auto mt-3" />
        </div>

        {/* 5 Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <NextLink
              key={cat.slug}
              href={`/shop?category=${cat.name}`}
              className="group relative aspect-3/4 overflow-hidden bg-nivora-dark border border-nivora-border flex flex-col justify-end p-4 transition-all"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 contrast-[1.05]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Dark Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black font-editorial tracking-wider uppercase text-white group-hover:text-nivora-lime transition-colors">
                    {cat.name}
                  </h3>
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-nivora-lime group-hover:text-[#111111] transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-nivora-lime mt-1.5 inline-block group-hover:underline">
                  SHOP NOW &rarr;
                </span>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}
