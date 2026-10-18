"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  ShieldCheck,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Store,
} from "lucide-react";
import HoodieBazarLogo from "./HoodieBazarLogo";
import { BRAND_NAME } from "@/lib/constants";
import { confirmAction, showSuccess } from "@/lib/swal";

export default function AdminLayout({ children, session }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "SIGN OUT?",
      text: "Are you sure you want to end your administrative session?",
      confirmText: "SIGN OUT",
      cancelText: "CANCEL",
      icon: "question",
    });

    if (!confirmed) return;

    try {
      await fetch("/api/admin/logout", { method: "POST" });
      showSuccess("SIGNED OUT", "You have been logged out successfully.", 1500);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isSuperAdmin = session?.role === "super_admin" || session?.role === "admin";

  const mainNavItems = [
    { label: "Overview", href: "/admin", icon: LayoutGrid },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  const accountsNavItems = [
    { label: "User Management", href: "/admin/customers", icon: Users },
    ...(isSuperAdmin
      ? [{ label: "Admin Management", href: "/admin/admins", icon: ShieldCheck }]
      : []),
  ];

  const adminName = session?.name || "Store Admin";
  const adminEmail = session?.email || "admin@hoodiebazar.com";
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#111111] antialiased font-sans">
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <HoodieBazarLogo className="h-6 w-6" />
          <span className="font-editorial font-black text-lg text-[#111111] tracking-tight">
            {BRAND_NAME}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="p-1.5 bg-nivora-lime text-[#111111] rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-black rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar - Full Height Edge to Edge */}
      <aside
        className={`${
          mobileMenuOpen ? "flex" : "hidden"
        } md:flex flex-col justify-between w-full md:w-60 lg:w-64 bg-white p-5 border-b md:border-b-0 md:border-r border-slate-200/80 shrink-0 md:sticky md:top-0 md:h-screen transition-all z-30`}
      >
        <div>
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-2 py-2 mb-6">
            <HoodieBazarLogo className="h-8 w-8 shrink-0" />
            <div>
              <span className="font-editorial font-black text-lg text-[#111111] tracking-tight block leading-tight">
                {BRAND_NAME}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mt-0.5">
                {isSuperAdmin ? "Super Admin" : "Staff Portal"}
              </span>
            </div>
          </div>

          {/* Main Navigation Menu */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#111111] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#111111] hover:bg-slate-100"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-nivora-lime" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACCOUNTS & STAFF Section */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#888888] px-3.5 mb-2.5">
              Accounts & Staff
            </h4>
            <div className="space-y-1.5">
              {accountsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all group ${
                      isActive
                        ? "bg-[#111111] text-white shadow-xs"
                        : "text-slate-600 hover:text-[#111111] hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-white/10 text-nivora-lime"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-[#111111]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[13px] font-semibold">{item.label}</span>
                    </div>
                    {isActive ? (
                      <ChevronRight className="h-4 w-4 text-nivora-lime" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section in Sidebar */}
        <div className="mt-6 pt-3">
          {/* Store Catalog Card in Editorial Black & Lime */}
          <div className="bg-[#111111] rounded-2xl p-4 text-white relative overflow-hidden shadow-xs border border-[#222222]">
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-lg bg-[#222222] border border-[#333333] flex items-center justify-center mb-2.5 text-nivora-lime">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Winter Catalog
              </h3>
              <p className="text-[11px] text-[#888888] mt-1 leading-snug">
                Manage heavyweight hoodies & outerwear
              </p>
              <Link
                href="/admin/products"
                className="block w-full mt-3 bg-nivora-lime hover:bg-[#a4cf00] text-[#111111] text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-xl shadow-xs transition active:scale-95 text-center"
              >
                Manage Products
              </Link>
            </div>
          </div>

          {/* Storefront Link & Logout */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#111111] transition font-bold uppercase tracking-wider text-[11px]"
            >
              <Store className="w-3.5 h-3.5 text-[#111111]" />
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-600 transition p-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Full width edge-to-edge */}
      <main className="flex-1 min-w-0 bg-slate-50 flex flex-col min-h-screen">
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Search input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, orders, or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
            />
          </div>

          {/* Profile Bar */}
          <div className="relative flex items-center justify-end">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 text-left p-1 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#111111] text-nivora-lime font-bold text-xs flex items-center justify-center shrink-0 border border-[#222222]">
                {initials || "HB"}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] leading-tight">
                    {adminName}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#111111] text-nivora-lime px-1.5 py-0.2 rounded-sm">
                    {isSuperAdmin ? "ADMIN" : "STAFF"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {adminEmail}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 z-30 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="font-bold text-[#111111]">{adminName}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {adminEmail}
                  </div>
                  <div className="mt-1">
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider bg-[#111111] text-nivora-lime px-1.5 py-0.5 rounded-sm">
                      {isSuperAdmin ? "Super Administrator" : "Customer Management"}
                    </span>
                  </div>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-[#111111] rounded-xl font-medium transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Storefront</span>
                </Link>

                <Link
                  href="/admin/customers"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-[#111111] rounded-xl font-medium transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Customer Management</span>
                </Link>

                {isSuperAdmin && (
                  <Link
                    href="/admin/admins"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-[#111111] rounded-xl font-medium transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Staff & Roles</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition text-left mt-1 border-t border-slate-100 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-5 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
