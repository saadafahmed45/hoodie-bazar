import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getHeroSlideById, updateHeroSlide, deleteHeroSlide } from "@/lib/db";

export async function GET(request, context) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const slide = await getHeroSlideById(id);
    if (!slide) {
      return NextResponse.json({ success: false, error: "Slide not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, slide });
  } catch (error) {
    console.error("GET /api/admin/hero-slides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve hero slide" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateHeroSlide(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Slide not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Hero slide updated successfully",
      slide: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/hero-slides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteHeroSlide(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Slide not found or delete failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/hero-slides/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete hero slide" },
      { status: 500 }
    );
  }
}
