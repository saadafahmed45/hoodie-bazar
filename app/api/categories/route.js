import { NextResponse } from "next/server";
import { getCategoriesWithProductCounts, getCategories } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get("withCounts") === "true";

    const categories = withCounts
      ? await getCategoriesWithProductCounts()
      : await getCategories();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
