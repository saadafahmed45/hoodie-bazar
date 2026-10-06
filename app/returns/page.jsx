import { RefreshCw, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges — NIVORA",
  description: "7-day hassle-free return and size exchange policy for NIVORA garments.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="mb-10 pb-6 border-b border-[#E2E2E2]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
          HASSLE-FREE GUARANTEE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          RETURNS & EXCHANGES
        </h1>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#444444] leading-relaxed">
        <div className="bg-[#111111] text-white p-6 sm:p-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B6E600]">
            7-DAY RETURN WINDOW
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-editorial uppercase">
            WE WANT YOU TO LOVE YOUR FIT.
          </h2>
          <p className="text-xs text-[#CCCCCC] leading-relaxed">
            If your garment does not fit as desired or you are not completely satisfied with the silhouette, you can request an exchange or refund within 7 days of receiving your order.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-[#111111]">
            RETURN CONDITIONS
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#111111] mt-0.5 shrink-0" />
              <span>Garments must be unworn, unwashed, and in original brand-new condition.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#111111] mt-0.5 shrink-0" />
              <span>All original NIVORA swing tags and packaging must be attached.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#111111] mt-0.5 shrink-0" />
              <span>Provide your order confirmation reference (e.g., NV-XXXXXX).</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-[#111111]">
            HOW TO INITIATE AN EXCHANGE
          </h3>
          <p>
            Simply reach out to our Concierge team on WhatsApp (+880 1700-000000) or email returns@nivora.com with your Order ID and preferred replacement size. Our rider will drop off the new size and collect the previous one from your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
