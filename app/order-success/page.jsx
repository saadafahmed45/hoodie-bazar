import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Home } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Order Confirmed — NIVORA",
  description: "Thank you for shopping with NIVORA. Your order has been placed successfully.",
};

export default async function OrderSuccessPage(props) {
  const searchParams = await props.searchParams;
  const orderId = searchParams?.id || "NV-" + Math.floor(100000 + Math.random() * 900000);
  const customerName = searchParams?.name || "Valued Customer";
  const totalAmount = searchParams?.total ? Number(searchParams.total) : null;
  const paymentMethod = searchParams?.payment || "CASH_ON_DELIVERY";
  const district = searchParams?.district || "Dhaka";

  const isDhaka = district.toLowerCase().includes("dhaka");
  const estimatedDelivery = isDhaka
    ? "24 – 48 Hours (Inside Dhaka)"
    : "2 – 4 Business Days (Outside Dhaka)";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Success Icon */}
      <div className="h-20 w-20 rounded-full bg-[#B6E600]/20 border border-[#B6E600] flex items-center justify-center mx-auto mb-6 text-[#111111]">
        <PackageCheck className="h-10 w-10 stroke-[2.5]" />
      </div>

      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600] bg-[#111111] px-3 py-1 inline-block mb-3">
        ORDER CONFIRMED
      </span>

      <h1 className="text-3xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111] mb-2">
        THANK YOU FOR SHOPPING WITH NIVORA.
      </h1>

      <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto uppercase tracking-wider mb-8">
        Hello <strong className="text-[#111111]">{customerName}</strong>, your order has been received and our fulfilment team in Dhaka is preparing your winter parcel.
      </p>

      {/* Order Details Card */}
      <div className="bg-[#F5F5F3] border border-[#E2E2E2] p-6 text-left space-y-4 mb-8 text-xs uppercase tracking-wider">
        <div className="flex justify-between items-center pb-3 border-b border-[#E2E2E2]">
          <span className="text-[#888888]">ORDER REFERENCE:</span>
          <span className="font-mono font-bold text-sm text-[#111111]">{orderId}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#888888]">PAYMENT METHOD:</span>
          <span className="font-bold text-[#111111]">
            {paymentMethod === "CASH_ON_DELIVERY"
              ? "CASH ON DELIVERY (COD)"
              : paymentMethod}
          </span>
        </div>

        {totalAmount && (
          <div className="flex justify-between items-center">
            <span className="text-[#888888]">TOTAL AMOUNT DUE:</span>
            <span className="font-bold text-[#111111] text-sm">
              {formatPrice(totalAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-[#E2E2E2]">
          <span className="text-[#888888] flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            ESTIMATED DELIVERY:
          </span>
          <span className="font-bold text-[#111111]">{estimatedDelivery}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="lime" size="lg" asChild className="w-full sm:w-auto">
          <Link href="/shop" className="flex items-center gap-2">
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>RETURN HOME</span>
          </Link>
        </Button>
      </div>

      <p className="mt-8 text-[11px] text-[#888888] uppercase tracking-wider">
        Questions regarding your shipment? Reach out to support@nivora.com or via WhatsApp.
      </p>
    </div>
  );
}
