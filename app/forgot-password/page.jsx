"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to send reset link. Please try again.");
      toast.error(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-14 px-4 sm:px-6 flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-[#E2E2E2] p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">
              SECURITY & ACCESS
            </p>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
              RESET PASSWORD
            </h1>
            <p className="text-xs text-[#666666] mt-2">
              Enter your email and we’ll send a link to securely recover your account.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#111111]">Check Your Email</p>
              <p className="text-xs text-[#666666] leading-relaxed">
                We sent a password reset link to{" "}
                <span className="font-semibold text-[#111111]">{email}</span>. Click the link in
                the email to set a new password.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 rounded-none">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="flex-1">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#444444] mb-1.5 block"
                  >
                    Registered Email Address
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
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] hover:bg-black text-white rounded-none h-11 text-xs font-bold uppercase tracking-widest transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#EEEEEE] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
