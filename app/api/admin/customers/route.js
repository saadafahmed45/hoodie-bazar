import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCustomers } from "@/lib/db";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const customers = await getCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
