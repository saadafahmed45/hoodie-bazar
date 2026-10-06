import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortParam = searchParams.get("sort");

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.search = search;
    if (featured) filter.featured = true;
    if (newArrival) filter.newArrival = true;
    if (minPrice) filter.minPrice = minPrice;
    if (maxPrice) filter.maxPrice = maxPrice;

    let sort = { createdAt: -1 };
    if (sortParam === "price_asc") {
      sort = { price: 1 };
    } else if (sortParam === "price_desc") {
      sort = { price: -1 };
    }

    const products = await getProducts(filter, sort);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
