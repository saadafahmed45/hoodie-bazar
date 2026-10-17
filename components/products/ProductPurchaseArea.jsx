"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, Ruler, Check, Truck, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

export default function ProductPurchaseArea({ product }) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || "Black"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isFavorited = isInWishlist(product._id);

  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success(`${product.name} added to your bag`);
  };

  const handleBuyNow = () => {
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    router.push("/checkout");
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} added to wishlist`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  const handleWhatsAppBuy = () => {
    const rawNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
      "8801700000000";
    const phoneNumber = rawNumber.replace(/[^0-9]/g, "");

    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    const message = `Hello NIVORA / Hoodie Bazar! 👋
I would like to order:

• Product: ${product.name}
• Price: ${formatPrice(product.price)}
• Size: ${selectedSize}
• Color: ${selectedColor}
• Quantity: ${quantity}
• Link: ${currentUrl}

Please confirm availability and help me complete my order. Thank you!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Category & Name */}
      <div className="border-b border-nivora-border pb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-[#888888]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-[#111111] font-semibold">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-black" />
              ))}
            </div>
            <span className="ml-1">5.0 (24 REVIEWS)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          {product.name}
        </h1>

        {/* Price & Discount */}
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-2xl font-black tracking-tight text-[#111111]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-base text-[#888888] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {hasDiscount && (
            <Badge variant="sale" className="text-xs">
              SAVE {discountPercent}%
            </Badge>
          )}
        </div>
      </div>

      {/* Color Selector */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              COLOR: <span className="font-normal text-nivora-muted">{selectedColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-nivora-border bg-white text-[#111111] hover:border-[#111111]"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector with Size Guide */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              SIZE: <span className="font-normal text-nivora-muted">{selectedSize}</span>
            </span>

            {/* Size Guide Modal Trigger */}
            <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  SIZE GUIDE
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                  <DialogTitle>NIVORA SIZING CHART (INCHES)</DialogTitle>
                </DialogHeader>
                <div className="mt-4 overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse border border-nivora-border">
                    <thead>
                      <tr className="bg-nivora-soft border-b border-nivora-border">
                        <th className="p-2.5 font-bold uppercase">Size</th>
                        <th className="p-2.5 font-bold uppercase">Chest</th>
                        <th className="p-2.5 font-bold uppercase">Length</th>
                        <th className="p-2.5 font-bold uppercase">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nivora-border">
                      <tr>
                        <td className="p-2.5 font-bold">S</td>
                        <td className="p-2.5">42 - 44&quot;</td>
                        <td className="p-2.5">27.5&quot;</td>
                        <td className="p-2.5">24.5&quot;</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">M</td>
                        <td className="p-2.5">44 - 46&quot;</td>
                        <td className="p-2.5">28.5&quot;</td>
                        <td className="p-2.5">25.0&quot;</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">L</td>
                        <td className="p-2.5">46 - 48&quot;</td>
                        <td className="p-2.5">29.5&quot;</td>
                        <td className="p-2.5">25.5&quot;</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">XL</td>
                        <td className="p-2.5">48 - 50&quot;</td>
                        <td className="p-2.5">30.5&quot;</td>
                        <td className="p-2.5">26.0&quot;</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">XXL</td>
                        <td className="p-2.5">50 - 52&quot;</td>
                        <td className="p-2.5">31.5&quot;</td>
                        <td className="p-2.5">26.5&quot;</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-4 text-[11px] text-nivora-muted leading-relaxed">
                    *Our silhouettes feature a relaxed boxy fit. If you prefer a tailored look, we recommend sizing down one size.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 flex items-center justify-center text-xs font-bold uppercase tracking-wider border transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-nivora-border bg-white text-[#111111] hover:border-[#111111]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quantity Selector + Mobile Wishlist row */}
          <div className="flex gap-3">
            <div className="flex items-center border border-nivora-border h-12 w-28 sm:w-28 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-full flex items-center justify-center text-[#111111] hover:bg-nivora-soft"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-full flex items-center justify-center text-[#111111] hover:bg-nivora-soft"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Mobile Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="h-12 w-12 border border-nivora-border flex sm:hidden items-center justify-center hover:border-[#111111] transition-colors shrink-0"
              aria-label="Wishlist toggle"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited ? "fill-black text-black" : "text-[#111111]"
                }`}
              />
            </button>
          </div>

          {/* Add to Cart (Lime CTA) */}
          <Button
            type="button"
            variant="lime"
            onClick={handleAddToCart}
            className="flex-1 h-12 text-xs font-bold"
          >
            ADD TO CART
          </Button>

          {/* Buy Now via WhatsApp (WhatsApp Green CTA next to Add to Cart) */}
          <button
            type="button"
            onClick={handleWhatsAppBuy}
            className="flex-1 h-12 text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 transition-all px-3 shadow-xs"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 fill-current" />
            <span className="truncate">BUY NOW VIA WHATSAPP</span>
          </button>

          {/* Desktop Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="h-12 w-12 border border-nivora-border hidden sm:flex items-center justify-center hover:border-[#111111] transition-colors shrink-0"
            aria-label="Wishlist toggle"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorited ? "fill-black text-black" : "text-[#111111]"
              }`}
            />
          </button>
        </div>

        {/* Buy Now (Black button) */}
        <Button
          type="button"
          variant="default"
          onClick={handleBuyNow}
          className="w-full h-12 text-xs font-bold"
        >
          BUY NOW WITH CASH ON DELIVERY
        </Button>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-2 gap-3 py-4 border-y border-nivora-border text-xs text-nivora-muted">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#111111]" />
          <span>Free shipping over ৳{FREE_SHIPPING_THRESHOLD}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#111111]" />
          <span>7-Day Return Guarantee</span>
        </div>
      </div>

      {/* Accordion: Description, Details, Material, Shipping */}
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger>DESCRIPTION</AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-nivora-muted leading-relaxed">
              {product.description}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="details">
          <AccordionTrigger>DETAILS & SPECIFICATIONS</AccordionTrigger>
          <AccordionContent>
            {product.details && product.details.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1 text-xs text-nivora-muted">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-nivora-muted">
                Double needle topstitched seams, rib knit trims, and pre-washed finish.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="material">
          <AccordionTrigger>MATERIAL & CARE</AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-nivora-muted leading-relaxed">
              <strong>Material:</strong> {product.material || "100% Combed Heavyweight Cotton"}.
              <br />
              <strong>Care:</strong> Machine wash cold inside out with like colors. Hang dry or tumble dry low. Do not bleach.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shipping">
          <AccordionTrigger>SHIPPING & RETURNS</AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-nivora-muted leading-relaxed">
              <strong>Inside Dhaka:</strong> 24–48 hours delivery (৳80).
              <br />
              <strong>Outside Dhaka:</strong> 2–4 business days delivery (৳130).
              <br />
              <strong>Free Shipping:</strong> Automatically applied on all orders over ৳{FREE_SHIPPING_THRESHOLD}.
              <br />
              <strong>Returns:</strong> Hassle-free 7-day exchange or refund on unworn garments with original tags attached.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
