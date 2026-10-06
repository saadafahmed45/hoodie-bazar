"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Loader2, Sparkles, AlertCircle } from "lucide-react";
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
import { confirmDelete, showSuccess, showError } from "@/lib/swal";

export default function AdminProductsClient({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
      showSuccess("PRODUCT DELETED", `"${name}" was deleted successfully.`);
    } catch (err) {
      showError("DELETE FAILED", err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E2E2]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            PRODUCTS ({products.length})
          </h1>
        </div>

        <Button
          variant="lime"
          size="default"
          onClick={handleOpenAdd}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>ADD PRODUCT</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E2E2E2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F5F3] border-b border-[#E2E2E2] text-[#888888] uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6 font-bold">IMAGE</th>
                <th className="p-4 font-bold">NAME</th>
                <th className="p-4 font-bold">CATEGORY</th>
                <th className="p-4 font-bold">PRICE</th>
                <th className="p-4 font-bold">STOCK</th>
                <th className="p-4 font-bold">BADGES</th>
                <th className="p-4 pr-6 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2E2]">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="relative h-12 w-10 bg-[#F5F5F3] border border-[#E2E2E2] overflow-hidden">
                      <Image
                        src={p.images?.[0] || "/images/placeholder.jpg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-bold uppercase tracking-wider text-[#111111] max-w-[220px]">
                    <div className="truncate">{p.name}</div>
                    <span className="text-[10px] text-[#888888] font-mono font-normal">
                      /{p.slug}
                    </span>
                  </td>
                  <td className="p-4 text-[#666666] uppercase">{p.category}</td>
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
                        <span className="px-1.5 py-0.5 bg-[#B6E600] text-[#111111] text-[9px] font-bold uppercase">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 border border-[#E2E2E2] hover:border-[#111111] text-[#111111] transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === p._id}
                      onClick={() => handleDelete(p._id, p.name)}
                      className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogHeader className="pb-4 border-b border-[#E2E2E2]">
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
                className="flex w-full bg-white px-3.5 py-2 text-sm text-[#111111] border border-[#E2E2E2] focus:outline-none focus:border-[#111111]"
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
                <Label htmlFor="prodCategory">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger id="prodCategory">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.name}>
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

            <div className="pt-4 border-t border-[#E2E2E2] flex justify-end gap-3">
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
    </div>
  );
}
