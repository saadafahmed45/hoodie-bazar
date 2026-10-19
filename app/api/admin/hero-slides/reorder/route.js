import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { reorderHeroSlides } from "@/lib/db";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "orderedIds array is required" },
        { status: 400 }
      );
    }

    const success = await reorderHeroSlides(orderedIds);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to reorder hero slides" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero slides reordered successfully",
    });
  } catch (error) {
    console.error("POST /api/admin/hero-slides/reorder error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder hero slides" },
      { status: 500 }
    );
  }
}
