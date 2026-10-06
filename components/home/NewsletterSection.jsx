"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="bg-[#111111] text-white py-14 sm:py-16 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left copy */}
          <div className="lg:col-span-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B6E600] block mb-2">
              EXCLUSIVE ACCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-white">
              STAY IN THE LOOP
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#A0A0A0] uppercase tracking-wider max-w-lg leading-relaxed">
              Get updates about new drops, exclusive offers and winter essentials before anyone else.
            </p>
          </div>

          {/* Right form */}
          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#181818] border border-[#2A2A2A] text-[#B6E600] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                YOU&apos;RE ON THE LIST. WATCH YOUR INBOX FOR UPCOMING DROPS.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  required
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#181818] border-[#333333] text-white placeholder:text-[#666666] text-xs uppercase h-12 flex-1"
                />
                <Button
                  type="submit"
                  variant="lime"
                  className="h-12 px-8 text-xs font-bold whitespace-nowrap"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
