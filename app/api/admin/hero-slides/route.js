import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getHeroSlides, createHeroSlide } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slides = await getHeroSlides({ activeOnly: false });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error("GET /api/admin/hero-slides error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load hero slides" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      headlineLine1,
      headlineAccent,
      subhead,
      description,
      categoryTag,
      badgeText,
      image,
      alt,
      accentColor,
      primaryCta,
      secondaryCta,
      specs,
      tabLabel,
      order,
      isActive,
    } = body;

    if (!headlineLine1?.trim()) {
      return NextResponse.json(
        { success: false, error: "Headline line 1 is required" },
        { status: 400 }
      );
    }

    if (!image?.trim()) {
      return NextResponse.json(
        { success: false, error: "Campaign image is required" },
        { status: 400 }
      );
    }

    const newSlide = await createHeroSlide({
      headlineLine1: headlineLine1.trim(),
      headlineAccent: headlineAccent?.trim() || "",
      subhead: subhead?.trim() || "",
      description: description?.trim() || "",
      categoryTag: categoryTag?.trim() || "NEW COLLECTION",
      badgeText: badgeText?.trim() || "",
      image: image.trim(),
      alt: alt?.trim() || headlineLine1.trim(),
      accentColor: accentColor?.trim() || "#b6e600",
      primaryCta: {
        label: primaryCta?.label?.trim() || "SHOP NOW",
        href: primaryCta?.href?.trim() || "/shop",
      },
      secondaryCta: {
        label: secondaryCta?.label?.trim() || "EXPLORE",
        href: secondaryCta?.href?.trim() || "/new-arrivals",
      },
      specs: Array.isArray(specs) ? specs : [],
      tabLabel: tabLabel?.trim() || "NEW SLIDE",
      order: typeof order === "number" ? order : undefined,
      isActive: isActive !== false,
    });

    return NextResponse.json(
      { success: true, message: "Hero slide created successfully", slide: newSlide },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/hero-slides error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}
