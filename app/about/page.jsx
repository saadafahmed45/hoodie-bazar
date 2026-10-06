import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_SUBHEAD } from "@/lib/constants";
import { ArrowRight, ShieldCheck, Feather, Compass } from "lucide-react";

export const metadata = {
  title: "About Us — NIVORA | Winter, Refined.",
  description: "Learn about the craftsmanship, philosophy, and architectural streetwear vision behind NIVORA.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="bg-[#111111] text-white py-20 sm:py-28 border-b border-[#222222]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600] block mb-3">
            OUR PHILOSOPHY
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-editorial tracking-tight uppercase leading-[0.95]">
            WINTER.
            <br />
            REFINED.
          </h1>
          <p className="mt-6 text-xs sm:text-sm text-[#CCCCCC] uppercase tracking-wider max-w-xl mx-auto leading-relaxed">
            Founded with a singular conviction: winter wear in Bangladesh deserves heavyweight architecture, uncompromising natural fibers, and contemporary urban poise.
          </p>
        </div>
      </section>

      {/* Story & Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] bg-[#181818] border border-[#E2E2E2] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85"
              alt="NIVORA Workshop & Design"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-6 text-[#111111]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              THE ARCHITECTURAL APPROACH
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase">
              NOT JUST WARMTH. PROPORTION.
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Mainstream winter wear often sacrifices form for function or uses lightweight synthetic blends that deteriorate after a single season. At NIVORA, every piece is sculpted from custom 400 to 500 GSM loopback cotton terry and virgin wool blends.
            </p>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              We engineer double-layered seamless hoods that stand upright without drawstrings, dropped shoulders with clean draping lines, and ribbed trims calibrated to resist stretching through years of wear.
            </p>

            <div className="pt-4 border-t border-[#E2E2E2] grid grid-cols-3 gap-4 text-xs uppercase tracking-wider">
              <div>
                <strong className="text-lg font-black block font-mono text-[#111111]">480+</strong>
                <span className="text-[#888888] text-[10px]">GSM Fleece</span>
              </div>
              <div>
                <strong className="text-lg font-black block font-mono text-[#111111]">DHAKA</strong>
                <span className="text-[#888888] text-[10px]">Craftsmanship</span>
              </div>
              <div>
                <strong className="text-lg font-black block font-mono text-[#111111]">100%</strong>
                <span className="text-[#888888] text-[10px]">Organic Cotton</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/shop" className="btn-primary-lime text-xs inline-flex items-center gap-2">
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
