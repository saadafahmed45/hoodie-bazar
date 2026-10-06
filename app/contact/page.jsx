"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you for reaching out. We will respond within 24 hours.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-12 pb-6 border-b border-[#E2E2E2] text-center max-w-xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
          CLIENT CONCIERGE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          CONTACT US
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#666666] uppercase tracking-wider">
          Inquiries regarding sizing, shipments, wholesale or styling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111111] text-white p-8 space-y-6">
            <h2 className="text-lg font-bold font-editorial uppercase tracking-wider">
              NIVORA HEADQUARTERS
            </h2>
            <div className="space-y-4 text-xs text-[#CCCCCC]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#B6E600] shrink-0 mt-0.5" />
                <span>Road 11, Banani, Dhaka 1213, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#B6E600] shrink-0" />
                <span>concierge@nivora.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#B6E600] shrink-0" />
                <span>+880 1700-000000 (10 AM – 8 PM)</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[#222222] text-[11px] text-[#888888] uppercase tracking-wider">
              WHATSAPP CONCIERGE AVAILABLE DAILY FOR SIZING CONSULTATIONS.
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E2E2E2] p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#B6E600] mx-auto" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-[#111111]">
                  MESSAGE TRANSMITTED
                </h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Our client care team has logged your inquiry and will follow up shortly via email or phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Name *</Label>
                    <Input id="contactName" required placeholder="Your Full Name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input id="contactEmail" type="email" required placeholder="your@email.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactSubject">Subject *</Label>
                  <Input id="contactSubject" required placeholder="Order inquiry / Sizing advice" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactMsg">Message *</Label>
                  <textarea
                    id="contactMsg"
                    required
                    rows={5}
                    placeholder="How can our team assist you today?"
                    className="flex w-full bg-white px-3.5 py-2 text-sm text-[#111111] border border-[#E2E2E2] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <Button type="submit" variant="lime" className="w-full h-12 text-xs font-bold uppercase">
                  <span>DISPATCH INQUIRY</span>
                  <Send className="h-3.5 w-3.5 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
