"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#111111] text-white border-t border-[#222222] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand Statement & Socials */}
        <div className="pb-12 border-b border-[#222222] grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="text-3xl font-black font-editorial tracking-tight uppercase text-white block">
              {BRAND_NAME}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-nivora-lime mt-1 block">
              {BRAND_TAGLINE}
            </span>
            <p className="mt-3 text-xs text-[#888888] max-w-md leading-relaxed uppercase tracking-wider">
              Modern winter essentials designed for everyday living. Engineered for warmth, crafted for confidence in sub-tropical winter climates.
            </p>
          </div>

          <div className="flex flex-col sm:items-end justify-between space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              CONNECT WITH US
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 border border-[#333333] hover:border-white flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 border border-[#333333] hover:border-white flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              {/* TikTok placeholder icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 border border-[#333333] hover:border-white flex items-center justify-center text-white transition-colors text-xs font-bold"
                aria-label="TikTok"
              >
                TT
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 border border-[#333333] hover:border-nivora-lime hover:text-nivora-lime flex items-center justify-center text-white transition-colors text-xs font-bold"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
            <p className="text-[11px] text-nivora-muted uppercase tracking-wider">
              Dhaka, Bangladesh &bull; info@nivora.com
            </p>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-[#222222]">
          {/* Column 1: SHOP */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888]">
              <li>
                <Link href="/shop" className="hover:text-white uppercase tracking-wider transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-white uppercase tracking-wider transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Hoodies" className="hover:text-white uppercase tracking-wider transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Sweatshirts" className="hover:text-white uppercase tracking-wider transition-colors">
                  Sweatshirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Sweaters" className="hover:text-white uppercase tracking-wider transition-colors">
                  Sweaters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Jackets" className="hover:text-white uppercase tracking-wider transition-colors">
                  Jackets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Accessories" className="hover:text-white uppercase tracking-wider transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-nivora-lime font-bold uppercase tracking-wider hover:underline">
                  Winter Sale (Up to 30% Off)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888]">
              <li>
                <Link href="/contact" className="hover:text-white uppercase tracking-wider transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white uppercase tracking-wider transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white uppercase tracking-wider transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white uppercase tracking-wider transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white uppercase tracking-wider transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white uppercase tracking-wider transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888]">
              <li>
                <Link href="/about" className="hover:text-white uppercase tracking-wider transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-white uppercase tracking-wider transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white uppercase tracking-wider transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white uppercase tracking-wider transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white uppercase tracking-wider transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-nivora-muted hover:text-nivora-lime uppercase tracking-wider transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: NEWSLETTER */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">
              STAY INFORMED
            </h4>
            <p className="text-xs text-[#888888] mb-4 uppercase tracking-wider">
              Subscribe for VIP access to seasonal drops and exclusive discounts.
            </p>
            {subscribed ? (
              <div className="p-3 bg-nivora-dark border border-[#222222] text-nivora-lime text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                THANK YOU FOR SUBSCRIBING.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <Input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-nivora-dark border-[#333333] text-white placeholder:text-nivora-muted text-xs uppercase h-10"
                />
                <Button
                  type="submit"
                  variant="lime"
                  className="w-full text-xs font-bold h-10"
                >
                  SUBSCRIBE
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar: Copyright & Payment Methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-nivora-muted">
          <p className="uppercase tracking-wider text-[11px]">
            &copy; 2026 {BRAND_NAME}. ALL RIGHTS RESERVED. CRAFTED FOR WINTER.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              PAYMENT METHODS:
            </span>
            <span className="px-2 py-1 bg-nivora-dark border border-[#333333] text-white text-[10px] font-bold uppercase tracking-wider">
              CASH ON DELIVERY
            </span>
            <span className="px-2 py-1 bg-nivora-dark border border-[#333333] text-[#e2136e] text-[10px] font-bold uppercase tracking-wider">
              bKash
            </span>
            <span className="px-2 py-1 bg-nivora-dark border border-[#333333] text-[#f7941d] text-[10px] font-bold uppercase tracking-wider">
              Nagad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
