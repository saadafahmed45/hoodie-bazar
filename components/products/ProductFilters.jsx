"use client";

import { CATEGORIES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SIZES = ["S", "M", "L", "XL", "XXL", "One Size"];
const PRICE_RANGES = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ৳1,500", min: 0, max: 1500 },
  { label: "৳1,500 – ৳2,500", min: 1500, max: 2500 },
  { label: "Over ৳2,500", min: 2500, max: 99999 },
];

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  selectedSizes,
  onToggleSize,
  selectedPriceRange,
  onSelectPriceRange,
  inStockOnly,
  onToggleInStock,
  onReset,
}) {
  return (
    <div className="space-y-8 text-[#111111]">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-nivora-border">
        <span className="text-xs font-bold uppercase tracking-widest">
          FILTERS
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] uppercase tracking-wider text-[#888888] hover:text-[#111111] underline underline-offset-2"
        >
          RESET ALL
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
          CATEGORY
        </h4>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onSelectCategory("All")}
            className={`block text-xs uppercase tracking-wider text-left transition-colors ${
              selectedCategory === "All"
                ? "font-bold text-[#111111]"
                : "text-nivora-muted hover:text-[#111111]"
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`block text-xs uppercase tracking-wider text-left transition-colors ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? "font-bold text-[#111111]"
                  : "text-nivora-muted hover:text-[#111111]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
          SIZE
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                className={`h-9 flex items-center justify-center text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  isSelected
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "border-nivora-border text-[#111111] hover:border-[#111111] bg-white"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
          PRICE
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2.5 text-xs uppercase tracking-wider cursor-pointer group"
            >
              <input
                type="radio"
                name="priceRange"
                checked={
                  selectedPriceRange?.min === range.min &&
                  selectedPriceRange?.max === range.max
                }
                onChange={() => onSelectPriceRange(range)}
                className="h-3.5 w-3.5 text-[#111111] accent-[#111111]"
              />
              <span className="text-nivora-muted group-hover:text-[#111111]">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-nivora-border">
        <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={onToggleInStock}
          />
          <span>IN STOCK ONLY</span>
        </label>
      </div>
    </div>
  );
}
