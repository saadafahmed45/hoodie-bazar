"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  AlertCircle,
  Search,
  X,
  PackageCheck,
  PackageX,
  Star,
  CheckSquare,
  FolderTree,
  UploadCloud,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ProductImageManager from "@/components/admin/ProductImageManager";
import { confirmDelete, showSuccess, showError, brandSwal } from "@/lib/swal";

export default function AdminProductsClient({
  initialProducts = [],
  initialCategories = [],
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(
    initialCategories.length > 0 ? initialCategories : CATEGORIES
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Quick Add Category Modal state
  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);
  const [uploadingQuickCatImg, setUploadingQuickCatImg] = useState(false);
  const quickCatFileRef = useRef(null);

  // Form state
  const defaultForm = {
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "Hoodies",
    images: [],
    colors: "Black, Cream, Brown",
    sizes: "M, L, XL",
    stock: 25,
    featured: false,
    newArrival: true,
    material: "100% Cotton",
  };

  const [form, setForm] = useState(defaultForm);

  // Search & Filter
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === "All" ||
      p.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isAllFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p._id));
  const isSomeFilteredSelected =
    filteredProducts.some((p) => selectedIds.includes(p._id)) && !isAllFilteredSelected;

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredProducts.map((p) => p._id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const combined = new Set([...selectedIds, ...filteredProducts.map((p) => p._id)]);
      setSelectedIds(Array.from(combined));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      ...defaultForm,
      images: [],
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: p.price,
      oldPrice: p.oldPrice || "",
      category: p.category,
      images: Array.isArray(p.images) ? [...p.images] : (p.images ? [p.images] : []),
      colors: Array.isArray(p.colors) ? p.colors.join(", ") : p.colors || "",
      sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes || "",
      stock: p.stock ?? 0,
      featured: Boolean(p.featured),
      newArrival: Boolean(p.newArrival),
      material: p.material || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imagesArr = Array.isArray(form.images) && form.images.length > 0
        ? form.images.filter(Boolean)
        : (typeof form.images === "string" && form.images.trim()
            ? form.images
                .split(/[\n,]/)
                .map((url) => url.trim())
                .filter(Boolean)
            : ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85"]);

      const colorsArr = form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const sizesArr = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        category: form.category,
        images: imagesArr,
        colors: colorsArr,
        sizes: sizesArr,
        stock: Number(form.stock),
        featured: Boolean(form.featured),
        newArrival: Boolean(form.newArrival),
        material: form.material,
      };

      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? data.product : p))
        );
        showSuccess("PRODUCT UPDATED", `"${data.product.name}" has been successfully updated.`);
      } else {
        // POST create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Creation failed");

        setProducts((prev) => [data.product, ...prev]);
        showSuccess("PRODUCT CREATED", `"${data.product.name}" has been added to catalog.`);
      }

      setDialogOpen(false);
    } catch (err) {
      showError("SAVE FAILED", err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirmDelete(
      name,
      "This product and all its variations will be permanently removed from your catalog."
    );
    if (!isConfirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      showSuccess("PRODUCT DELETED", `"${name}" was deleted successfully.`);
    } catch (err) {
      showError("DELETE FAILED", err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const selectedProducts = products.filter((p) => selectedIds.includes(p._id));
    const sampleNames = selectedProducts
      .slice(0, 4)
      .map((p) => `<div class="truncate py-0.5">• ${p.name}</div>`)
      .join("");
    const moreText =
      count > 4
        ? `<div class="text-[11px] text-[#888888] pt-1 italic font-sans">+ ${count - 4} more products</div>`
        : "";

    const result = await brandSwal.fire({
      title: `DELETE ${count} PRODUCT${count > 1 ? "S" : ""}?`,
      html: `
        <p class="mb-2">Are you sure you want to permanently delete <strong>${count} selected product${count > 1 ? "s" : ""}</strong>?</p>
        <div class="p-3 bg-[#F9F9F8] border border-nivora-border text-left text-xs font-mono my-2 text-[#222222] max-h-36 overflow-y-auto">
          ${sampleNames}
          ${moreText}
        </div>
        <span class="text-[11px] text-red-600 block font-bold uppercase mt-2">
          Warning: This action is permanent and cannot be undone.
        </span>
      `,
      icon: "warning",
      iconColor: "#DC2626",
      showCancelButton: true,
      confirmButtonText: `YES, DELETE ${count} PRODUCT${count > 1 ? "S" : ""}`,
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

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete selected products");
      }

      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      showSuccess(
        "PRODUCTS DELETED",
        `Successfully deleted ${data.affectedCount || count} product(s) from catalog.`
      );
    } catch (err) {
      showError("BULK DELETE FAILED", err.message || "Failed to delete products");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkUpdate = async (action, value, actionLabel) => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds, value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to ${actionLabel}`);
      }

      setProducts((prev) =>
        prev.map((p) => {
          if (!selectedIds.includes(p._id)) return p;
          if (action === "set_stock") return { ...p, stock: Number(value) };
          if (action === "toggle_featured") return { ...p, featured: Boolean(value) };
          if (action === "toggle_newArrival") return { ...p, newArrival: Boolean(value) };
          if (action === "set_category") return { ...p, category: String(value) };
          return p;
        })
      );
      toast.success(`Updated ${selectedIds.length} product(s)`);
    } catch (err) {
      showError("ACTION FAILED", err.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleCreateCategoryQuick = async (e) => {
    e?.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setCreatingCat(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          image: newCatImage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create category");

      setCategories((prev) => [data.category, ...prev]);
      setForm((prev) => ({ ...prev, category: data.category.name }));
      setNewCatName("");
      setNewCatImage("");
      setNewCatModalOpen(false);
      toast.success(`Category "${data.category.name}" created and selected!`);
    } catch (err) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setCreatingCat(false);
    }
  };

  const handleQuickCatFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setUploadingQuickCatImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      const url = data.url || (data.urls && data.urls[0]);
      if (url) {
        setNewCatImage(url);
        toast.success("Cover image uploaded to Cloudinary!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingQuickCatImg(false);
      if (quickCatFileRef.current) quickCatFileRef.current.value = "";
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
            PRODUCTS ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#CCCCCC] hover:border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-wider bg-white transition-colors cursor-pointer"
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span>CATEGORIES ({categories.length})</span>
          </Link>

          <Button
            variant="lime"
            size="default"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 cursor-pointer font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>ADD PRODUCT</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-nivora-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888888]" />
          <Input
            placeholder="Search by name, slug..."
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

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-9 text-xs rounded-none border-nivora-border bg-[#FAFAFA]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug || cat._id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm || categoryFilter !== "All") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
              }}
              className="h-9 text-[10px] font-bold uppercase rounded-none px-3 cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-[#111111] text-white p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-lg border border-[#333333] transition-all">
          <div className="flex items-center gap-3">
            <span className="bg-nivora-lime text-[#111111] font-bold text-[11px] px-2.5 py-1 tracking-wider uppercase font-mono">
              {selectedIds.length} SELECTED
            </span>
            <span className="text-xs text-[#888888] hidden sm:inline">
              of {products.length} products
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[11px] uppercase tracking-wider text-[#AAAAAA] hover:text-white underline underline-offset-4 ml-1 cursor-pointer transition-colors"
            >
              Clear Selection
            </button>
            {selectedIds.length < products.length && (
              <button
                type="button"
                onClick={() => setSelectedIds(products.map((p) => p._id))}
                className="text-[11px] uppercase tracking-wider text-[#AAAAAA] hover:text-white underline underline-offset-4 cursor-pointer transition-colors hidden md:inline"
              >
                Select All ({products.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Bulk Category Setter */}
            <div className="hidden sm:flex items-center gap-1.5 border-r border-[#333333] pr-3 mr-1">
              <Select
                onValueChange={(catName) => {
                  if (catName) {
                    handleBulkUpdate("set_category", catName, `set category to ${catName}`);
                  }
                }}
              >
                <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-wider bg-[#222222] hover:bg-[#333333] border-[#444444] text-white rounded-none w-36">
                  <SelectValue placeholder="Set Category" />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-[#111111] text-white border-[#333333]">
                  {categories.map((c) => (
                    <SelectItem
                      key={c.slug || c._id}
                      value={c.name}
                      className="text-xs hover:bg-[#222222] cursor-pointer"
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Bulk Attribute Toggles */}
            <div className="hidden lg:flex items-center gap-1.5 border-r border-[#333333] pr-3 mr-1">
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleBulkUpdate("set_stock", 25, "mark in stock")}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Set stock to 25"
              >
                In Stock (25)
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleBulkUpdate("set_stock", 0, "mark out of stock")}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Set stock to 0"
              >
                Out of Stock
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleBulkUpdate("toggle_featured", true, "mark featured")}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                + Featured
              </button>
              <button
                type="button"
                disabled={bulkLoading}
                onClick={() => handleBulkUpdate("toggle_featured", false, "remove featured")}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                - Featured
              </button>
            </div>

            {/* Bulk Delete Button */}
            <button
              type="button"
              disabled={bulkLoading}
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {bulkLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>DELETE SELECTED ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-nivora-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-nivora-soft border-b border-nivora-border text-[#888888] uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-5 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeFilteredSelected;
                    }}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded-none accent-[#111111] cursor-pointer"
                    title={isAllFilteredSelected ? "Deselect all" : "Select all"}
                  />
                </th>
                <th className="p-4 font-bold">IMAGE</th>
                <th className="p-4 font-bold">NAME</th>
                <th className="p-4 font-bold">CATEGORY</th>
                <th className="p-4 font-bold">PRICE</th>
                <th className="p-4 font-bold">STOCK</th>
                <th className="p-4 font-bold">BADGES</th>
                <th className="p-4 pr-6 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nivora-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-[#888888] uppercase tracking-wider">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p._id);
                  return (
                    <tr
                      key={p._id}
                      onClick={() => handleToggleSelect(p._id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#FAF7ED] border-l-2 border-[#111111]"
                          : "hover:bg-[#FAF9F7]"
                      }`}
                    >
                      <td
                        className="p-4 pl-5 w-12 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p._id)}
                          className="w-4 h-4 rounded-none accent-[#111111] cursor-pointer"
                        />
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-12 w-10 bg-nivora-soft border border-nivora-border overflow-hidden">
                          <Image
                            src={p.images?.[0] || "/images/placeholder.jpg"}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-bold uppercase tracking-wider text-[#111111] max-w-55">
                        <div className="truncate">{p.name}</div>
                        <span className="text-[10px] text-[#888888] font-mono font-normal">
                          /{p.slug}
                        </span>
                      </td>
                      <td className="p-4 text-nivora-muted uppercase">{p.category}</td>
                      <td className="p-4 font-bold text-[#111111]">
                        {formatPrice(p.price)}
                        {p.oldPrice && (
                          <span className="block text-[10px] text-[#888888] line-through font-normal">
                            {formatPrice(p.oldPrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                            p.stock > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {p.featured && (
                            <span className="px-1.5 py-0.5 bg-[#111111] text-white text-[9px] font-bold uppercase">
                              Featured
                            </span>
                          )}
                          {p.newArrival && (
                            <span className="px-1.5 py-0.5 bg-nivora-lime text-[#111111] text-[9px] font-bold uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="p-4 pr-6 text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 border border-nivora-border hover:border-[#111111] text-[#111111] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === p._id || bulkLoading}
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === p._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Action Bar for Easy Access while scrolling */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-5 py-3 shadow-2xl border border-[#333333] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nivora-lime animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              {selectedIds.length} SELECTED
            </span>
          </div>

          <div className="h-4 w-px bg-[#333333]" />

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-[11px] text-[#AAAAAA] hover:text-white uppercase tracking-wider cursor-pointer transition-colors"
          >
            Clear
          </button>

          <button
            type="button"
            disabled={bulkLoading}
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {bulkLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Delete Selected</span>
          </button>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogHeader className="pb-4 border-b border-nivora-border">
            <DialogTitle>
              {editingProduct ? "EDIT PRODUCT" : "CREATE NEW PRODUCT"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prodName">Product Name *</Label>
                <Input
                  id="prodName"
                  required
                  placeholder="e.g. Heavyweight Fleece Hoodie"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodSlug">URL Slug (Auto-generated if empty)</Label>
                <Input
                  id="prodSlug"
                  placeholder="e.g. heavyweight-fleece-hoodie"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prodDesc">Description</Label>
              <textarea
                id="prodDesc"
                rows={3}
                placeholder="Product description, GSM weight, cut and fit..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex w-full bg-white px-3.5 py-2 text-sm text-[#111111] border border-nivora-border focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prodPrice">Price (৳) *</Label>
                <Input
                  id="prodPrice"
                  type="number"
                  required
                  placeholder="1490"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodOldPrice">Old Price (৳)</Label>
                <Input
                  id="prodOldPrice"
                  type="number"
                  placeholder="1890"
                  value={form.oldPrice}
                  onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodStock">Stock Quantity *</Label>
                <Input
                  id="prodStock"
                  type="number"
                  required
                  placeholder="25"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prodCategory">Category *</Label>
                  <button
                    type="button"
                    onClick={() => setNewCatModalOpen(true)}
                    className="text-[10px] text-[#111111] hover:text-[#888888] font-bold uppercase underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Category</span>
                  </button>
                </div>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger id="prodCategory" className="rounded-none">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug || cat._id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodMaterial">Material</Label>
                <Input
                  id="prodMaterial"
                  placeholder="100% Heavy Combed Cotton"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <ProductImageManager
                images={Array.isArray(form.images) ? form.images : (form.images ? [form.images] : [])}
                onChange={(newImages) => setForm({ ...form, images: newImages })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prodColors">Available Colors (Comma-separated)</Label>
                <Input
                  id="prodColors"
                  placeholder="Black, Cream, Brown"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodSizes">Available Sizes (Comma-separated)</Label>
                <Input
                  id="prodSizes"
                  placeholder="M, L, XL"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                />
              </div>
            </div>

            {/* Checkboxes for featured & new arrival */}
            <div className="pt-2 flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                <Checkbox
                  checked={form.featured}
                  onCheckedChange={(checked) => setForm({ ...form, featured: !!checked })}
                />
                <span>FEATURED PRODUCT</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold uppercase cursor-pointer">
                <Checkbox
                  checked={form.newArrival}
                  onCheckedChange={(checked) => setForm({ ...form, newArrival: !!checked })}
                />
                <span>NEW ARRIVAL</span>
              </label>
            </div>

            <div className="pt-4 border-t border-nivora-border flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="lime"
                disabled={submitting}
                className="font-bold"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>SAVING...</span>
                  </div>
                ) : (
                  <span>{editingProduct ? "UPDATE PRODUCT" : "CREATE PRODUCT"}</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Add Category Modal */}
      <Dialog open={newCatModalOpen} onOpenChange={setNewCatModalOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-none z-60">
          <DialogHeader className="pb-3 border-b border-nivora-border">
            <DialogTitle className="font-editorial text-lg font-black uppercase tracking-tight">
              QUICK ADD CATEGORY
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategoryQuick} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="quickCatName" className="text-xs">
                Category Name *
              </Label>
              <Input
                id="quickCatName"
                placeholder="e.g. Cardigans, Parkas, Vests..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="rounded-none text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="quickCatImage" className="text-xs">
                  Cover Image (Optional)
                </Label>
                <input
                  ref={quickCatFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleQuickCatFileUpload(file);
                  }}
                />
                <button
                  type="button"
                  disabled={uploadingQuickCatImg}
                  onClick={() => quickCatFileRef.current?.click()}
                  className="text-[10px] text-[#111111] font-bold uppercase underline underline-offset-2 flex items-center gap-1 cursor-pointer disabled:opacity-50 hover:text-[#888888] transition-colors"
                >
                  <UploadCloud className="h-3 w-3" />
                  <span>{uploadingQuickCatImg ? "Uploading..." : "From Device"}</span>
                </button>
              </div>

              {newCatImage ? (
                <div className="relative h-20 w-full bg-[#111111] border border-nivora-border overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newCatImage}
                    alt="Quick category preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                    <span className="text-[9px] font-bold text-nivora-lime uppercase tracking-wider">
                      Cover Set
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => quickCatFileRef.current?.click()}
                        className="px-2 py-0.5 bg-white text-[#111111] text-[9px] font-bold uppercase hover:bg-nivora-soft"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCatImage("")}
                        className="p-1 bg-red-600 text-white hover:bg-red-700"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingQuickCatImg && quickCatFileRef.current?.click()}
                  className="border border-dashed border-[#CCCCCC] bg-[#FAF9F7] hover:border-[#111111] p-3 text-center cursor-pointer transition-colors"
                >
                  {uploadingQuickCatImg ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#111111]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-nivora-muted">
                      <UploadCloud className="h-3.5 w-3.5 text-[#111111]" />
                      <span className="font-bold text-[#111111]">Choose from device</span>
                      <span className="text-[10px] text-[#888888] font-mono">• Cloudinary</span>
                    </div>
                  )}
                </div>
              )}

              <Input
                id="quickCatImage"
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={newCatImage}
                onChange={(e) => setNewCatImage(e.target.value)}
                className="rounded-none text-xs h-7 text-[11px] bg-[#FAFAFA]"
              />
            </div>
            <div className="pt-3 border-t border-nivora-border flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewCatModalOpen(false)}
                className="rounded-none text-[11px] font-bold"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                variant="lime"
                size="sm"
                disabled={creatingCat || uploadingQuickCatImg}
                className="rounded-none text-[11px] font-bold cursor-pointer"
              >
                {creatingCat ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : uploadingQuickCatImg ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>UPLOADING...</span>
                  </div>
                ) : (
                  "CREATE & SELECT"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
