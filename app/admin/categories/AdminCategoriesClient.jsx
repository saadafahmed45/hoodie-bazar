"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
  FolderTree,
  ExternalLink,
  Package,
  UploadCloud,
  Link as LinkIcon,
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
import { toast } from "sonner";
import { confirmAction, showSuccess, showError, brandSwal } from "@/lib/swal";

export default function AdminCategoriesClient({ initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Cover image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const defaultForm = {
    name: "",
    slug: "",
    image: "",
    description: "",
  };

  const [form, setForm] = useState(defaultForm);

  const filteredCategories = categories.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm(defaultForm);
    setShowUrlInput(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
      description: cat.description || "",
    });
    setShowUrlInput(false);
    setDialogOpen(true);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, AVIF, etc.)");
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

      const uploadedUrl = data.url || (data.urls && data.urls[0]);
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, image: uploadedUrl }));
        toast.success("Cover image uploaded to Cloudinary successfully!");
      } else {
        throw new Error("No URL returned from upload server");
      }
    } catch (err) {
      console.error("Cover image upload error:", err);
      toast.error(err.message || "Failed to upload cover image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleNameChange = (name) => {
    // If adding a new category, auto-generate slug
    if (!editingCategory) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setForm((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        image: form.image.trim() || undefined,
        description: form.description.trim(),
      };

      if (editingCategory) {
        // PUT update
        const res = await fetch(`/api/admin/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

        setCategories((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id
              ? { ...data.category, productCount: c.productCount || 0 }
              : c
          )
        );
        showSuccess(
          "CATEGORY UPDATED",
          `Category "${data.category.name}" was updated successfully.`
        );
      } else {
        // POST create
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Creation failed");

        setCategories((prev) => [{ ...data.category, productCount: 0 }, ...prev]);
        showSuccess(
          "CATEGORY CREATED",
          `Category "${data.category.name}" has been created.`
        );
      }

      setDialogOpen(false);
    } catch (err) {
      showError("FAILED TO SAVE", err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    const hasProducts = (cat.productCount || 0) > 0;

    const result = await brandSwal.fire({
      title: "DELETE CATEGORY?",
      html: `
        <p class="mb-2">Are you sure you want to delete category <strong>"${cat.name}"</strong>?</p>
        ${
          hasProducts
            ? `<div class="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-left text-xs mb-2">
                <strong>Notice:</strong> This category currently contains <strong>${cat.productCount} product(s)</strong>.
               </div>`
            : ""
        }
        <span class="text-[11px] text-[#888888] block">This action cannot be undone.</span>
      `,
      icon: "warning",
      iconColor: "#DC2626",
      showCancelButton: true,
      confirmButtonText: "YES, DELETE",
      cancelButtonText: "CANCEL",
      reverseButtons: true,
      customClass: {
        popup: "font-sans border border-[#E2E2E2] rounded-none shadow-2xl max-w-md",
        title: "font-editorial text-lg tracking-tight uppercase text-[#111111]",
        htmlContainer: "text-xs text-[#666666]",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors",
        cancelButton:
          "bg-[#F5F5F3] hover:bg-[#E2E2E2] text-[#111111] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none border border-[#CCCCCC] transition-colors",
      },
    });

    if (!result.isConfirmed) return;

    setDeletingId(cat._id);
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      showSuccess("CATEGORY DELETED", `Category "${cat.name}" was removed.`);
    } catch (err) {
      showError("DELETE FAILED", err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-nivora-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            CATEGORIES ({categories.length})
          </h1>
        </div>

        <Button
          variant="lime"
          size="default"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 cursor-pointer font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>ADD CATEGORY</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 border border-nivora-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888888]" />
          <Input
            placeholder="Search categories by name, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs border-nivora-border focus-visible:ring-1 focus-visible:ring-[#111111] rounded-none bg-[#FAFAFA]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs text-[#888888] font-mono hidden sm:inline">
          {filteredCategories.length} category{filteredCategories.length === 1 ? "" : "ies"}
        </span>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-nivora-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-nivora-soft border-b border-nivora-border text-[#888888] uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6 font-bold w-16">IMAGE</th>
                <th className="p-4 font-bold">CATEGORY NAME</th>
                <th className="p-4 font-bold">DESCRIPTION</th>
                <th className="p-4 font-bold text-center">PRODUCTS</th>
                <th className="p-4 pr-6 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nivora-border">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-xs text-[#888888] uppercase tracking-wider"
                  >
                    No categories found. Click &ldquo;ADD CATEGORY&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="relative h-12 w-12 bg-nivora-soft border border-nivora-border overflow-hidden">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#888888]">
                            <FolderTree className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold uppercase tracking-wider text-[#111111] max-w-50">
                      <div>{cat.name}</div>
                      <span className="text-[10px] text-[#888888] font-mono font-normal">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="p-4 text-nivora-muted max-w-sm">
                      <p className="line-clamp-2">{cat.description || "—"}</p>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-nivora-soft hover:bg-nivora-border text-[#111111] font-bold text-[10px] uppercase tracking-wider transition-colors"
                        title="Filter products by this category"
                      >
                        <Package className="h-3 w-3" />
                        <span>{cat.productCount || 0} products</span>
                        <ExternalLink className="h-2.5 w-2.5 ml-0.5 text-[#888888]" />
                      </Link>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 border border-nivora-border hover:border-[#111111] text-[#111111] transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === cat._id}
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Category"
                      >
                        {deletingId === cat._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-none">
          <DialogHeader className="pb-4 border-b border-nivora-border">
            <DialogTitle className="font-editorial text-xl font-black uppercase tracking-tight">
              {editingCategory ? "EDIT CATEGORY" : "CREATE NEW CATEGORY"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor="catName">Category Name *</Label>
              <Input
                id="catName"
                required
                placeholder="e.g. Hoodies, Knitwear, Outerwear..."
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="rounded-none border-nivora-border focus-visible:ring-1 focus-visible:ring-[#111111]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catSlug">URL Slug (Auto-generated)</Label>
              <Input
                id="catSlug"
                placeholder="e.g. hoodies, knitwear"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="rounded-none border-nivora-border font-mono text-xs focus-visible:ring-1 focus-visible:ring-[#111111]"
              />
            </div>

            {/* Cover Image Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Cover Image
                </Label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-[#111111] font-bold uppercase underline underline-offset-4 hover:text-[#888888] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LinkIcon className="h-3 w-3" />
                  <span>{showUrlInput ? "Hide URL" : form.image ? "Edit Raw URL" : "Paste URL Instead"}</span>
                </button>
              </div>

              {/* Hidden file input for device picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {/* Cover Image Preview Card if image exists */}
              {form.image ? (
                <div className="relative border border-nivora-border bg-[#FAF9F7] overflow-hidden group">
                  <div className="relative h-36 w-full bg-[#111111] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Category cover preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Uploading overlay if replacing */}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white z-10 gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-nivora-lime" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Uploading to Cloudinary...
                        </span>
                      </div>
                    )}

                    {/* Action overlay bar */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex items-end justify-between p-3 transition-opacity">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-nivora-lime text-[#111111] font-black text-[9px] uppercase px-2 py-0.5 tracking-wider shadow-sm">
                          COVER ACTIVE
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-white hover:bg-nivora-soft text-[#111111] font-bold text-[10px] uppercase tracking-wider shadow transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Select a replacement image from your device"
                        >
                          <UploadCloud className="h-3 w-3" />
                          <span>Change Image</span>
                        </button>
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, image: "" }));
                            toast.success("Cover image removed");
                          }}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-none shadow transition-colors cursor-pointer disabled:opacity-50"
                          title="Remove cover image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone for device selection */
                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-[#111111] bg-nivora-lime/10 scale-[1.01] ring-2 ring-[#B6E600]"
                      : "border-[#CCCCCC] bg-[#FAF9F7] hover:border-[#111111] hover:bg-nivora-soft"
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                      <Loader2 className="w-7 h-7 animate-spin text-[#111111]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        Uploading to Cloudinary...
                      </span>
                      <span className="text-[10px] text-nivora-muted">
                        Optimizing and storing securely
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                          isDragging
                            ? "bg-nivora-lime text-[#111111]"
                            : "bg-white border border-nivora-border text-[#111111]"
                        }`}
                      >
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                          Select Cover Image from Device or{" "}
                          <span className="underline underline-offset-4 decoration-nivora-lime decoration-2">
                            Browse
                          </span>
                        </span>
                        <p className="text-[10px] text-[#888888] mt-1 font-mono">
                          Direct upload to Cloudinary • JPG, PNG, WEBP, AVIF
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Raw URL Input (collapsible or toggleable) */}
              {showUrlInput && (
                <div className="pt-1 flex items-center gap-2 animate-in fade-in duration-150">
                  <Input
                    id="catImage"
                    type="url"
                    placeholder="https://images.unsplash.com/... or Cloudinary URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="rounded-none border-nivora-border text-xs focus-visible:ring-1 focus-visible:ring-[#111111] bg-white h-8 flex-1"
                  />
                  {form.image && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowUrlInput(false)}
                      className="h-8 rounded-none text-[10px] font-bold uppercase tracking-wider shrink-0"
                    >
                      Done
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catDesc">Description</Label>
              <textarea
                id="catDesc"
                rows={3}
                placeholder="Short description for storefront category cards and SEO..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex w-full bg-white px-3.5 py-2 text-xs text-[#111111] border border-nivora-border focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="pt-4 border-t border-nivora-border flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-none text-xs font-bold uppercase tracking-wider"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="lime"
                disabled={submitting || uploadingImage}
                className="rounded-none text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>SAVING...</span>
                  </div>
                ) : uploadingImage ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>UPLOADING IMAGE...</span>
                  </div>
                ) : (
                  <span>{editingCategory ? "UPDATE CATEGORY" : "CREATE CATEGORY"}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
