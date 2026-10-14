import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `No order found with ID "${id.toUpperCase()}". Please verify and try again.`,
        },
        { status: 404 }
      );
    }

    // Optional phone verification
    const { searchParams } = new URL(request.url);
    const phoneQuery = searchParams.get("phone");
    if (phoneQuery && phoneQuery.trim()) {
      const cleanInput = phoneQuery.trim().replace(/[\s\-\+]/g, "");
      const cleanOrderPhone = (order.customer?.phone || "").replace(/[\s\-\+]/g, "");
      // Compare last 6 digits or full
      if (
        !cleanOrderPhone.endsWith(cleanInput) &&
        !cleanInput.endsWith(cleanOrderPhone)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "The phone number does not match this order reference.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId || order._id,
        status: order.status || "Pending",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customer: {
          name: order.customer?.name || "Customer",
          phone: order.customer?.phone || "",
          district: order.customer?.district || "Dhaka",
          area: order.customer?.area || "",
          address: order.customer?.address || "",
          note: order.customer?.note || "",
        },
        items: order.items || [],
        subtotal: order.subtotal || 0,
        deliveryCharge: order.deliveryCharge || 0,
        total: order.total || 0,
        paymentMethod: order.paymentMethod || "CASH_ON_DELIVERY",
      },
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order tracking info." },
      { status: 500 }
    );
  }
}
