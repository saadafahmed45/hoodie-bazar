"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Pause,
  Play,
  Flame,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  Keyboard,
  A11y,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SLIDES = [
  {
    id: "winter-refined",
    categoryTag: "NEW WINTER COLLECTION 2026",
    categoryIcon: Sparkles,
    badgeText: "HEAVYWEIGHT 480 GSM FLEECE",
    headlineLine1: "WINTER.",
    headlineAccent: "REFINED.",
    subhead: "BUILT FOR COLDER DAYS.",
    description:
      "Architectural heavyweight hoodies engineered with double-lined structured hoods and bespoke 480 GSM French Terry. The definitive modern streetwear uniform.",
    primaryCta: {
      label: "SHOP WINTER COLLECTION",
      href: "/shop",
    },
    secondaryCta: {
      label: "EXPLORE NEW ARRIVALS",
      href: "/new-arrivals",
    },
    image: "https://images.pexels.com/photos/31826316/pexels-photo-31826316.jpeg",
    alt: "NIVORA Heavyweight Hoodie Winter Collection",
    specs: [
      { label: "DENSITY", val: "480 GSM Cotton" },
      { label: "STRUCTURE", val: "Double-Lined Hood" },
      { label: "DELIVERY", val: "24-48h Dhaka" },
    ],
    tabLabel: "01 // HEAVYWEIGHT FLEECE",
    accentColor: "#b6e600",
  },
  {
    id: "oversized-capsule",
    categoryTag: "SIGNATURE STREETWEAR CAPSULE",
    categoryIcon: Flame,
    badgeText: "ARCHITECTURAL OVERSIZED CUT",
    headlineLine1: "OVERSIZED.",
    headlineAccent: "STATEMENT.",
    subhead: "UNCOMPROMISED SILHOUETTES.",
    description:
      "Relaxed drop-shoulder hoodies with reinforced bar-tacked pockets and sculpted drape. Crafted from 100% combed cotton for all-day thermal comfort.",
    primaryCta: {
      label: "SHOP HOODIES",
      href: "/hoodies",
    },
    secondaryCta: {
      label: "VIEW LOOKBOOK",
      href: "/collections",
    },
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=85",
    alt: "Oversized Streetwear Hoodie Drop",
    specs: [
      { label: "FABRIC", val: "100% Combed Terry" },
      { label: "SILHOUETTE", val: "Drop Shoulder" },
      { label: "FINISH", val: "Pre-Shrunk Carbon" },
    ],
    tabLabel: "02 // OVERSIZED CAPSULE",
    accentColor: "#ffffff",
  },
  {
    id: "tactical-outerwear",
    categoryTag: "TECHNICAL OUTERWEAR SERIES",
    categoryIcon: ShieldCheck,
    badgeText: "RIPSTOP THERMAL INSULATION",
    headlineLine1: "TACTICAL.",
    headlineAccent: "WARMTH.",
    subhead: "ENGINEERED FOR THE ELEMENTS.",
    description:
      "High-density down-alternative puffers and architectural windbreakers. Engineered to seal in body heat against piercing winter chills without unnecessary bulk.",
    primaryCta: {
      label: "EXPLORE JACKETS",
      href: "/shop?category=Jackets",
    },
    secondaryCta: {
      label: "VIEW ALL OUTERWEAR",
      href: "/shop",
    },
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=85",
    alt: "Technical Winter Outerwear and Puffers",
    specs: [
      { label: "SHELL", val: "Matte Ripstop Nylon" },
      { label: "INSULATION", val: "High-Loft Eco" },
      { label: "WEATHER", val: "Wind & Mist Shield" },
    ],
    tabLabel: "03 // TACTICAL PUFFERS",
    accentColor: "#b6e600",
  },
  {
    id: "archive-sale",
    categoryTag: "LIMITED SEASONAL CLEARANCE",
    categoryIcon: Tag,
    badgeText: "UP TO 40% OFF • LIMITED RUN",
    headlineLine1: "WINTER SALE.",
    headlineAccent: "ARCHIVE DEALS.",
    subhead: "UP TO 40% OFF SELECTED ESSENTIALS.",
    description:
      "Iconic heavyweight fleece hoodies and minimalist sweatshirts at seasonal discount prices. Free shipping on orders over ৳1,499 with cash on delivery across Bangladesh.",
    primaryCta: {
      label: "SHOP THE SALE",
      href: "/sale",
    },
    secondaryCta: {
      label: "BROWSE CATALOG",
      href: "/shop",
    },
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1600&q=85",
    alt: "Winter Archive Sale Collection",
    specs: [
      { label: "SAVINGS", val: "Up to 40% Off" },
      { label: "SHIPPING", val: "Free Over ৳1,499" },
      { label: "PAYMENT", val: "Nationwide COD" },
    ],
    tabLabel: "04 // ARCHIVE SALE",
    accentColor: "#e2ff3d",
  },
];

export default function Hero({ initialSlides = [] }) {
  const slides =
    Array.isArray(initialSlides) && initialSlides.length > 0
      ? initialSlides
      : SLIDES;

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressFillRef = useRef(null);

  const handleAutoplayTimeLeft = (_swiper, _timeLeft, percentage) => {
    if (progressFillRef.current) {
      // percentage decreases from 1 to 0; progress increases from 0% to 100%
      const progressPercent = Math.min(
        100,
        Math.max(0, (1 - percentage) * 100)
      );
      progressFillRef.current.style.width = `${progressPercent}%`;
    }
  };

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
    if (progressFillRef.current) {
      progressFillRef.current.style.width = "0%";
    }
  };

  const toggleAutoplay = () => {
    if (!swiperInstance) return;
    if (isPlaying) {
      swiperInstance.autoplay?.stop();
      setIsPlaying(false);
    } else {
      swiperInstance.autoplay?.start();
      setIsPlaying(true);
    }
  };

  const goToSlide = (index) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  return (
    <section
      aria-label="Hero Featured Collections"
      className="relative w-full bg-[#111111] overflow-hidden border-b border-[#222222]"
    >
      {/* Main Swiper Slider Container */}
      <div className="relative w-full">
        <Swiper
          modules={[
            Autoplay,
            EffectFade,
            Navigation,
            Pagination,
            Keyboard,
            A11y,
          ]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop={slides.length > 1}
          autoplay={
            slides.length > 1
              ? {
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          keyboard={{ enabled: true }}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          onRealIndexChange={handleSlideChange}
          onAutoplayTimeLeft={handleAutoplayTimeLeft}
          className="w-full"
        >
          {slides.map((slide, idx) => {
            const Icon =
              typeof slide.categoryIcon === "function"
                ? slide.categoryIcon
                : Sparkles;
            const isPriority = idx === 0;
            const slideKey = slide._id || slide.id || idx;
            const specs = Array.isArray(slide.specs) ? slide.specs : [];

            return (
              <SwiperSlide key={slideKey} className="w-full">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[72vh] lg:min-h-[80vh]">
                    {/* Left Dark Content Panel */}
                    <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 text-white bg-[#111111]">
                      {/* Top Meta & Headlines */}
                      <div>
                        {/* Category Badge Pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-nivora-dark border border-[#2A2A2A] text-[10px] font-bold uppercase tracking-widest text-nivora-lime mb-5 shadow-xs">
                          <Icon className="h-3 w-3 animate-pulse" />
                          <span>{slide.categoryTag || "FEATURED COLLECTION"}</span>
                        </div>

                        {/* Main Editorial Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-editorial tracking-tight uppercase leading-[0.93] text-white">
                          {slide.headlineLine1}
                          <br />
                          <span
                            style={{
                              color:
                                slide.accentColor === "#b6e600"
                                  ? "#b6e600"
                                  : slide.accentColor || "#b6e600",
                            }}
                            className={
                              slide.accentColor === "#b6e600"
                                ? "text-nivora-lime"
                                : ""
                            }
                          >
                            {slide.headlineAccent}
                          </span>
                        </h1>

                        {/* Supporting Subhead */}
                        {slide.subhead && (
                          <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A0A0A0]">
                            {slide.subhead}
                          </p>
                        )}

                        {/* Body Copy */}
                        {slide.description && (
                          <p className="mt-3.5 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-md">
                            {slide.description}
                          </p>
                        )}

                        {/* Specifications Pills */}
                        {specs.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-[#222222]/80 grid grid-cols-3 gap-2">
                            {specs.map((spec, specIdx) => (
                              <div
                                key={specIdx}
                                className="bg-nivora-dark border border-[#262626] p-2.5 rounded-xs"
                              >
                                <span className="block text-[9px] uppercase tracking-wider text-[#777777] font-semibold">
                                  {spec.label}
                                </span>
                                <span className="block text-xs font-bold text-white mt-0.5 truncate">
                                  {spec.val}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link
                          href={slide.primaryCta?.href || "/shop"}
                          className="btn-primary-lime text-center group font-bold tracking-wider"
                        >
                          <span>
                            {slide.primaryCta?.label || "SHOP WINTER COLLECTION"}
                          </span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {slide.secondaryCta?.label && (
                          <Link
                            href={slide.secondaryCta?.href || "/new-arrivals"}
                            className="btn-outline-white text-center tracking-wider text-xs"
                          >
                            {slide.secondaryCta.label}
                          </Link>
                        )}
                      </div>

                      {/* Bottom editorial metadata */}
                      <div className="pt-6 border-t border-[#222222] mt-6 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#777777]">
                        <span>CURATED FOR BANGLADESH</span>
                        <span>EST. 2026</span>
                      </div>
                    </div>

                    {/* Right Cinematic Lifestyle Image Panel */}
                    <div className="lg:col-span-7 relative min-h-95 sm:min-h-120 lg:min-h-full w-full bg-nivora-dark overflow-hidden group">
                      <Image
                        src={slide.image}
                        alt={slide.alt || slide.headlineLine1 || "Campaign"}
                        fill
                        priority={isPriority}
                        className="object-cover object-top filter contrast-[1.06] brightness-95 group-hover:scale-103 transition-transform duration-1000 ease-out"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />

                      {/* Gradient Overlays for High Contrast & Editorial Mood */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#111111] via-[#111111]/30 to-transparent lg:bg-linear-to-r lg:from-[#111111] lg:via-[#111111]/20 lg:to-transparent" />

                      {/* Slide Indicator Tag (Top Right) */}
                      <div className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-[#111111]/80 backdrop-blur-md border border-[#333333] px-3.5 py-1.5 text-white">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-nivora-lime">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-mono text-[#888888]">
                          / {String(slides.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Floating Feature Spec Badge (Bottom Right) */}
                      {slide.badgeText && (
                        <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-3 bg-[#111111]/85 backdrop-blur-md border border-[#333333] px-4 py-2 text-white shadow-xl">
                          <div className="h-2 w-2 rounded-full bg-nivora-lime animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
                            {slide.badgeText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* High-Fashion Bottom Navigation & Control Strip */}
      <div className="w-full bg-[#0d0d0d] border-t border-[#222222] relative z-20">
        {/* Autoplay Progress Line (Active across entire bar) */}
        <div className="w-full h-0.5 bg-[#1f1f1f] relative overflow-hidden">
          <div
            ref={progressFillRef}
            className="h-full bg-nivora-lime transition-all duration-100 ease-linear"
            style={{ width: "0%" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Slide Quick Navigation Tabs (Desktop & Tablet) */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
              {slides.map((slide, tabIdx) => {
                const isActive = activeIndex === tabIdx;
                const tabLabel =
                  slide.tabLabel || `0${tabIdx + 1} // ${slide.headlineLine1}`;
                return (
                  <button
                    key={slide._id || slide.id || tabIdx}
                    onClick={() => goToSlide(tabIdx)}
                    className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border rounded-xs cursor-pointer ${
                      isActive
                        ? "bg-[#1f1f1f] border-nivora-lime text-nivora-lime shadow-xs"
                        : "bg-transparent border-transparent text-[#777777] hover:text-white hover:border-[#333333]"
                    }`}
                  >
                    <span>{tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Slide Dots (Mobile Only) */}
            <div className="flex md:hidden items-center gap-2">
              {slides.map((slide, dotIdx) => {
                const isActive = activeIndex === dotIdx;
                return (
                  <button
                    key={slide._id || slide.id || dotIdx}
                    onClick={() => goToSlide(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      isActive
                        ? "w-8 bg-nivora-lime"
                        : "w-2 bg-[#333333] hover:bg-[#555555]"
                    }`}
                  />
                );
              })}
            </div>

            {/* Right Controls: Play/Pause, Slide Index, Prev/Next Arrows */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Play / Pause Toggle Button */}
              {slides.length > 1 && (
                <button
                  onClick={toggleAutoplay}
                  aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#888888] hover:text-white transition-colors bg-nivora-dark border border-[#262626] px-2.5 py-1.5 rounded-xs cursor-pointer"
                  title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3 w-3 text-nivora-lime" />
                      <span className="hidden sm:inline">PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 text-nivora-lime" />
                      <span className="hidden sm:inline">PLAY</span>
                    </>
                  )}
                </button>
              )}

              {/* Slide Counter */}
              <div className="flex items-center text-xs font-mono font-bold tracking-widest text-nivora-muted select-none">
                <span className="text-nivora-lime font-bold">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-[#444444]">/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </div>

              {/* Prev / Next Chevrons */}
              {slides.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => swiperInstance?.slidePrev()}
                    aria-label="Previous slide"
                    className="p-2 bg-nivora-dark hover:bg-nivora-lime hover:text-black border border-[#2a2a2a] text-white transition-all duration-200 rounded-xs cursor-pointer active:scale-95 group"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => swiperInstance?.slideNext()}
                    aria-label="Next slide"
                    className="p-2 bg-nivora-dark hover:bg-nivora-lime hover:text-black border border-[#2a2a2a] text-white transition-all duration-200 rounded-xs cursor-pointer active:scale-95 group"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
