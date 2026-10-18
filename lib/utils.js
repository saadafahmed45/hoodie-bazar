import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

const CATEGORY_LANDING_PAGES = {
  hoodie: "/hoodies",
};

export function categoryHref(name) {
  const key = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/s$/, "");
  if (CATEGORY_LANDING_PAGES[key]) return CATEGORY_LANDING_PAGES[key];
  return `/shop?category=${encodeURIComponent(name)}`;
}
