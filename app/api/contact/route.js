import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/db";

// Validate email format
function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate Bangladesh phone number if provided
function isValidBDPhone(phone) {
  if (!phone) return true; // phone is optional if valid email provided
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(cleaned);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      topic = "sizing",
      orderId,
      urgency = "standard",
      message,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!email?.trim() || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (phone?.trim() && !isValidBDPhone(phone.trim())) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid 11-digit Bangladesh phone number (e.g., 017XXXXXXXX).",
        },
        { status: 400 }
      );
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Message must contain at least 10 characters describing your inquiry.",
        },
        { status: 400 }
      );
    }

    // Sanitize and persist inquiry
    const newInquiry = await createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      topic: topic.trim(),
      orderId: orderId ? orderId.trim().toUpperCase() : null,
      urgency: urgency === "urgent" ? "urgent" : "standard",
      message: message.trim(),
      source: "web_contact_page",
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been successfully transmitted to our concierge.",
        inquiryId: newInquiry.inquiryId,
        createdAt: newInquiry.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while transmitting your inquiry. Please try again or WhatsApp our concierge.",
      },
      { status: 500 }
    );
  }
}
