import { NextResponse } from "next/server";
import { verifyAdminGoogleAccount, createAdminToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, name, photoUrl } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required for Google authentication" },
        { status: 400 }
      );
    }

    const adminUser = await verifyAdminGoogleAccount(email, name, photoUrl);

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: Google account (${email}) is not registered as an authorized administrator. Please ask a Super Admin to register this email under Admin Management.`,
        },
        { status: 403 }
      );
    }

    const token = await createAdminToken(adminUser);

    const response = NextResponse.json({
      success: true,
      message: "Admin Google authentication successful",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
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
    console.error("POST /api/admin/google-login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate with Google" },
      { status: 500 }
    );
  }
}
