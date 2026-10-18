"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  Ruler,
  Package,
  RefreshCw,
  Briefcase,
  HelpCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { BRAND_NAME } from "@/lib/constants";

const STORE_PHONE = "+880 1700-000000";
const RAW_PHONE = "8801700000000";
const STORE_EMAIL = "concierge@hoodiebazar.com";
const STUDIO_ADDRESS = "Road 11, Block D, Banani, Dhaka 1213, Bangladesh";

const TOPICS = [
  {
    id: "sizing",
    label: "Sizing & Fit Advice",
    icon: Ruler,
    description: "Guidance on Regular vs Oversized cuts & fabric GSM",
  },
  {
    id: "order",
    label: "Order Tracking & Status",
    icon: Package,
    description: "Parcel location, courier tracking & delivery updates",
  },
  {
    id: "return",
    label: "Exchange & Returns",
    icon: RefreshCw,
    description: "7-day hassle-free replacement or size swaps",
  },
  {
    id: "wholesale",
    label: "Bulk & Corporate",
    icon: Briefcase,
    description: "Custom embroidery, university batches & wholesale",
  },
  {
    id: "feedback",
    label: "General Inquiry",
    icon: MessageSquare,
    description: "Store feedback, collaborations or brand inquiries",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "How fast is delivery inside Dhaka Metro vs Outside Dhaka?",
    answer:
      "Inside Dhaka Metro, orders placed before 3:00 PM are dispatched on the same day and delivered within 24 to 48 hours via priority courier. Outside Dhaka across all 64 districts of Bangladesh, deliveries take 2 to 4 business days. You will receive a tracking link via SMS once your parcel is on the road.",
  },
  {
    id: "faq-2",
    question: "How do I choose between Regular Fit and Heavyweight Oversized cut?",
    answer:
      "Our Regular Fit hoodies offer an athletic, true-to-size drape ideal for subtle layering. Our Oversized Heavyweight hoodies feature dropped shoulders, a wider chest box, and extra torso volume engineered for bold streetwear aesthetics. If you prefer a snug fit in oversized models, we recommend sizing down one size.",
  },
  {
    id: "faq-3",
    question: "What is your return & exchange policy if the hoodie does not fit?",
    answer:
      "We offer a 7-day hassle-free size exchange guarantee nationwide. Ensure the garment is unworn, unwashed, and retains all original tags. Simply select 'Exchange & Returns' on this form or WhatsApp our concierge with your Order ID, and our courier will swap the size directly at your doorstep.",
  },
  {
    id: "faq-4",
    question: "Do you offer Cash on Delivery (COD) across Bangladesh?",
    answer:
      "Yes, 100% Cash on Delivery (COD) is supported across Dhaka and all 64 districts in Bangladesh. You inspect the parcel upon delivery and pay the delivery rider in cash or via mobile payment (bKash/Nagad).",
  },
  {
    id: "faq-5",
    question: "Can I visit your Banani atelier to try on different fabrics & sizes?",
    answer:
      "Absolutely. Our Banani atelier is open Saturday through Thursday from 11:00 AM to 9:00 PM. You can feel our 380–450 GSM combed cotton fleece, try on multiple silhouettes, and purchase directly on-site.",
  },
  {
    id: "faq-6",
    question: "How can I check the live status of an existing order right now?",
    answer:
      "You can visit our dedicated Track Order portal in the main menu, or enter your Order ID directly in the 'Order Tracking' section of this contact page. Alternatively, message us on WhatsApp with your phone number for instant human verification.",
  },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "sizing",
    orderId: "",
    urgency: "standard",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedInquiryId, setCopiedInquiryId] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(STORE_EMAIL);
    setCopiedEmail(true);
    toast.success("Concierge email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(STORE_PHONE);
    setCopiedPhone(true);
    toast.success("Concierge hotline copied to clipboard!");
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleCopyInquiryId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedInquiryId(true);
    toast.success("Inquiry Reference ID copied to clipboard!");
    setTimeout(() => setCopiedInquiryId(false), 2500);
  };

  const getWhatsAppDirectUrl = () => {
    const selectedTopicObj = TOPICS.find((t) => t.id === formData.topic);
    const greeting = formData.name ? `Hi Hoodie Bazar, I'm ${formData.name}.` : "Hi Hoodie Bazar Concierge!";
    const topicLine = `Topic: ${selectedTopicObj ? selectedTopicObj.label : "General Inquiry"}`;
    const orderLine = formData.orderId ? `Order ID: ${formData.orderId}` : "";
    const msgLine = formData.message ? `Message: ${formData.message}` : "I'd like to ask a quick question.";

    const fullText = [greeting, topicLine, orderLine, msgLine]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(fullText)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error("Please write at least 10 characters describing your inquiry.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSubmittedData({
        inquiryId: data.inquiryId,
        name: formData.name,
        email: formData.email,
        topic: formData.topic,
      });

      toast.success("Inquiry transmitted successfully to our concierge!");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try WhatsApp support.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      topic: "sizing",
      orderId: "",
      urgency: "standard",
      message: "",
    });
  };

  const isOrderRelated = formData.topic === "order" || formData.topic === "return";

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Editorial Hero Banner */}
      <section className="bg-[#111111] text-white pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-[#222222] relative overflow-hidden">
        {/* Subtle geometric background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] bg-size-[24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-nivora-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Live Concierge Status Indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-[#333333] text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nivora-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nivora-lime" />
            </span>
            <span className="text-white">CLIENT CONCIERGE ACTIVE</span>
            <span className="text-[#888888]">&bull;</span>
            <span className="text-nivora-lime font-bold">REPLY TIME &lt; 15 MINS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-editorial tracking-tight uppercase leading-[0.98] max-w-4xl mx-auto text-white">
            CONNECT WITH OUR <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-nivora-lime">
              ATELIER & CONCIERGE
            </span>
          </h1>

          <p className="mt-5 text-xs sm:text-sm text-slate-300 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            Tailored sizing consultations, urgent order updates, returns, and showroom visits in Banani, Dhaka.
          </p>

          {/* Quick Promise Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-bold uppercase tracking-wider text-[#CCCCCC]">
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2B2B2B] px-3.5 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-nivora-lime" />
              <span>Daily 10 AM – 10 PM BDT</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2B2B2B] px-3.5 py-1.5 rounded-lg">
              <Truck className="w-3.5 h-3.5 text-nivora-lime" />
              <span>24–48h Dhaka Metro Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2B2B2B] px-3.5 py-1.5 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5 text-nivora-lime" />
              <span>7-Day Doorstep Size Swaps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
        {/* 4 Direct Channel Cards */}
        <section aria-labelledby="direct-channels-heading">
          <div className="flex items-center justify-between pb-4 border-b border-nivora-border mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                COMMUNICATION CHANNELS
              </span>
              <h2
                id="direct-channels-heading"
                className="text-xl sm:text-2xl font-black font-editorial tracking-tight uppercase text-[#111111]"
              >
                DIRECT CONCIERGE ACCESS
              </h2>
            </div>
            <span className="text-xs text-nivora-muted hidden sm:inline-block">
              Choose your preferred platform
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. WhatsApp Chat */}
            <div className="bg-[#111111] text-white p-6 rounded-2xl border border-[#222222] flex flex-col justify-between hover:border-nivora-lime/50 transition duration-300 shadow-xs group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#222222] text-nivora-lime flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-nivora-lime text-[#111111]">
                    FASTEST
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  WhatsApp Concierge
                </h3>
                <p className="text-xs text-[#888888] mt-1 leading-relaxed">
                  Real-time chat with human styling & sizing specialists.
                </p>
                <div className="mt-3 text-[11px] font-mono text-nivora-lime font-bold">
                  {STORE_PHONE}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#222222]">
                <a
                  href={`https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(
                    "Hello Hoodie Bazar! I need assistance with winter hoodies."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-nivora-lime hover:bg-[#a4cf00] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl transition active:scale-95"
                  id="btn-whatsapp-direct"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Direct Telephone Line */}
            <div className="bg-nivora-soft p-6 rounded-2xl border border-nivora-border flex flex-col justify-between hover:border-[#111111] transition duration-300 shadow-xs group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#111111] border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    10 AM – 10 PM
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#111111]">
                  Concierge Hotline
                </h3>
                <p className="text-xs text-nivora-muted mt-1 leading-relaxed">
                  Immediate verbal assistance for urgent address and order edits.
                </p>
                <div className="mt-3 text-[11px] font-mono text-[#111111] font-bold">
                  {STORE_PHONE}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2">
                <a
                  href={`tel:${STORE_PHONE.replace(/[\s\-]/g, "")}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition active:scale-95"
                  id="btn-hotline-call"
                >
                  <Phone className="w-3.5 h-3.5 text-nivora-lime" />
                  <span>Call Now</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  title="Copy Phone Number"
                  className="p-2.5 bg-white border border-slate-200 hover:border-black rounded-xl text-slate-700 transition"
                  id="btn-copy-phone"
                >
                  {copiedPhone ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 3. Official Email */}
            <div className="bg-nivora-soft p-6 rounded-2xl border border-nivora-border flex flex-col justify-between hover:border-[#111111] transition duration-300 shadow-xs group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#111111] border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    &lt; 4H REPLY
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#111111]">
                  Email Dispatch
                </h3>
                <p className="text-xs text-nivora-muted mt-1 leading-relaxed">
                  Written documentation, receipts, returns, and wholesale catalogs.
                </p>
                <div className="mt-3 text-[11px] font-mono text-[#111111] font-bold truncate">
                  {STORE_EMAIL}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2">
                <a
                  href={`mailto:${STORE_EMAIL}?subject=Customer Inquiry - Hoodie Bazar`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition active:scale-95"
                  id="btn-email-write"
                >
                  <Mail className="w-3.5 h-3.5 text-nivora-lime" />
                  <span>Send Email</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy Email Address"
                  className="p-2.5 bg-white border border-slate-200 hover:border-black rounded-xl text-slate-700 transition"
                  id="btn-copy-email"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 4. Atelier & Showroom */}
            <div className="bg-nivora-soft p-6 rounded-2xl border border-nivora-border flex flex-col justify-between hover:border-[#111111] transition duration-300 shadow-xs group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#111111] border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    DHAKA STUDIO
                  </span>
                </div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#111111]">
                  Banani Atelier
                </h3>
                <p className="text-xs text-nivora-muted mt-1 leading-relaxed">
                  Try on fits in person & inspect 400+ GSM heavyweight fleece fabrics.
                </p>
                <div className="mt-3 text-[11px] text-[#444444] font-medium leading-tight">
                  Road 11, Block D, Banani
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <a
                  href="https://maps.google.com/?q=Road+11+Banani+Dhaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-100 text-[#111111] border border-slate-300 hover:border-black font-bold text-xs uppercase tracking-wider rounded-xl transition active:scale-95"
                  id="btn-google-maps"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Showroom Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-nivora-border rounded-3xl p-6 sm:p-8 shadow-xs">
              {submittedData ? (
                /* Success Confirmation View */
                <div className="py-10 text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-[#111111] text-nivora-lime flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-muted">
                      INQUIRY LOGGED &bull; DISPATCH CONFIRMED
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-editorial uppercase tracking-tight text-[#111111] mt-1">
                      MESSAGE TRANSMITTED
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you, <strong className="text-black">{submittedData.name}</strong>. Our client concierge has received your request and will follow up at <strong className="text-black">{submittedData.email}</strong> within 4 hours.
                    </p>
                  </div>

                  {/* Reference ID Card */}
                  <div className="bg-nivora-soft border border-nivora-border rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Tracking Reference ID
                      </span>
                      <span className="font-mono text-sm font-black text-[#111111]">
                        #{submittedData.inquiryId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyInquiryId(submittedData.inquiryId)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-black text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {copiedInquiryId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Send Another Inquiry
                    </button>
                    <Link
                      href="/shop"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                    >
                      Explore Winter Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                /* Interactive Multi-Topic Form */
                <form onSubmit={handleSubmit} className="space-y-6" id="concierge-inquiry-form">
                  <div className="border-b border-nivora-border pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                      STEP 1 OF 2
                    </span>
                    <h3 className="text-xl font-black font-editorial tracking-tight uppercase text-[#111111]">
                      SELECT INQUIRY TOPIC
                    </h3>
                    <p className="text-xs text-nivora-muted mt-1">
                      Direct your message to the responsible concierge department for faster response.
                    </p>
                  </div>

                  {/* Topic Selector Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TOPICS.map((topic) => {
                      const Icon = topic.icon;
                      const isSelected = formData.topic === topic.id;

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, topic: topic.id })}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                              : "bg-[#FAFAFA] text-[#111111] border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#222222] text-nivora-lime"
                                : "bg-white text-slate-700 border border-slate-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider leading-snug">
                              {topic.label}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 line-clamp-1 ${
                                isSelected ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {topic.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-b border-nivora-border pb-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                      STEP 2 OF 2
                    </span>
                    <h3 className="text-xl font-black font-editorial tracking-tight uppercase text-[#111111]">
                      YOUR INQUIRY DETAILS
                    </h3>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="inquiry-name"
                        className="text-xs font-bold uppercase tracking-wider text-[#111111] block"
                      >
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="inquiry-email"
                        className="text-xs font-bold uppercase tracking-wider text-[#111111] block"
                      >
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. tanvir@gmail.com"
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition"
                      />
                    </div>

                    {/* Phone (Optional/Recommended) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="inquiry-phone"
                        className="text-xs font-bold uppercase tracking-wider text-[#111111] block"
                      >
                        Phone Number <span className="text-[10px] text-slate-400 font-normal">(Optional for SMS)</span>
                      </label>
                      <input
                        id="inquiry-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition"
                      />
                    </div>

                    {/* Order ID (Conditional highlight) */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="inquiry-order-id"
                        className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center justify-between"
                      >
                        <span>Order ID</span>
                        {isOrderRelated && (
                          <span className="text-[10px] text-nivora-lime bg-[#111111] px-1.5 py-0.2 rounded-sm font-bold">
                            Recommended
                          </span>
                        )}
                      </label>
                      <input
                        id="inquiry-order-id"
                        type="text"
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        placeholder="e.g. HB-2026-XXXX"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition uppercase font-mono ${
                          isOrderRelated
                            ? "bg-amber-50/50 border-amber-300"
                            : "bg-[#FAFAFA] border-slate-200"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Priority Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                      Inquiry Urgency
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="urgency"
                          value="standard"
                          checked={formData.urgency === "standard"}
                          onChange={() => setFormData({ ...formData, urgency: "standard" })}
                          className="accent-[#111111]"
                        />
                        <span>Standard (Within 4 hours)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="urgency"
                          value="urgent"
                          checked={formData.urgency === "urgent"}
                          onChange={() => setFormData({ ...formData, urgency: "urgent" })}
                          className="accent-rose-600"
                        />
                        <span className="text-rose-700 font-bold">Urgent (Express Dispatch / Immediate Cancellation)</span>
                      </label>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="inquiry-message"
                        className="text-xs font-bold uppercase tracking-wider text-[#111111]"
                      >
                        Message <span className="text-rose-600">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formData.message.length} / 800
                      </span>
                    </div>
                    <textarea
                      id="inquiry-message"
                      required
                      rows={5}
                      maxLength={800}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify size measurements, fabric questions, order issues, or wholesale quantities..."
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-2xl p-4 text-xs text-[#111111] focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition leading-relaxed"
                    />
                  </div>

                  {/* Submit and WhatsApp Dual Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      id="btn-submit-inquiry"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-nivora-lime" />
                          <span>TRANSMITTING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-nivora-lime" />
                          <span>DISPATCH INQUIRY TO CONCIERGE</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px bg-slate-200 flex-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        OR PREFER INSTANT CHAT?
                      </span>
                      <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <a
                      href={getWhatsAppDirectUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-11 bg-nivora-lime hover:bg-[#a4cf00] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-2"
                      id="btn-submit-whatsapp-sync"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>FORWARD THIS MESSAGE TO WHATSAPP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Banani Studio Card & Promises (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Atelier / Showroom Feature Card */}
            <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 border border-[#222222] shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nivora-lime/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-nivora-lime block">
                      PHYSICAL LOCATION
                    </span>
                    <h3 className="text-xl font-black font-editorial tracking-tight uppercase text-white mt-0.5">
                      BANANI ATELIER
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#222222] text-nivora-lime flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-nivora-lime shrink-0 mt-0.5" />
                    <span>{STUDIO_ADDRESS}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-nivora-lime shrink-0" />
                    <span>Saturday – Thursday: 11:00 AM – 9:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-nivora-lime shrink-0" />
                    <span>Direct Atelier Line: {STORE_PHONE}</span>
                  </div>
                </div>

                {/* Showroom Amenities */}
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-4 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block">
                    ATELIER AMENITIES & SERVICES
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#CCCCCC]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-nivora-lime">&bull;</span>
                      <span>Fitting & Try-on Suites</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-nivora-lime">&bull;</span>
                      <span>Fabric GSM Touch Bar</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-nivora-lime">&bull;</span>
                      <span>bKash, Nagad & Cards</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-nivora-lime">&bull;</span>
                      <span>Customer Parking Spot</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Road+11+Banani+Dhaka+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl transition active:scale-95"
                >
                  <span>GET DRIVING DIRECTIONS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Client Service Commitments */}
            <div className="bg-nivora-soft border border-nivora-border rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#111111] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-nivora-lime" />
                <span>NIVORA SERVICE COMMITMENTS</span>
              </h4>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white text-[#111111] flex items-center justify-center shrink-0 border border-slate-200 mt-0.5 font-bold text-[10px]">
                    01
                  </div>
                  <div>
                    <strong className="text-[#111111] block">Uncompromising Fabric Standard</strong>
                    380–450 GSM combed cotton fleece with zero polyester pilling.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white text-[#111111] flex items-center justify-center shrink-0 border border-slate-200 mt-0.5 font-bold text-[10px]">
                    02
                  </div>
                  <div>
                    <strong className="text-[#111111] block">Doorstep Sizing Exchanges</strong>
                    Wrong size? Our courier brings the replacement to your doorstep in 48 hours.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white text-[#111111] flex items-center justify-center shrink-0 border border-slate-200 mt-0.5 font-bold text-[10px]">
                    03
                  </div>
                  <div>
                    <strong className="text-[#111111] block">Transparent Courier Tracking</strong>
                    Live SMS tracking notifications throughout transit in all 64 districts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section aria-labelledby="faq-section-heading" className="pt-8">
          <div className="border-t border-nivora-border pt-12">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-1">
                KNOWLEDGE BASE
              </span>
              <h2
                id="faq-section-heading"
                className="text-2xl sm:text-4xl font-black font-editorial tracking-tight uppercase text-[#111111]"
              >
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <p className="mt-2 text-xs text-nivora-muted uppercase tracking-wider">
                Instant answers to our most common client and order inquiries.
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white border border-nivora-border rounded-3xl p-6 sm:p-8 shadow-xs">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left text-xs sm:text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <span>Still have an unanswered question?</span>
                <a
                  href={`https://wa.me/${RAW_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#111111] hover:text-black uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <span>Chat with an agent</span>
                  <ArrowRight className="w-3.5 h-3.5 text-nivora-lime" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
