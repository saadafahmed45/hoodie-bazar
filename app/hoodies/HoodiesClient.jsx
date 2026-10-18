"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SOLID_COLORS = [
  { name: "Black", hex: "#111111", match: ["black", "onyx"] },
  { name: "White", hex: "#f7f7f5", match: ["white", "chalk", "ivory", "cream"] },
  { name: "Grey", hex: "#9a9a9a", match: ["grey", "gray", "charcoal", "heather"] },
  { name: "Navy", hex: "#1f2a44", match: ["navy", "midnight", "indigo"] },
  { name: "Olive", hex: "#556b2f", match: ["olive", "khaki"] },
  { name: "Beige", hex: "#d9c7a7", match: ["beige", "sand", "tan", "stone"] },
  { name: "Brown", hex: "#6d4c41", match: ["brown", "cocoa", "mocha", "coffee"] },
  { name: "Red", hex: "#8f2d2d", match: ["red", "maroon", "burgundy"] },
];

function ProductCardPlaceholder() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <div className="aspect-3/4 w-full bg-nivora-soft border border-dashed border-nivora-border animate-pulse" />
      <div className="pt-3 flex flex-col gap-2">
        <div className="h-2.5 w-14 bg-nivora-soft animate-pulse" />
        <div className="h-3 w-3/4 bg-nivora-soft animate-pulse" />
        <div className="h-3 w-1/3 bg-nivora-soft animate-pulse" />
      </div>
    </div>
  );
}

export default function HoodiesClient({
  initialProducts = [],
  initialCategories = [],
  initialCategory = "Hoodies",
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: null,
    max: null,
  });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const hasActiveFilters =
    selectedCategory !== initialCategory ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedPriceRange.min !== null ||
    selectedPriceRange.max !== null ||
    inStockOnly;

  const handleToggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleReset = () => {
    setSelectedCategory(initialCategory);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange({ min: null, max: null });
    setInStockOnly(false);
    setSortBy("featured");
  };

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory && selectedCategory !== "All") {
      const targetBase = selectedCategory.toLowerCase().replace(/s$/, "");
      list = list.filter((p) => {
        if (!p.category) return false;
        const pBase = p.category.toLowerCase().replace(/s$/, "");
        return (
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          pBase === targetBase
        );
      });
    }

    if (selectedColors.length > 0) {
      const matchTerms = selectedColors.flatMap(
        (name) =>
          SOLID_COLORS.find((c) => c.name === name)?.match || [name.toLowerCase()]
      );
      list = list.filter((p) => {
        const productColors = (p.colors || []).map((c) =>
          String(c).toLowerCase()
        );
        if (productColors.length === 0) return false;
        return productColors.some((color) =>
          matchTerms.some((term) => color.includes(term))
        );
      });
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        (p.sizes || []).some((s) => selectedSizes.includes(s))
      );
    }

    if (selectedPriceRange.min !== null) {
      list = list.filter((p) => p.price >= selectedPriceRange.min);
    }
    if (selectedPriceRange.max !== null) {
      list = list.filter((p) => p.price <= selectedPriceRange.max);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [
    initialProducts,
    selectedCategory,
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div>
      {/* Toolbar: Solid color swatches, count, sort, mobile filters */}
      <div className="mb-8 flex flex-col gap-5">
        <fieldset className="min-w-0">
          <legend className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-3">
            SOLID COLOR OPTIONS
          </legend>
          <div className="flex flex-wrap items-center gap-2.5">
            {SOLID_COLORS.map((color) => {
              const isActive = selectedColors.includes(color.name);
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleToggleColor(color.name)}
                  aria-pressed={isActive}
                  title={color.name}
                  className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                    isActive
                      ? "border-[#111111] scale-110 shadow-md"
                      : "border-nivora-border hover:border-[#888888] hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">
                    {color.name} solid color hoodies
                  </span>
                  {isActive && (
                    <X
                      className="absolute inset-0 m-auto h-3.5 w-3.5 text-white mix-blend-difference"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
            {selectedColors.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedColors([])}
                className="ml-1 text-[11px] uppercase tracking-wider text-[#111111] font-semibold hover:underline"
              >
                Clear colors
              </button>
            )}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3 border-t border-nivora-border pt-5">
          <p className="text-xs uppercase tracking-wider text-[#888888]">
            SHOWING{" "}
            <strong className="text-[#111111]">{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "STYLE" : "STYLES"}
            {selectedColors.length > 0 && (
              <span className="hidden sm:inline">
                {" "}
                IN {selectedColors.join(", ")}
              </span>
            )}
          </p>

          <div className="flex items-center gap-3">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-2 text-xs"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  FILTERS
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-75 p-6 overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-sm font-bold uppercase tracking-widest">
                    FILTER HOODIES
                  </SheetTitle>
                </SheetHeader>
                <ProductFilters
                  categories={initialCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  selectedSizes={selectedSizes}
                  onToggleSize={handleToggleSize}
                  selectedPriceRange={selectedPriceRange}
                  onSelectPriceRange={setSelectedPriceRange}
                  inStockOnly={inStockOnly}
                  onToggleInStock={setInStockOnly}
                  onReset={handleReset}
                />
              </SheetContent>
            </Sheet>

            <div className="w-44 sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 text-xs uppercase tracking-wider">
                  <SelectValue placeholder="SORT BY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar filters + product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1">
          <ProductFilters
            categories={initialCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSizes={selectedSizes}
            onToggleSize={handleToggleSize}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            onReset={handleReset}
          />
        </aside>

        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-nivora-border">
              <p className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                NO HOODIES MATCH YOUR SELECTION
              </p>
              <p className="text-xs text-nivora-muted max-w-sm mx-auto mb-6">
                Try clearing a solid color swatch or resetting the category and
                size filters.
              </p>
              <Button variant="default" size="sm" onClick={handleReset}>
                RESET ALL FILTERS
              </Button>

              <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 px-6 max-w-3xl mx-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <li key={idx}>
                    <ProductCardPlaceholder />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <li key={product._id || product.slug}>
                  <ProductCard product={product} priority={idx < 4} />
                </li>
              ))}
            </ul>
          )}

          {hasActiveFilters && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-bold uppercase tracking-widest text-[#111111] hover:underline underline-offset-4"
              >
                CLEAR ALL FILTERS &times;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
