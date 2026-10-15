"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import HoodieBazarLogo from "./HoodieBazarLogo";
import { BRAND_NAME } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nivora.com");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      if (!googleUser || !googleUser.email) {
        throw new Error("Unable to read Google user profile information.");
      }

      const res = await fetch("/api/admin/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.displayName || "",
          photoUrl: googleUser.photoURL || "",
          uid: googleUser.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google authentication was rejected by the admin portal.");
      }

      toast.success(`Welcome back, ${data.user?.name || "Administrator"}`);
      router.refresh();
      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin Google login failed:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed before completion.");
      } else {
        setError(err.message || "Google sign-in failed. Please verify your admin privileges.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 relative overflow-hidden">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <HoodieBazarLogo className="h-8 w-8" />
            <span className="font-editorial font-black text-2xl text-[#111111] tracking-tight uppercase">
              {BRAND_NAME}
            </span>
          </div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#111111] bg-[#b6e600] px-3 py-1 rounded-full">
            Admin Authentication
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              <span>AUTHENTICATING WITH GOOGLE...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
            or sign in with credentials
          </span>
        </div>


        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition transform active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="h-4 w-4 text-[#b6e600]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-[#888888] font-medium">
            Sign in with an authorized Google account or use admin credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
