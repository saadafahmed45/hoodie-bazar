import { NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const adminUser = await verifyAdminCredentials(email, password);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(adminUser);

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: { email: adminUser.email, name: adminUser.name },
    });

    response.cookies.set({
      name: "nivora_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
