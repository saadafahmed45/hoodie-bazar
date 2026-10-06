import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export default function SaleSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E2E2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#111111] p-8 sm:p-14 lg:p-16 border border-[#222222]">
          {/* Subtle geometric pattern or background accent */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#B6E600]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#181818] border border-[#2A2A2A] text-[10px] font-bold uppercase tracking-widest text-[#B6E600] mb-4">
                <Tag className="h-3 w-3" />
                LIMITED PERIOD ARCHIVE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-editorial tracking-tight uppercase text-white leading-none">
                WINTER SALE
              </h2>

              <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#B6E600]">
                UP TO 30% OFF
              </p>

              <p className="mt-3 text-xs sm:text-sm text-[#A0A0A0] uppercase tracking-wider max-w-md">
                Selected heavyweight hoodies, knitwear, and winter accessories. No code needed.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/sale"
                className="btn-primary-lime text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg"
              >
                <span>SHOP SALE</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
