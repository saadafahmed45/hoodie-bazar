import {
  DELIVERY_CHARGE_INSIDE_DHAKA,
  DELIVERY_CHARGE_OUTSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import { Truck, Clock, ShieldCheck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery — NIVORA",
  description: "Learn about delivery times, rates, and courier partners across Bangladesh.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="mb-10 pb-6 border-b border-[#E2E2E2]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
          FULFILLMENT POLICIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          SHIPPING & DELIVERY
        </h1>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#444444] leading-relaxed">
        {/* Rates Table */}
        <div className="bg-[#F5F5F3] border border-[#E2E2E2] p-6 space-y-4">
          <h2 className="text-base font-bold uppercase tracking-wider text-[#111111]">
            DELIVERY RATES & TRANSIT TIMELINES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-[#E2E2E2]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                INSIDE DHAKA METRO
              </span>
              <p className="text-xl font-black text-[#111111] mt-1">
                ৳{DELIVERY_CHARGE_INSIDE_DHAKA}
              </p>
              <p className="text-xs text-[#666666] mt-1">
                Delivered in 24 – 48 Hours via priority courier.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E2E2E2]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                OUTSIDE DHAKA (ALL 64 DISTRICTS)
              </span>
              <p className="text-xl font-black text-[#111111] mt-1">
                ৳{DELIVERY_CHARGE_OUTSIDE_DHAKA}
              </p>
              <p className="text-xs text-[#666666] mt-1">
                Delivered in 2 – 4 Business Days via Steadfast / Pathao.
              </p>
            </div>
          </div>
          <div className="p-3 bg-[#111111] text-[#B6E600] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>
              FREE SHIPPING AUTOMATICALLY APPLIED ON ORDERS OVER ৳{FREE_SHIPPING_THRESHOLD}.
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#111111] mb-2">
            CASH ON DELIVERY & PARCEL INSPECTION
          </h3>
          <p>
            All domestic shipments are fulfilled on a Cash on Delivery (COD) basis. You may inspect the package exterior upon arrival before completing payment to the courier rider.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#111111] mb-2">
            ORDER TRACKING
          </h3>
          <p>
            Upon dispatch, a SMS containing your live parcel tracking number will be delivered to the phone number registered during checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
