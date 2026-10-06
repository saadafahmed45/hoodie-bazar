import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db";

export async function GET(request, context) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
