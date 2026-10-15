import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateAdminUser, deleteAdminUser } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only Super Administrators can update staff accounts." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateAdminUser(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Admin user not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin staff updated successfully",
      admin: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/admins/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only Super Administrators can delete staff accounts." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Safety: prevent self-deletion
    if (session.id === id || session.email === id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own active session account." },
        { status: 400 }
      );
    }

    const deleted = await deleteAdminUser(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin staff removed successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/admins/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
