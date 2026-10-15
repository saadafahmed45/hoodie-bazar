import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAdminUsers, createAdminUser } from "@/lib/db";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admins = await getAdminUsers();
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    console.error("GET /api/admin/admins error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only Super Administrators can create staff accounts." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, status } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const newAdmin = await createAdminUser({ name, email, password, role, status });
    return NextResponse.json({
      success: true,
      message: "Admin staff created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("POST /api/admin/admins error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
