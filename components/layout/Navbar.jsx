"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowRight,
  LogOut,
  ChevronDown,
  Package,
  ShieldCheck,
} from "lucide-react";
import { BRAND_NAME, NAV_LINKS, CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SearchModal from "@/components/search/SearchModal";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = useCartStore((state) => state.getCartCount());
  const openCart = useCartStore((state) => state.openDrawer);
  const wishlistItems = useWishlistStore((state) => state.items);

  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error(err.message || "Failed to sign out");
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled
            ? "border-b border-[#E2E2E2] shadow-xs py-3.5"
            : "border-b border-[#E2E2E2] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button & Brand */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-1 text-[#111111] hover:text-[#666666] focus:outline-none"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link
                href="/"
                className="text-xl font-black tracking-tighter uppercase font-editorial text-[#111111]"
              >
                {BRAND_NAME}
              </Link>
            </div>

            {/* Desktop Brand Logo */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/"
                className="text-2xl font-black tracking-tight uppercase font-editorial text-[#111111] hover:opacity-90 transition-opacity"
              >
                {BRAND_NAME}
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const isSale = link.name === "SALE";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-xs font-bold uppercase tracking-wider py-1 transition-colors ${
                      isActive
                        ? "text-[#111111]"
                        : "text-[#666666] hover:text-[#111111]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.name}
                      {isSale && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B6E600] inline-block" />
                      )}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Icons: Search, Wishlist, Account, Cart */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#111111] hover:text-[#666666] transition-colors"
                aria-label="Open search dialog"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?filter=wishlist"
                className="p-2 text-[#111111] hover:text-[#666666] transition-colors relative hidden sm:block"
                aria-label="View wishlist"
              >
                <Heart className="h-5 w-5" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account / User Link & Menu */}
              {mounted && user ? (
                <div className="relative hidden sm:block" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="p-1.5 flex items-center gap-1 text-[#111111] hover:opacity-80 transition-opacity cursor-pointer rounded-full"
                    aria-label="User account menu"
                  >
                    {user.photoURL ? (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#111111]">
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User avatar"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                        {user.displayName
                          ? user.displayName.charAt(0)
                          : user.email
                          ? user.email.charAt(0)
                          : "U"}
                      </div>
                    )}
                    <ChevronDown className="h-3 w-3 text-[#666666]" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E2E2] shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#EEEEEE]">
                        <p className="text-xs font-bold text-[#111111] truncate">
                          {user.displayName || "NIVORA Client"}
                        </p>
                        <p className="text-[10px] text-[#777777] truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[#333333] hover:bg-[#F5F5F3] hover:text-[#111111] transition-colors"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[#333333] hover:bg-[#F5F5F3] hover:text-[#111111] transition-colors"
                        >
                          <Package className="h-3.5 w-3.5" />
                          <span>Orders & History</span>
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[#333333] hover:bg-[#F5F5F3] hover:text-[#111111] transition-colors"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Admin Portal</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#EEEEEE]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-[#111111] hover:text-[#666666] transition-colors hidden sm:block"
                  aria-label="Sign in"
                  title="Sign In / Register"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 text-[#111111] hover:text-[#666666] transition-colors relative flex items-center"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#B6E600] text-[#111111] text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[310px] p-0 flex flex-col justify-between">
          <div>
            <SheetHeader className="p-5 border-b border-[#E2E2E2]">
              <SheetTitle className="text-xl font-black font-editorial tracking-tight">
                {BRAND_NAME}
              </SheetTitle>
              <p className="text-[10px] uppercase tracking-widest text-[#888888]">
                WINTER, REFINED.
              </p>
            </SheetHeader>

            <nav className="p-5 space-y-4">
              <div className="space-y-3 pb-5 border-b border-[#EEEEEE]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#666666]"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#666666]"
                >
                  CONTACT
                </Link>
              </div>

              {/* Categories Submenu in Mobile */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-3">
                  SHOP BY CATEGORY
                </p>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.name}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-xs uppercase tracking-wider text-[#555555] hover:text-[#111111]"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="p-5 border-t border-[#E2E2E2] bg-[#F5F5F3] space-y-3">
            {mounted && user ? (
              <div className="space-y-2.5">
                <div className="pb-2 border-b border-[#E2E2E2]">
                  <p className="text-xs font-bold text-[#111111] truncate">
                    {user.displayName || "Client"}
                  </p>
                  <p className="text-[10px] text-[#777777] truncate">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] py-1"
                >
                  <User className="h-4 w-4" />
                  MY ACCOUNT & ORDERS
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] py-1"
                >
                  <ShieldCheck className="h-4 w-4" />
                  ADMIN PORTAL
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 py-1 cursor-pointer w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]"
                >
                  <User className="h-4 w-4" />
                  SIGN IN / REGISTER
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  ADMIN LOGIN
                </Link>
              </div>
            )}
            <p className="text-[10px] uppercase tracking-wider text-[#888888] pt-1">
              BANGLADESH &bull; BDT (৳)
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Global Interactive Modals */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <CartDrawer />
    </>
  );
}
