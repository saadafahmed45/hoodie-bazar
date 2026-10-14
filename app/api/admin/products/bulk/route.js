import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteManyProducts, updateManyProducts } from "@/lib/db";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, ids, value } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide an array of product IDs" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      const deletedCount = await deleteManyProducts(ids);
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deletedCount} product(s)`,
        affectedCount: deletedCount,
      });
    }

    if (action === "set_stock") {
      const stock = parseInt(value, 10) || 0;
      const modifiedCount = await updateManyProducts(ids, { stock });
      return NextResponse.json({
        success: true,
        message: `Updated stock for ${modifiedCount} product(s)`,
        affectedCount: modifiedCount,
      });
    }

    if (action === "toggle_featured") {
      const featured = Boolean(value);
      const modifiedCount = await updateManyProducts(ids, { featured });
      return NextResponse.json({
        success: true,
        message: `Updated featured status for ${modifiedCount} product(s)`,
        affectedCount: modifiedCount,
      });
    }

    if (action === "toggle_newArrival") {
      const newArrival = Boolean(value);
      const modifiedCount = await updateManyProducts(ids, { newArrival });
      return NextResponse.json({
        success: true,
        message: `Updated new arrival status for ${modifiedCount} product(s)`,
        affectedCount: modifiedCount,
      });
    }

    if (action === "set_category") {
      if (!value || typeof value !== "string" || !value.trim()) {
        return NextResponse.json({ success: false, error: "Valid category is required" }, { status: 400 });
      }
      const modifiedCount = await updateManyProducts(ids, { category: value.trim() });
      return NextResponse.json({
        success: true,
        message: `Updated category to "${value}" for ${modifiedCount} product(s)`,
        affectedCount: modifiedCount,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/products/bulk error:", error);
    return NextResponse.json(
      { success: false, error: "Bulk operation failed" },
      { status: 500 }
    );
  }
}
