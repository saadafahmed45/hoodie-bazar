"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { confirmAction, showSuccess } from "@/lib/swal";

export default function AdminLayout({ children, session }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const navItems = [
    { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
    { label: "PRODUCTS", href: "/admin/products", icon: Package },
    { label: "ORDERS", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col md:flex-row text-[#111111]">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#111111] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-editorial font-black text-lg tracking-tight">
            {BRAND_NAME}
          </span>
          <span className="text-[10px] bg-[#B6E600] text-[#111111] font-bold px-1.5 py-0.5">
            ADMIN
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 text-white hover:text-[#B6E600]"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#111111] text-white flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="pb-6 border-b border-[#222222]">
            <span className="text-2xl font-black font-editorial tracking-tight uppercase text-white block">
              {BRAND_NAME}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600]">
                ADMIN CONTROL
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#B6E600]" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#222222] text-[#B6E600] border-l-2 border-[#B6E600]"
                      : "text-[#888888] hover:text-white hover:bg-[#181818]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#222222] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#888888] hover:text-white uppercase tracking-wider p-2"
          >
            <span>VIEW STOREFRONT</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full text-xs font-bold"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            LOGOUT
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
