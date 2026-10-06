import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateOrderStatus, getOrderById } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/constants";

export async function PUT(request, context) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("PUT /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
