import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function EditorialSection() {
  return (
    <section className="bg-[#111111] text-white overflow-hidden border-b border-[#222222]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-20 z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600] block mb-4">
              EDITORIAL CAMPAIGN &bull; VOLUME 01
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-editorial tracking-tight uppercase leading-[0.95] text-white">
              THE WINTER
              <br />
              <span className="text-white/80">ESSENTIALS</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg font-bold uppercase tracking-wider text-[#B6E600]">
              Everyday layers. Elevated.
            </p>

            <p className="mt-4 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-md">
              A curated study in form, proportion, and texture. Each garment is engineered from dense natural fibers to provide natural insulation while maintaining a sharp urban silhouette.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="btn-primary-lime text-center group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/collections"
                className="btn-outline-white text-center"
              >
                VIEW LOOKBOOK
              </Link>
            </div>

            <div className="mt-12 pt-6 border-t border-[#222222] flex items-center gap-8 text-[11px] uppercase tracking-wider text-[#666666]">
              <div>
                <strong className="text-white block font-mono text-sm">480 GSM</strong>
                <span>Heavyweight Cotton</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-sm">100%</strong>
                <span>Pre-Shrunk Silhouette</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-sm">LIMITED</strong>
                <span>Single Seasonal Run</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Visual */}
          <div className="lg:col-span-6 relative aspect-[4/5] lg:aspect-auto lg:h-[640px] w-full bg-[#181818]">
            <Image
              src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85"
              alt="The Winter Essentials Editorial"
              fill
              className="object-cover object-center filter contrast-[1.08]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
