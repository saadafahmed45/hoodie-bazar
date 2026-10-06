"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { loginWithEmail, loginWithGoogle, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // If already logged in, redirect
  if (user) {
    router.replace(redirectUrl);
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Welcome back!");
      router.push(redirectUrl);
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please check your credentials.");
      toast.error(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in successfully with Google!");
      router.push(redirectUrl);
    } catch (err) {
      // Don't show alert if popup was just dismissed by user
      if (!err.message?.includes("closed")) {
        setErrorMessage(err.message || "Google sign-in failed.");
        toast.error(err.message || "Google sign in failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-[#E2E2E2] p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">
            CLIENT ACCESS
          </p>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            SIGN IN
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            Access your orders, saved pieces, and express checkout.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 rounded-none">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D5D5D5] bg-white hover:bg-[#F9F9F8] text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer mb-6"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#111111]" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#E2E2E2] w-full" />
          <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-[#999999] absolute">
            OR WITH EMAIL
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-[10px] font-bold uppercase tracking-wider text-[#444444] mb-1.5 block"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="pl-10 rounded-none border-[#D5D5D5] focus-visible:ring-1 focus-visible:ring-[#111111] h-11 text-xs"
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-wider text-[#444444]"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-[10px] uppercase font-bold tracking-wider text-[#666666] hover:text-[#111111] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10 rounded-none border-[#D5D5D5] focus-visible:ring-1 focus-visible:ring-[#111111] h-11 text-xs"
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#111111] hover:bg-black text-white rounded-none h-11 text-xs font-bold uppercase tracking-widest transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#EEEEEE] text-center">
          <p className="text-xs text-[#666666]">
            New to NIVORA?{" "}
            <Link
              href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="text-[#111111] font-bold hover:underline ml-1"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] py-14 px-4 sm:px-6 flex items-center justify-center bg-[#FAFAFA]">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-12 bg-white border border-[#E2E2E2] text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#111111]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
