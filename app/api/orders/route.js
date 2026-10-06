import { NextResponse } from "next/server";
import { createOrder, getProductById, getProductBySlug } from "@/lib/db";
import {
  DELIVERY_CHARGE_INSIDE_DHAKA,
  DELIVERY_CHARGE_OUTSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";

// Bangladesh phone number validation: 11 digits starting with 01
function isValidBDPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  // Matches +8801... or 8801... or 01...
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(cleaned);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod = "CASH_ON_DELIVERY" } = body;

    // Validate customer fields
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer details are required" },
        { status: 400 }
      );
    }

    const { name, phone, district, area, address, note } = customer;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Full Name is required" }, { status: 400 });
    }
    if (!phone?.trim() || !isValidBDPhone(phone.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 11-digit Bangladesh phone number (e.g. 017XXXXXXXX)",
        },
        { status: 400 }
      );
    }
    if (!district?.trim()) {
      return NextResponse.json({ success: false, error: "District is required" }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json({ success: false, error: "Full Address is required" }, { status: 400 });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty. Please add items to checkout." },
        { status: 400 }
      );
    }

    // Server-side price calculation: re-fetch each product from DB to ensure genuine prices!
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const pid = item.productId;
      let productDoc = await getProductById(pid);
      if (!productDoc && item.slug) {
        productDoc = await getProductBySlug(item.slug);
      }

      if (!productDoc) {
        return NextResponse.json(
          {
            success: false,
            error: `Product "${item.name || pid}" is no longer available.`,
          },
          { status: 400 }
        );
      }

      const verifiedPrice = Number(productDoc.price);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedSubtotal += verifiedPrice * qty;

      verifiedItems.push({
        productId: productDoc._id,
        name: productDoc.name,
        slug: productDoc.slug,
        image: productDoc.images?.[0] || item.image || "/images/placeholder.jpg",
        price: verifiedPrice,
        quantity: qty,
        size: item.size || "Standard",
        color: item.color || "Default",
      });
    }

    // Calculate delivery charge based on district and free-shipping threshold
    const isDhaka = district.trim().toLowerCase().includes("dhaka");
    let deliveryCharge = isDhaka
      ? DELIVERY_CHARGE_INSIDE_DHAKA
      : DELIVERY_CHARGE_OUTSIDE_DHAKA;

    if (calculatedSubtotal >= FREE_SHIPPING_THRESHOLD) {
      deliveryCharge = 0;
    }

    const calculatedTotal = calculatedSubtotal + deliveryCharge;

    const orderRecord = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: (customer.email || "").trim(),
        userId: (customer.userId || "").trim(),
        district: district.trim(),
        area: (area || "").trim(),
        address: address.trim(),
        note: (note || "").trim(),
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryCharge,
      total: calculatedTotal,
      paymentMethod,
      status: "Pending",
    };

    const createdOrder = await createOrder(orderRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
