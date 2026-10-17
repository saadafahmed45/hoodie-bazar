import { getProducts, getCategories } from "@/lib/db";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All Hoodies & Winter Streetwear",
  description:
    "Browse the complete collection of premium heavyweight hoodies, oversized crewnecks, jackets, and winter streetwear essentials at Hoodie Bazar. Fast delivery across Bangladesh.",
  keywords: [
    "shop hoodies bd",
    "buy hoodies online bangladesh",
    "oversized hoodie shop",
    "winter clothes dhaka",
    "hoodie bazar catalog",
    "heavyweight sweatshirts",
  ],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Hoodies & Streetwear | Hoodie Bazar",
    description:
      "Explore heavyweight hoodies, sweatshirts, and winter outerwear. Free shipping over ৳1,499.",
    url: "/shop",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function ShopPage(props) {
  const searchParams = await props.searchParams;
  const initialCategory = searchParams?.category || "All";
  const initialFilter = searchParams?.filter || "";

  const [products, categories] = await Promise.all([
    getProducts({}, { createdAt: -1 }),
    getCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={products}
      initialCategories={categories}
      initialCategory={initialCategory}
      initialFilter={initialFilter}
    />
  );
}
