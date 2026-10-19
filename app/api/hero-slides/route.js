import { NextResponse } from "next/server";
import { getHeroSlides } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getHeroSlides({ activeOnly: true });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error("GET /api/hero-slides error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load hero slides" },
      { status: 500 }
    );
  }
}
