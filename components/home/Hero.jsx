"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { BRAND_TAGLINE, BRAND_SUBHEAD } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#111111] overflow-hidden border-b border-[#222222]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh] lg:min-h-[78vh]">
          {/* Left Dark Content Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10 text-white">
            {/* Top Label */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#181818] border border-[#2A2A2A] text-[10px] font-bold uppercase tracking-widest text-[#B6E600] mb-6">
                <Sparkles className="h-3 w-3" />
                NEW WINTER COLLECTION 2026
              </div>

              {/* Main Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-editorial tracking-tight uppercase leading-[0.95] text-white">
                WINTER.
                <br />
                <span className="text-[#B6E600]">REFINED.</span>
              </h1>

              {/* Supporting Subhead */}
              <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A0A0A0]">
                {BRAND_SUBHEAD}
              </p>

              {/* Body Copy */}
              <p className="mt-4 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-md">
                Premium winter essentials designed for comfort, confidence, and effortless everyday style. Heavyweight fleeces, minimal puffers, and architectural knits.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/shop"
                className="btn-primary-lime text-center group"
              >
                <span>SHOP WINTER COLLECTION</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/new-arrivals"
                className="btn-outline-white text-center"
              >
                EXPLORE NEW ARRIVALS
              </Link>
            </div>

            {/* Bottom editorial metadata */}
            <div className="pt-8 border-t border-[#222222] mt-8 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#777777]">
              <span>CURATED FOR BANGLADESH</span>
              <span>EST. 2026</span>
            </div>
          </div>

          {/* Right Cinematic Lifestyle Image Panel */}
          <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-full w-full bg-[#181818] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=85"
              alt="NIVORA Winter Streetwear Campaign"
              fill
              priority
              className="object-cover object-top filter contrast-[1.05]"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {/* Subtle Gradient Overlays for High Contrast & Editorial Mood */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#111111] lg:via-transparent lg:to-transparent" />
            
            {/* Floating Editorial Badge */}
            <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-3 bg-[#111111]/85 backdrop-blur-md border border-[#333333] px-4 py-2 text-white">
              <div className="h-2 w-2 rounded-full bg-[#B6E600] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                HEAVYWEIGHT 480 GSM FLEECE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
