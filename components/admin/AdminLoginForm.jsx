"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nivora.com");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      toast.success("Welcome back, Administrator");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E2E2E2] p-8 shadow-sm">
        <div className="text-center mb-8 pb-6 border-b border-[#E2E2E2]">
          <span className="text-3xl font-black font-editorial tracking-tight uppercase text-[#111111] block">
            {BRAND_NAME}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mt-1 block">
            SECURE MANAGEMENT PORTAL
          </span>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Admin Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#888888]" />
              <Input
                id="email"
                type="email"
                required
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#888888]" />
              <Input
                id="password"
                type="password"
                required
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="w-full h-12 text-xs font-bold uppercase tracking-wider mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>ENTER PORTAL</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E2E2E2] bg-[#F5F5F3] -mx-8 -mb-8 p-4 text-center">
          <p className="text-[11px] text-[#666666]">
            Default demo credentials are pre-filled for evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
