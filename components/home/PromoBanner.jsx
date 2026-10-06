import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-12 sm:py-16 bg-nivora-soft border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Banner 1 */}
          <div className="relative aspect-16/10 sm:aspect-video overflow-hidden bg-nivora-dark border border-nivora-border flex flex-col justify-end p-6 sm:p-10 group">
            <Image
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"
              alt="New Winter Drop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-[1.1]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime block mb-2">
                FALL / WINTER 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase leading-none text-white">
                NEW WINTER DROP
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#CCCCCC] uppercase tracking-wider">
                Designed for colder days and everyday comfort.
              </p>
              <div className="mt-5">
                <Link
                  href="/shop?category=Jackets"
                  className="btn-primary-lime text-xs inline-flex items-center gap-2 group-hover:bg-white transition-colors"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative aspect-16/10 sm:aspect-video overflow-hidden bg-nivora-dark border border-nivora-border flex flex-col justify-end p-6 sm:p-10 group">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"
              alt="Limited Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75 contrast-[1.1]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block mb-2">
                EXCLUSIVE RUN
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase leading-none text-white">
                LIMITED COLLECTION
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#CCCCCC] uppercase tracking-wider">
                Essential styles. Limited quantities.
              </p>
              <div className="mt-5">
                <Link
                  href="/collections"
                  className="btn-outline-white text-xs inline-flex items-center gap-2"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
