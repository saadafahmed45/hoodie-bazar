"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Layers,
  Sparkles,
  ExternalLink,
  UploadCloud,
  Link as LinkIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Palette,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { confirmAction, showSuccess, showError } from "@/lib/swal";

const PRESET_COLORS = [
  { name: "NIVORA Lime", hex: "#b6e600" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Warm Amber", hex: "#ffaa00" },
  { name: "Crimson Red", hex: "#ff4d4d" },
  { name: "Electric Cyan", hex: "#00e5ff" },
  { name: "Soft Lilac", hex: "#c084fc" },
];

const DEFAULT_SLIDE_FORM = {
  headlineLine1: "",
  headlineAccent: "",
  subhead: "",
  description: "",
  categoryTag: "NEW WINTER COLLECTION 2026",
  badgeText: "HEAVYWEIGHT 480 GSM FLEECE",
  image: "",
  alt: "",
  accentColor: "#b6e600",
  primaryCtaLabel: "SHOP WINTER COLLECTION",
  primaryCtaHref: "/shop",
  secondaryCtaLabel: "EXPLORE NEW ARRIVALS",
  secondaryCtaHref: "/new-arrivals",
  tabLabel: "",
  spec1Label: "DENSITY",
  spec1Val: "480 GSM Cotton",
  spec2Label: "STRUCTURE",
  spec2Val: "Double-Lined Hood",
  spec3Label: "DELIVERY",
  spec3Val: "24-48h Dhaka",
  isActive: true,
};

export default function AdminHeroSlidesClient({ initialSlides = [] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'inactive'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [form, setForm] = useState(DEFAULT_SLIDE_FORM);
  const fileInputRef = useRef(null);

  // Filter slides
  const filteredSlides = slides.filter((slide) => {
    if (filterStatus === "active") return slide.isActive !== false;
    if (filterStatus === "inactive") return slide.isActive === false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setForm({
      ...DEFAULT_SLIDE_FORM,
      tabLabel: `0${slides.length + 1} // NEW CAPSULE`,
    });
    setShowUrlInput(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    const specs = Array.isArray(slide.specs) ? slide.specs : [];
    setForm({
      headlineLine1: slide.headlineLine1 || "",
      headlineAccent: slide.headlineAccent || "",
      subhead: slide.subhead || "",
      description: slide.description || "",
      categoryTag: slide.categoryTag || "NEW WINTER COLLECTION 2026",
      badgeText: slide.badgeText || "",
      image: slide.image || "",
      alt: slide.alt || "",
      accentColor: slide.accentColor || "#b6e600",
      primaryCtaLabel: slide.primaryCta?.label || "SHOP WINTER COLLECTION",
      primaryCtaHref: slide.primaryCta?.href || "/shop",
      secondaryCtaLabel: slide.secondaryCta?.label || "EXPLORE NEW ARRIVALS",
      secondaryCtaHref: slide.secondaryCta?.href || "/new-arrivals",
      tabLabel: slide.tabLabel || "",
      spec1Label: specs[0]?.label || "DENSITY",
      spec1Val: specs[0]?.val || "",
      spec2Label: specs[1]?.label || "STRUCTURE",
      spec2Val: specs[1]?.val || "",
      spec3Label: specs[2]?.label || "DELIVERY",
      spec3Val: specs[2]?.val || "",
      isActive: slide.isActive !== false,
    });
    setShowUrlInput(false);
    setDialogOpen(true);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP, AVIF).");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      setForm((prev) => ({
        ...prev,
        image: data.url,
      }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.headlineLine1.trim()) {
      toast.error("Headline Line 1 is required");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Campaign image is required");
      return;
    }

    setSubmitting(true);

    const payload = {
      headlineLine1: form.headlineLine1.trim(),
      headlineAccent: form.headlineAccent.trim(),
      subhead: form.subhead.trim(),
      description: form.description.trim(),
      categoryTag: form.categoryTag.trim(),
      badgeText: form.badgeText.trim(),
      image: form.image.trim(),
      alt: form.alt.trim() || form.headlineLine1.trim(),
      accentColor: form.accentColor,
      primaryCta: {
        label: form.primaryCtaLabel.trim(),
        href: form.primaryCtaHref.trim(),
      },
      secondaryCta: {
        label: form.secondaryCtaLabel.trim(),
        href: form.secondaryCtaHref.trim(),
      },
      specs: [
        { label: form.spec1Label.trim(), val: form.spec1Val.trim() },
        { label: form.spec2Label.trim(), val: form.spec2Val.trim() },
        { label: form.spec3Label.trim(), val: form.spec3Val.trim() },
      ].filter((s) => s.label && s.val),
      tabLabel: form.tabLabel.trim() || `0${slides.length + 1} // SLIDE`,
      isActive: form.isActive,
    };

    try {
      if (editingSlide) {
        // Update existing
        const res = await fetch(`/api/admin/hero-slides/${editingSlide._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update slide");
        }

        setSlides((prev) =>
          prev.map((s) => (s._id === editingSlide._id ? data.slide : s))
        );
        showSuccess("SLIDE UPDATED", "Hero slide was updated successfully.");
      } else {
        // Create new
        const res = await fetch("/api/admin/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create slide");
        }

        setSlides((prev) => [...prev, data.slide]);
        showSuccess("SLIDE CREATED", "New hero slide added to your storefront.");
      }

      setDialogOpen(false);
    } catch (err) {
      console.error("Save slide error:", err);
      showError("ERROR", err.message || "Failed to save slide");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (slide) => {
    const nextState = !slide.isActive;
    // Optimistic update
    setSlides((prev) =>
      prev.map((s) => (s._id === slide._id ? { ...s, isActive: nextState } : s))
    );

    try {
      const res = await fetch(`/api/admin/hero-slides/${slide._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update slide status");
      }
      toast.success(
        nextState
          ? `Slide "${slide.headlineLine1}" is now ACTIVE on storefront`
          : `Slide "${slide.headlineLine1}" is now HIDDEN`
      );
    } catch (err) {
      // Revert on error
      setSlides((prev) =>
        prev.map((s) => (s._id === slide._id ? { ...s, isActive: !nextState } : s))
      );
      toast.error(err.message || "Status update failed");
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Update orders
    const updatedWithOrder = newSlides.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));
    setSlides(updatedWithOrder);

    try {
      const orderedIds = updatedWithOrder.map((s) => s._id);
      const res = await fetch("/api/admin/hero-slides/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save new slide order");
      }
      toast.success("Slide order saved");
    } catch (err) {
      console.error("Reorder error:", err);
      toast.error(err.message || "Failed to update slide order");
    }
  };

  const handleDelete = async (slide) => {
    const confirmed = await confirmAction({
      title: "DELETE SLIDE?",
      text: `Are you sure you want to permanently delete "${slide.headlineLine1} ${slide.headlineAccent}"?`,
      confirmText: "YES, DELETE",
      cancelText: "CANCEL",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/hero-slides/${slide._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete slide");
      }

      setSlides((prev) => prev.filter((s) => s._id !== slide._id));
      showSuccess("DELETED", "Hero slide deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      showError("DELETE FAILED", err.message || "Could not delete slide");
    }
  };

  const activeCount = slides.filter((s) => s.isActive !== false).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-nivora-dark text-white text-[11px] font-bold uppercase tracking-wider rounded-xs mb-2">
            <Sparkles className="h-3 w-3 text-nivora-lime" />
            <span>Storefront Visual Merchandising</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial uppercase tracking-tight text-slate-900">
            Hero Slider Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, reorder, and configure high-fashion Swiper slides featured on your homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="btn-outline-dark text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Storefront</span>
          </Link>
          <Button
            onClick={handleOpenAdd}
            className="bg-[#111111] hover:bg-black text-nivora-lime hover:text-white font-bold text-xs uppercase tracking-wider py-2 px-4 inline-flex items-center gap-2 rounded-xs transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Slide</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xs shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Campaign Slides
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {slides.length}
            </span>
            <span className="text-xs text-slate-500">configured in system</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xs shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Live on Storefront
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">
              {activeCount}
            </span>
            <span className="text-xs text-slate-500">active & rotating</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xs shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Swiper Engine
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-slate-900">
              Autoplay (6s) + Fade Transition
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              filterStatus === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Slides ({slides.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              filterStatus === "active"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Active Only ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus("inactive")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
              filterStatus === "inactive"
                ? "bg-slate-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Hidden ({slides.length - activeCount})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Use the ▲ and ▼ buttons to reorder slides.
        </span>
      </div>

      {/* Slides Cards List */}
      <div className="space-y-4">
        {filteredSlides.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xs p-8">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 uppercase">
              No Slides Found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no hero slides matching the current filter. Click below to add a new slide.
            </p>
            <Button
              onClick={handleOpenAdd}
              className="mt-4 bg-[#111111] text-nivora-lime text-xs font-bold uppercase"
            >
              Add First Slide
            </Button>
          </div>
        ) : (
          filteredSlides.map((slide, index) => {
            const isFirst = index === 0;
            const isLast = index === slides.length - 1;
            const specs = Array.isArray(slide.specs) ? slide.specs : [];

            return (
              <div
                key={slide._id}
                className={`bg-white border transition-all rounded-xs overflow-hidden shadow-2xs hover:shadow-xs ${
                  slide.isActive !== false
                    ? "border-slate-200"
                    : "border-slate-200 bg-slate-50/70 opacity-75"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 items-center">
                  {/* Left: Order & Reorder Controls */}
                  <div className="md:col-span-1 flex md:flex-col items-center justify-between md:justify-center gap-2">
                    <span className="font-mono text-sm font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xs border border-slate-200">
                      #{slide.order || index + 1}
                    </span>
                    <div className="flex md:flex-col gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, "up")}
                        disabled={isFirst}
                        aria-label="Move slide up"
                        className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-xs disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, "down")}
                        disabled={isLast}
                        aria-label="Move slide down"
                        className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-xs disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnail Preview */}
                  <div className="md:col-span-3 relative aspect-16/10 rounded-xs overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                    <Image
                      src={slide.image}
                      alt={slide.alt || slide.headlineLine1 || "Slide image"}
                      fill
                      className="object-cover object-top filter contrast-[1.05]"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          slide.isActive !== false
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-600 text-white"
                        }`}
                      >
                        {slide.isActive !== false ? "Live" : "Hidden"}
                      </span>
                    </div>
                    {slide.badgeText && (
                      <div className="absolute bottom-2 left-2 right-2 truncate text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-xs">
                        {slide.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Center Content Metadata */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                        {slide.categoryTag || "FEATURED"}
                      </span>
                      {slide.tabLabel && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Tab: {slide.tabLabel}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black font-editorial uppercase tracking-tight text-slate-900 leading-tight">
                        {slide.headlineLine1}{" "}
                        <span
                          style={{
                            color:
                              slide.accentColor === "#ffffff"
                                ? "#333333"
                                : slide.accentColor,
                          }}
                          className={
                            slide.accentColor === "#b6e600"
                              ? "bg-slate-900 text-nivora-lime px-1.5 py-0.5 rounded-xs inline-block"
                              : ""
                          }
                        >
                          {slide.headlineAccent}
                        </span>
                      </h3>
                      {slide.subhead && (
                        <p className="text-xs font-bold uppercase text-slate-500 mt-0.5">
                          {slide.subhead}
                        </p>
                      )}
                    </div>

                    {slide.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {slide.description}
                      </p>
                    )}

                    {/* Specs Pills */}
                    {specs.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {specs.map((sp, idx) => (
                          <div
                            key={idx}
                            className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs text-slate-600 font-medium"
                          >
                            <span className="font-bold text-slate-800">
                              {sp.label}:
                            </span>{" "}
                            {sp.val}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>
                        Primary:{" "}
                        <strong className="text-slate-800">
                          {slide.primaryCta?.label || "Shop"}
                        </strong>{" "}
                        ({slide.primaryCta?.href || "/shop"})
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border cursor-pointer transition ${
                        slide.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {slide.isActive !== false ? (
                        <>
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(slide)}
                        className="text-xs font-bold uppercase h-8 px-3 border-slate-300 hover:bg-slate-100"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(slide)}
                        className="text-xs font-bold uppercase h-8 px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE & EDIT MODAL DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xs border border-slate-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-black font-editorial uppercase tracking-tight text-slate-900">
              {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full grid grid-cols-4 border-b border-slate-200 mb-5">
                <TabsTrigger value="content" className="text-xs font-bold">
                  1. Headlines & Copy
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs font-bold">
                  2. Campaign Image
                </TabsTrigger>
                <TabsTrigger value="ctas" className="text-xs font-bold">
                  3. CTAs & Specs
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs font-bold">
                  4. Live Preview
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: HEADLINES & COPY */}
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Headline Line 1 *
                    </Label>
                    <Input
                      required
                      placeholder="e.g. WINTER."
                      value={form.headlineLine1}
                      onChange={(e) =>
                        setForm({ ...form, headlineLine1: e.target.value })
                      }
                      className="mt-1 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Headline Accent (Line 2)
                    </Label>
                    <Input
                      placeholder="e.g. REFINED."
                      value={form.headlineAccent}
                      onChange={(e) =>
                        setForm({ ...form, headlineAccent: e.target.value })
                      }
                      className="mt-1 font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Accent Color Selection */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Accent Color
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => {
                      const isSelected = form.accentColor === color.hex;
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, accentColor: color.hex })
                          }
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xs border cursor-pointer transition ${
                            isSelected
                              ? "border-black bg-slate-100 shadow-xs"
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          {isSelected && <Check className="h-3 w-3 ml-0.5" />}
                        </button>
                      );
                    })}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-xs text-slate-400">Custom:</span>
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) =>
                          setForm({ ...form, accentColor: e.target.value })
                        }
                        className="h-7 w-8 border border-slate-300 cursor-pointer rounded-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category Tag Pill
                    </Label>
                    <Input
                      placeholder="e.g. NEW WINTER COLLECTION 2026"
                      value={form.categoryTag}
                      onChange={(e) =>
                        setForm({ ...form, categoryTag: e.target.value })
                      }
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Supporting Subhead
                    </Label>
                    <Input
                      placeholder="e.g. BUILT FOR COLDER DAYS."
                      value={form.subhead}
                      onChange={(e) =>
                        setForm({ ...form, subhead: e.target.value })
                      }
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Editorial Description
                  </Label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric, cut, and thermal properties..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full mt-1 border border-slate-300 rounded-xs p-2.5 text-xs text-slate-800 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Floating Feature Badge (On Image)
                    </Label>
                    <Input
                      placeholder="e.g. HEAVYWEIGHT 480 GSM FLEECE"
                      value={form.badgeText}
                      onChange={(e) =>
                        setForm({ ...form, badgeText: e.target.value })
                      }
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Control Strip Tab Label
                    </Label>
                    <Input
                      placeholder="e.g. 01 // HEAVYWEIGHT FLEECE"
                      value={form.tabLabel}
                      onChange={(e) =>
                        setForm({ ...form, tabLabel: e.target.value })
                      }
                      className="mt-1 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveCheckbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded-xs border-slate-300 text-black focus:ring-black cursor-pointer"
                  />
                  <Label
                    htmlFor="isActiveCheckbox"
                    className="text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Active on Storefront (Show in rotation)
                  </Label>
                </div>
              </TabsContent>

              {/* TAB 2: CAMPAIGN IMAGE */}
              <TabsContent value="media" className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Campaign Photography *
                  </Label>

                  {/* Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-black rounded-xs p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-slate-100"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      className="hidden"
                    />

                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-black mb-2" />
                        <span className="text-xs font-bold text-slate-700">
                          Uploading image to Cloudinary...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-800 uppercase">
                          Click to upload high-res image
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1">
                          JPG, PNG, WebP or AVIF recommended (min 1600px wide)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Toggle Direct URL Input */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-xs font-bold text-slate-600 hover:text-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>{showUrlInput ? "Hide URL input" : "Or paste image URL directly"}</span>
                    </button>

                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: "" })}
                        className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                      >
                        Remove image
                      </button>
                    )}
                  </div>

                  {showUrlInput && (
                    <div className="mt-2">
                      <Input
                        placeholder="https://images.unsplash.com/... or https://images.pexels.com/..."
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        className="text-xs"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {form.image && (
                    <div className="mt-4 border border-slate-200 rounded-xs p-2 bg-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Current Image Preview:
                      </span>
                      <div className="relative aspect-video w-full max-w-md rounded-xs overflow-hidden bg-slate-900 mx-auto">
                        <Image
                          src={form.image}
                          alt="Slide preview"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Image Alt Text (SEO & Accessibility)
                    </Label>
                    <Input
                      placeholder="e.g. Model wearing NIVORA heavyweight oversized fleece hoodie in Dhaka street"
                      value={form.alt}
                      onChange={(e) =>
                        setForm({ ...form, alt: e.target.value })
                      }
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: CTAS & SPECS */}
              <TabsContent value="ctas" className="space-y-4">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Primary CTA Button (Lime Button)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold text-slate-600">
                        Button Label
                      </Label>
                      <Input
                        placeholder="e.g. SHOP WINTER COLLECTION"
                        value={form.primaryCtaLabel}
                        onChange={(e) =>
                          setForm({ ...form, primaryCtaLabel: e.target.value })
                        }
                        className="mt-1 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold text-slate-600">
                        Destination URL
                      </Label>
                      <Input
                        placeholder="e.g. /shop or /hoodies"
                        value={form.primaryCtaHref}
                        onChange={(e) =>
                          setForm({ ...form, primaryCtaHref: e.target.value })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Secondary CTA Button (Outline Button)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold text-slate-600">
                        Button Label
                      </Label>
                      <Input
                        placeholder="e.g. EXPLORE NEW ARRIVALS"
                        value={form.secondaryCtaLabel}
                        onChange={(e) =>
                          setForm({ ...form, secondaryCtaLabel: e.target.value })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold text-slate-600">
                        Destination URL
                      </Label>
                      <Input
                        placeholder="e.g. /new-arrivals or /collections"
                        value={form.secondaryCtaHref}
                        onChange={(e) =>
                          setForm({ ...form, secondaryCtaHref: e.target.value })
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Specifications Pills */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Slide Specifications (3 Info Cards)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 border border-slate-200 rounded-xs space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Spec 1
                      </Label>
                      <Input
                        placeholder="Label: DENSITY"
                        value={form.spec1Label}
                        onChange={(e) =>
                          setForm({ ...form, spec1Label: e.target.value })
                        }
                        className="text-xs"
                      />
                      <Input
                        placeholder="Value: 480 GSM Cotton"
                        value={form.spec1Val}
                        onChange={(e) =>
                          setForm({ ...form, spec1Val: e.target.value })
                        }
                        className="text-xs font-bold"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 border border-slate-200 rounded-xs space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Spec 2
                      </Label>
                      <Input
                        placeholder="Label: STRUCTURE"
                        value={form.spec2Label}
                        onChange={(e) =>
                          setForm({ ...form, spec2Label: e.target.value })
                        }
                        className="text-xs"
                      />
                      <Input
                        placeholder="Value: Double-Lined Hood"
                        value={form.spec2Val}
                        onChange={(e) =>
                          setForm({ ...form, spec2Val: e.target.value })
                        }
                        className="text-xs font-bold"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 border border-slate-200 rounded-xs space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Spec 3
                      </Label>
                      <Input
                        placeholder="Label: DELIVERY"
                        value={form.spec3Label}
                        onChange={(e) =>
                          setForm({ ...form, spec3Label: e.target.value })
                        }
                        className="text-xs"
                      />
                      <Input
                        placeholder="Value: 24-48h Dhaka"
                        value={form.spec3Val}
                        onChange={(e) =>
                          setForm({ ...form, spec3Val: e.target.value })
                        }
                        className="text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: LIVE PREVIEW */}
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-[#111111] text-white p-6 rounded-xs border border-[#222222]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-4">
                    ✦ Live Storefront Presentation Preview:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left Typography */}
                    <div className="md:col-span-6 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-nivora-dark border border-[#2A2A2A] text-[9px] font-bold uppercase tracking-widest text-nivora-lime">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{form.categoryTag || "COLLECTION"}</span>
                      </div>

                      <h2 className="text-3xl font-black font-editorial tracking-tight uppercase leading-none text-white">
                        {form.headlineLine1 || "HEADLINE."}
                        <br />
                        <span style={{ color: form.accentColor }}>
                          {form.headlineAccent || "ACCENT."}
                        </span>
                      </h2>

                      {form.subhead && (
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {form.subhead}
                        </p>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {form.description || "Slide description will appear here..."}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#222222]">
                        <div className="bg-nivora-dark p-1.5 text-[9px]">
                          <span className="text-slate-500 block">
                            {form.spec1Label || "SPEC 1"}
                          </span>
                          <span className="font-bold text-white truncate block">
                            {form.spec1Val || "Value"}
                          </span>
                        </div>
                        <div className="bg-nivora-dark p-1.5 text-[9px]">
                          <span className="text-slate-500 block">
                            {form.spec2Label || "SPEC 2"}
                          </span>
                          <span className="font-bold text-white truncate block">
                            {form.spec2Val || "Value"}
                          </span>
                        </div>
                        <div className="bg-nivora-dark p-1.5 text-[9px]">
                          <span className="text-slate-500 block">
                            {form.spec3Label || "SPEC 3"}
                          </span>
                          <span className="font-bold text-white truncate block">
                            {form.spec3Val || "Value"}
                          </span>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="flex items-center gap-2 pt-2">
                        <span className="bg-nivora-lime text-black text-[10px] font-bold px-3 py-1.5 uppercase">
                          {form.primaryCtaLabel || "SHOP NOW"} →
                        </span>
                        <span className="border border-white/40 text-white text-[10px] font-bold px-3 py-1.5 uppercase">
                          {form.secondaryCtaLabel || "EXPLORE"}
                        </span>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="md:col-span-6 relative aspect-4/3 rounded-xs overflow-hidden bg-slate-900 border border-[#333333]">
                      {form.image ? (
                        <Image
                          src={form.image}
                          alt="Preview"
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                          <span>No Image Uploaded</span>
                        </div>
                      )}
                      {form.badgeText && (
                        <div className="absolute bottom-2 right-2 bg-black/80 border border-slate-700 text-white text-[9px] font-bold px-2 py-1 rounded-xs">
                          ● {form.badgeText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="text-xs font-bold uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploadingImage}
                className="bg-[#111111] hover:bg-black text-nivora-lime hover:text-white font-bold text-xs uppercase px-5 rounded-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Saving...</span>
                  </>
                ) : editingSlide ? (
                  "Update Hero Slide"
                ) : (
                  "Create Hero Slide"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
