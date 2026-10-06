"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  ShoppingBag,
  Package,
  LogOut,
  Mail,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  KeyRound,
  Edit2,
  Check,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, updateUserProfile, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit profile state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [resetEmailSending, setResetEmailSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.email) {
      setNewName(user.displayName || "");
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams();
      if (user.email) params.append("email", user.email);
      if (user.uid) params.append("userId", user.uid);

      const res = await fetch(`/api/user/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been signed out.");
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Failed to sign out.");
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSavingName(true);
    try {
      await updateUserProfile({ displayName: newName.trim() });
      setIsEditingName(false);
      toast.success("Profile name updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSavingName(false);
    }
  };

  const handleSendResetPassword = async () => {
    if (!user?.email) return;
    setResetEmailSending(true);
    try {
      await resetPassword(user.email);
      toast.success("Password reset email sent to " + user.email);
    } catch (err) {
      toast.error(err.message || "Failed to send reset email.");
    } finally {
      setResetEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#111111] mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#888888]">
          Loading account...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isGoogleUser = user.providerData?.some(
    (p) => p.providerId === "google.com"
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
            <CheckCircle className="h-3 w-3 mr-1 inline" /> Delivered
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">
            <Truck className="h-3 w-3 mr-1 inline" /> Shipped
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
            <Clock className="h-3 w-3 mr-1 inline" /> Processing
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-bold">
            <XCircle className="h-3 w-3 mr-1 inline" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-100 text-zinc-800 border-zinc-200 text-[10px] font-bold">
            <Clock className="h-3 w-3 mr-1 inline" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Account Header */}
      <div className="bg-[#111111] text-white p-6 sm:p-10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#222222] border-2 border-white/20 flex items-center justify-center shrink-0">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User Avatar"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xl sm:text-2xl font-black font-editorial text-white uppercase">
                {user.displayName
                  ? user.displayName.charAt(0)
                  : user.email
                  ? user.email.charAt(0)
                  : "U"}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-editorial tracking-tight uppercase">
                {user.displayName || "NIVORA Client"}
              </h1>
              {isGoogleUser && (
                <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] font-bold tracking-wider uppercase">
                  Google Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#999999] mt-0.5">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-[#777777]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined{" "}
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white bg-transparent hover:bg-white hover:text-[#111111] rounded-none text-xs font-bold uppercase tracking-wider h-10 px-4 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#E2E2E2] mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#777777] hover:text-[#111111]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Order History ({orders.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#777777] hover:text-[#111111]"
          }`}
        >
          <span className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile & Security
          </span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="p-12 text-center bg-white border border-[#E2E2E2]">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#111111] mb-2" />
              <p className="text-xs text-[#777777]">Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 sm:p-16 text-center bg-[#FAFAFA] border border-[#E2E2E2]">
              <Package className="h-10 w-10 text-[#AAAAAA] mx-auto mb-4" />
              <h3 className="text-base font-black font-editorial uppercase text-[#111111]">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1 mb-6">
                Explore our signature heavyweight hoodies and refined winter collection.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white border border-[#E2E2E2] p-5 sm:p-6 transition-all hover:border-[#111111]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEE]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black uppercase text-[#111111]">
                          #{ord._id.slice(-8).toUpperCase()}
                        </span>
                        {getStatusBadge(ord.status)}
                      </div>
                      <p className="text-[11px] text-[#777777] mt-1">
                        Placed on{" "}
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recent"}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">
                        TOTAL AMOUNT
                      </p>
                      <p className="text-base font-black text-[#111111]">
                        {formatPrice(ord.total)}
                      </p>
                      <p className="text-[10px] text-[#666666] uppercase">
                        {ord.paymentMethod?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="py-4 space-y-3">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-[#F5F5F3] border border-[#E2E2E2] shrink-0 overflow-hidden">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#111111]">{item.name}</p>
                            <p className="text-[11px] text-[#777777]">
                              Size: {item.size || "Standard"} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#111111]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address footer */}
                  <div className="pt-3 border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#666666] gap-2">
                    <p>
                      <span className="font-semibold text-[#111111]">Ship To: </span>
                      {ord.customer?.name} &bull; {ord.customer?.address},{" "}
                      {ord.customer?.district}
                    </p>
                    <p className="text-[10px] text-[#888888] uppercase">
                      Phone: {ord.customer?.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE & SECURITY */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info Box */}
          <div className="bg-white border border-[#E2E2E2] p-6 sm:p-8">
            <h3 className="text-base font-black font-editorial uppercase text-[#111111] mb-6 pb-3 border-b border-[#E2E2E2]">
              PERSONAL DETAILS
            </h3>

            <div className="space-y-5">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Display Name
                </Label>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="rounded-none border-[#D5D5D5] h-10 text-xs flex-1"
                      placeholder="Your name"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={savingName}
                      className="bg-[#111111] text-white rounded-none h-10 px-4 text-xs font-bold uppercase tracking-wider"
                    >
                      {savingName ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingName(false)}
                      className="rounded-none h-10 px-3 text-xs"
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between py-2 border-b border-[#EEEEEE]">
                    <span className="text-sm font-semibold text-[#111111]">
                      {user.displayName || "Not set"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Email Address
                </Label>
                <div className="flex items-center justify-between py-2 border-b border-[#EEEEEE]">
                  <span className="text-sm font-semibold text-[#111111]">{user.email}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Account Provider
                </Label>
                <div className="py-2 border-b border-[#EEEEEE]">
                  <span className="text-xs uppercase font-bold text-[#555555]">
                    {isGoogleUser ? "Google Single Sign-On" : "Email & Password Authentication"}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  User Identification (UID)
                </Label>
                <div className="py-2">
                  <span className="text-[11px] font-mono text-[#888888] break-all">
                    {user.uid}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access Box */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E2E2] p-6 sm:p-8">
              <h3 className="text-base font-black font-editorial uppercase text-[#111111] mb-6 pb-3 border-b border-[#E2E2E2]">
                SECURITY & PASSWORD
              </h3>

              <div className="space-y-4">
                <p className="text-xs text-[#666666] leading-relaxed">
                  Need to update or reset your password? We will send a secure reset link directly
                  to <span className="font-semibold text-[#111111]">{user.email}</span>.
                </p>

                <Button
                  onClick={handleSendResetPassword}
                  disabled={resetEmailSending}
                  variant="outline"
                  className="w-full border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white rounded-none h-11 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {resetEmailSending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <KeyRound className="h-4 w-4 mr-2" />
                  )}
                  Send Password Reset Link
                </Button>
              </div>
            </div>

            {/* Admin shortcut if applicable */}
            <div className="bg-[#F9F9F8] border border-[#E2E2E2] p-6 sm:p-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                ADMIN ACCESS
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed mb-4">
                Store managers and administrators can access product inventory, order processing,
                and analytics through the dedicated admin portal.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
              >
                Go to Admin Portal <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
