import { NextResponse } from "next/server";
import { getOrdersByCustomer } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const userId = searchParams.get("userId");

    if (!email && !phone && !userId) {
      return NextResponse.json(
        { success: false, error: "Email, phone or userId is required" },
        { status: 400 }
      );
    }

    const orders = await getOrdersByCustomer({ email, phone, userId });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET /api/user/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
}
