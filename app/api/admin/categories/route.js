import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCategoriesWithProductCounts, createCategory } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getCategoriesWithProductCounts();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve categories" },
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
    const { name, slug, image, description } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = await createCategory({
      name: name.trim(),
      slug: slug?.trim() || undefined,
      image: image?.trim() || undefined,
      description: description?.trim() || "",
    });

    return NextResponse.json(
      { success: true, message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
