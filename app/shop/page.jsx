import { getProducts } from "@/lib/db";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All Products — NIVORA | Winter Streetwear",
  description: "Browse the complete collection of premium oversized hoodies, crewnecks, sweaters, jackets, and accessories from NIVORA.",
};

export default async function ShopPage(props) {
  const searchParams = await props.searchParams;
  const initialCategory = searchParams?.category || "All";
  const initialFilter = searchParams?.filter || "";

  const products = await getProducts({}, { createdAt: -1 });

  return (
    <ShopClient
      initialProducts={products}
      initialCategory={initialCategory}
      initialFilter={initialFilter}
    />
  );
}
