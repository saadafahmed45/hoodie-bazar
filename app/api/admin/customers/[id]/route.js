import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateCustomerStatus } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updated = await updateCustomerStatus(id, { status, notes });
    return NextResponse.json({
      success: true,
      message: "Customer status updated successfully",
      customer: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/customers/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
