import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function BenefitsBar() {
  const benefits = [
    {
      icon: Truck,
      title: "FREE SHIPPING",
      subtitle: `On orders over ৳${FREE_SHIPPING_THRESHOLD}`,
    },
    {
      icon: ShieldCheck,
      title: "PREMIUM QUALITY",
      subtitle: "Carefully selected materials",
    },
    {
      icon: RefreshCw,
      title: "EASY RETURNS",
      subtitle: "Simple 7-day returns",
    },
    {
      icon: Headphones,
      title: "CUSTOMER SUPPORT",
      subtitle: "We're here to help",
    },
  ];

  return (
    <section className="bg-white border-b border-[#E2E2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-[#E2E2E2] lg:divide-x">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 py-6 px-3 sm:px-6"
              >
                <div className="h-10 w-10 shrink-0 bg-[#F5F5F3] border border-[#E2E2E2] flex items-center justify-center text-[#111111]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    {benefit.title}
                  </h4>
                  <p className="text-[11px] text-[#666666] tracking-normal mt-0.5">
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
