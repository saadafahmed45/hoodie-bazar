"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function ProductCarousel({
  badge = "JUST DROPPED",
  title = "NEW ARRIVALS",
  viewAllHref = "/new-arrivals",
  viewAllText = "VIEW ALL",
  products = [],
  categories = [],
  priorityCount = 4,
  showCategoryTabs = false,
  initialCategory = "All",
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Derive categories list dynamically from passed categories or products
  const categoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      const names = categories
        .map((c) => (typeof c === "string" ? c : c.name))
        .filter(Boolean);
      return ["All", ...names];
    }
    if (!products || products.length === 0) return ["All"];
    const catSet = new Set();
    products.forEach((p) => {
      if (p.category) catSet.add(p.category.trim());
    });

    const preferredOrder = [
      "Hoodies",
      "Sweatshirts",
      "Sweaters",
      "Jackets",
      "Accessories",
    ];

    const sorted = Array.from(catSet).sort((a, b) => {
      const idxA = preferredOrder.findIndex(
        (c) => c.toLowerCase() === a.toLowerCase()
      );
      const idxB = preferredOrder.findIndex(
        (c) => c.toLowerCase() === b.toLowerCase()
      );
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ["All", ...sorted];
  }, [categories, products]);

  // Filter products by selected category (handles singular/plural like Sweatshirt vs Sweatshirts)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === "All") return products;
    const cleanSel = selectedCategory.trim().toLowerCase();
    const cleanSingular = cleanSel.replace(/s$/, "");

    return products.filter((p) => {
      if (!p.category) return false;
      const cleanCat = p.category.trim().toLowerCase();
      return (
        cleanCat === cleanSel ||
        cleanCat.replace(/s$/, "") === cleanSingular
      );
    });
  }, [products, selectedCategory]);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    const timer = setTimeout(checkScroll, 150);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, filteredProducts]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  // Determine dynamic View All link based on selected category
  const dynamicViewAllHref =
    selectedCategory === "All"
      ? viewAllHref
      : `/shop?category=${encodeURIComponent(selectedCategory)}`;

  const dynamicViewAllText =
    selectedCategory === "All" ? viewAllText : `VIEW ALL ${selectedCategory.toUpperCase()}`;

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-nivora-border">
        <div>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
              {badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            {title}
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
          {dynamicViewAllHref && (
            <Link
              href={dynamicViewAllHref}
              className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-nivora-muted transition-colors"
            >
              <span>{dynamicViewAllText}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Header Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className="h-8 w-8 rounded-full border border-nivora-border bg-white flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all disabled:opacity-25 disabled:pointer-events-none active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next products"
              className="h-8 w-8 rounded-full border border-nivora-border bg-white flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all disabled:opacity-25 disabled:pointer-events-none active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs (if enabled and more than 1 category exists) */}
      {showCategoryTabs && categoryList.length > 1 && (
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryList.map((cat) => {
            const isActive =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            const cleanCat = cat.toLowerCase();
            const cleanSingular = cleanCat.replace(/s$/, "");
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => {
                    if (!p.category) return false;
                    const pCat = p.category.trim().toLowerCase();
                    return (
                      pCat === cleanCat ||
                      pCat.replace(/s$/, "") === cleanSingular
                    );
                  }).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-white text-[#666666] border border-nivora-border hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-[#888888]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Carousel Wrapper */}
      <div className="relative group/carousel">
        {/* Floating Left Arrow (Desktop Hover) */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous products"
          className={`hidden md:flex absolute -left-4 top-[38%] -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/95 border border-nivora-border shadow-md text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all ${
            canScrollLeft
              ? "opacity-0 group-hover/carousel:opacity-100 hover:scale-105"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Floating Right Arrow (Desktop Hover) */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next products"
          className={`hidden md:flex absolute -right-4 top-[38%] -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white/95 border border-nivora-border shadow-md text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all ${
            canScrollRight
              ? "opacity-0 group-hover/carousel:opacity-100 hover:scale-105"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Product Cards Track / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-nivora-border bg-nivora-soft/40 my-2">
            <p className="text-xs uppercase tracking-wider text-[#666666] font-bold">
              No products found in {selectedCategory}.
            </p>
            <button
              type="button"
              onClick={() => handleCategorySelect("All")}
              className="mt-2 text-xs font-bold uppercase tracking-widest text-[#111111] underline hover:text-nivora-muted cursor-pointer"
            >
              Show all items
            </button>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredProducts.map((product, idx) => (
              <div
                key={product._id || idx}
                className="shrink-0 snap-start w-[calc(50%-8px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <ProductCard product={product} priority={idx < priorityCount} />
              </div>
            ))}
          </div>
        )}

        {/* Subtle Minimal Scroll Indicator */}
        {filteredProducts.length > 4 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="h-0.5 w-24 sm:w-36 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#111111] rounded-full transition-all duration-200"
                style={{
                  width: `${Math.max(
                    20,
                    Math.min(100, (4 / filteredProducts.length) * 100)
                  )}%`,
                  transform: `translateX(${
                    (scrollProgress *
                      (100 -
                        Math.max(
                          20,
                          Math.min(100, (4 / filteredProducts.length) * 100)
                        ))) /
                    100
                  }%)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
