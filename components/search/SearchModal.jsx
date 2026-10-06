"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export default function SearchModal({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClose = () => {
    onOpenChange(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b border-[#E2E2E2]">
          <DialogTitle className="sr-only">Search NIVORA</DialogTitle>
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3 h-4 w-4 text-[#888888]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS, CATEGORIES, HOODIES..."
              className="pl-10 pr-10 border-0 h-12 text-xs uppercase tracking-wider focus-visible:ring-0 focus-visible:border-0"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 p-1 text-[#888888] hover:text-[#111111]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#111111]" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs uppercase tracking-widest text-[#888888]">
                NO PRODUCTS FOUND FOR &ldquo;{query}&rdquo;
              </p>
              <p className="mt-2 text-xs text-[#666666]">
                Try searching for Hoodies, Sweaters, Jackets, or Streetwear.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-3">
                {results.length} RESULTS FOUND
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 p-2 border border-[#E2E2E2] hover:border-[#111111] transition-colors group"
                  >
                    <div className="relative h-16 w-14 shrink-0 bg-[#F5F5F3] overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/images/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#888888]">
                        {product.category}
                      </p>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] truncate group-hover:text-black">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-[#111111]">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[10px] text-[#888888] line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div className="py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-3">
                POPULAR SEARCHES
              </p>
              <div className="flex flex-wrap gap-2">
                {["Heavyweight Hoodie", "Puffer Jacket", "Crewneck", "Wool Sweater", "Beanie"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 text-[11px] uppercase tracking-wider border border-[#E2E2E2] bg-[#F5F5F3] text-[#111111] hover:border-[#111111] transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
