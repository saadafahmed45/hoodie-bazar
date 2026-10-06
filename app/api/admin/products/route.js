import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await getProducts({}, { createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      category,
      images,
      colors,
      sizes,
      stock,
      featured,
      newArrival,
      details,
      material,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }
    if (!price || isNaN(Number(price))) {
      return NextResponse.json({ success: false, error: "Valid price is required" }, { status: 400 });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProduct = await createProduct({
      name: name.trim(),
      slug: generatedSlug,
      description: description || "",
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      category: category || "Hoodies",
      images: Array.isArray(images) && images.length > 0 ? images : ["/images/placeholder.jpg"],
      colors: Array.isArray(colors) ? colors : (typeof colors === "string" ? colors.split(",").map(c => c.trim()) : ["Black"]),
      sizes: Array.isArray(sizes) ? sizes : (typeof sizes === "string" ? sizes.split(",").map(s => s.trim()) : ["M", "L", "XL"]),
      stock: parseInt(stock, 10) || 0,
      featured: Boolean(featured),
      newArrival: Boolean(newArrival),
      details: Array.isArray(details) ? details : [],
      material: material || "Cotton Blend",
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
