"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  const announcements = [
    `FREE SHIPPING ON ORDERS OVER ৳${FREE_SHIPPING_THRESHOLD}`,
    "10% OFF YOUR FIRST ORDER | CODE: NIVORA10",
    "NEW WINTER STREETWEAR DROP IS NOW LIVE",
  ];

  return (
    <div className="bg-[#111111] text-white text-[11px] font-semibold tracking-widest uppercase h-9 flex items-center justify-center px-4 relative z-50 select-none border-b border-[#222222]">
      <div className="flex items-center gap-2 text-center truncate">
        <span>{announcements[index]}</span>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % announcements.length)}
          className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
          aria-label="Next announcement"
          type="button"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
