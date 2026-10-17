"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { BRAND_NAME } from "@/lib/constants";

// Dynamically import FloatingWhatsApp with SSR disabled to prevent React hydration mismatch
const FloatingWhatsApp = dynamic(
  () =>
    import("@digicroz/react-floating-whatsapp").then(
      (mod) => mod.FloatingWhatsApp
    ),
  { ssr: false }
);

export default function FloatingWhatsAppWidget() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not render on admin dashboard or before client mount
  if (!mounted) return null;
  if (pathname?.startsWith("/admin")) return null;

  // Retrieve phone number from env or fallback to store default
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    "8801700000000";

  // Sanitize: strip out +, spaces, hyphens, and non-digit characters for WhatsApp API
  const sanitizedPhone = rawNumber.replace(/[^0-9]/g, "");

  return (
    <div className="no-print select-none relative z-50">
      <FloatingWhatsApp
        phoneNumber={sanitizedPhone}
        accountName={BRAND_NAME || "Hoodie Bazar"}
        avatar="/images/whatsapp-avatar.svg"
        statusMessage="Online | Typically replies instantly"
        chatMessage="Hello! 👋 Welcome to Hoodie Bazar Concierge. How can we assist you with our winter collection, sizing, or orders today?"
        placeholder="Type your message here..."
        allowClickAway={true}
        allowEsc={true}
        notification={true}
        notificationDelay={45}
        notificationSound={false}
        chatboxHeight={340}
        buttonClassName="shadow-2xl transition-transform hover:scale-105"
      />
    </div>
  );
}
