"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";

export default function ShopClient({ initialProducts = [], initialCategory = "All", initialFilter = "" }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: null, max: null });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const wishlistItems = useWishlistStore((state) => state.items);

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setSelectedSizes([]);
    setSelectedPriceRange({ min: null, max: null });
    setInStockOnly(false);
    setSortBy("featured");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // If wishlist filter is set via URL
    if (initialFilter === "wishlist") {
      const wishlistIds = wishlistItems.map((item) => item._id || item.id);
      list = list.filter((p) => wishlistIds.includes(p._id));
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        p.sizes?.some((s) => selectedSizes.includes(s))
      );
    }

    // Price filter
    if (selectedPriceRange.min !== null) {
      list = list.filter((p) => p.price >= selectedPriceRange.min);
    }
    if (selectedPriceRange.max !== null) {
      list = list.filter((p) => p.price <= selectedPriceRange.max);
    }

    // Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // featured
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [
    initialProducts,
    initialFilter,
    wishlistItems,
    selectedCategory,
    selectedSizes,
    selectedPriceRange,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Banner / Title */}
      <div className="mb-10 pb-6 border-b border-[#E2E2E2] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
            ARCHIVE 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            {initialFilter === "wishlist"
              ? "MY WISHLIST"
              : selectedCategory === "All"
              ? "SHOP ALL"
              : selectedCategory}
          </h1>
          <p className="mt-1 text-xs text-[#666666] uppercase tracking-wider">
            {initialFilter === "wishlist"
              ? "Your curated collection of saved garments."
              : "Explore our latest collection of heavyweight winter essentials."}
          </p>
        </div>

        {/* Controls: Item count & Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2 text-xs"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                FILTERS
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-6 overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-sm font-bold uppercase tracking-widest">
                  FILTER PRODUCTS
                </SheetTitle>
              </SheetHeader>
              <ProductFilters
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

          {/* Sort Dropdown */}
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

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <ProductFilters
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

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between text-xs text-[#888888] uppercase tracking-wider mb-6">
            <span>
              SHOWING <strong className="text-[#111111]">{filteredProducts.length}</strong> PRODUCTS
            </span>
            {(selectedCategory !== "All" || selectedSizes.length > 0 || selectedPriceRange.min !== null || inStockOnly) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[#111111] font-semibold hover:underline"
              >
                CLEAR FILTERS &times;
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#E2E2E2] p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                NO PRODUCTS MATCH YOUR SELECTION
              </p>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mb-6">
                Try resetting your filters or exploring another winter category.
              </p>
              <Button variant="default" size="sm" onClick={handleReset}>
                RESET ALL FILTERS
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
