"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Plus,
  Loader2,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { confirmDelete, showSuccess } from "@/lib/swal";

export default function ProductImageManager({
  images = [],
  onChange = () => {},
  maxImages = 12,
}) {
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Drag-and-drop reordering state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Upload handler for File objects
  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (fileList.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WebP, etc.)");
      return;
    }

    if (images.length + fileList.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed per product.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileList.length });

    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload images");
      }

      const newUrls = data.urls || (data.url ? [data.url] : []);
      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
        toast.success(
          `Uploaded ${newUrls.length} image${newUrls.length > 1 ? "s" : ""} successfully`
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Dropzone drag events
  const handleDropzoneDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverDropzone(true);
  };

  const handleDropzoneDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverDropzone(false);
  };

  const handleDropzoneDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverDropzone(false);

    if (e.dataTransfer && e.dataTransfer.files) {
      await handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Add via direct URL
  const handleAddUrl = (e) => {
    e?.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      toast.error("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput("");
    toast.success("Image URL added to gallery");
  };

  // Remove single image with Swal confirmation
  const handleRemoveImage = async (indexToRemove) => {
    const isCover = indexToRemove === 0;
    const confirmed = await confirmDelete(
      isCover ? "Cover Image (#1)" : `Image #${indexToRemove + 1}`,
      "This image will be removed from the product gallery."
    );
    if (!confirmed) return;

    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    showSuccess("IMAGE REMOVED", "Image has been removed from gallery.", 1500);
  };

  // Reordering: Set as Primary Cover (Index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    const updated = [target, ...rest];
    onChange(updated);
    toast.success("Set as primary cover image (#1)");
  };

  // Reordering: Move Left
  const handleMoveLeft = (index) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Reordering: Move Right
  const handleMoveRight = (index) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Drag-and-drop reordering between cards
  const handleCardDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set transparent image or drag data
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleCardDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleCardDragLeave = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleCardDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onChange(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success(
      targetIndex === 0
        ? "Image moved to Cover position (#1)"
        : `Reordered to position #${targetIndex + 1}`
    );
  };

  const handleCardDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#111111]" />
            Product Images ({images.length})
          </span>
          <p className="text-[11px] text-[#666666]">
            Drag & drop files or cards to reorder. First image is the storefront cover.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#111111] font-bold uppercase underline underline-offset-4 hover:text-[#888888] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Hide URL Input" : "Add by URL"}
        </button>
      </div>

      {/* URL Input Bar (Collapsible) */}
      {showUrlInput && (
        <div className="p-3 bg-[#F5F5F3] border border-[#E2E2E2] flex items-center gap-2 animate-in fade-in duration-200">
          <Input
            type="url"
            placeholder="https://images.unsplash.com/... or CDN link"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="bg-white text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleAddUrl}
            className="shrink-0 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add URL
          </Button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDropzoneDragOver}
        onDragEnter={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDraggingOverDropzone
            ? "border-[#111111] bg-[#B6E600]/10 scale-[1.008] ring-2 ring-[#B6E600]"
            : "border-[#CCCCCC] bg-[#FAF9F7] hover:border-[#111111] hover:bg-[#F5F5F3]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUploadFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Uploading image{uploadProgress.total > 1 ? "s" : ""}...
            </span>
            <span className="text-[10px] text-[#666666]">
              Optimizing and storing securely
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDraggingOverDropzone
                  ? "bg-[#B6E600] text-[#111111]"
                  : "bg-white border border-[#E2E2E2] text-[#111111]"
              }`}
            >
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Drag & Drop product images here, or{" "}
                <span className="text-[#111111] underline underline-offset-4 decoration-[#B6E600] decoration-2">
                  Browse Files
                </span>
              </span>
              <p className="text-[10px] text-[#888888] mt-1 font-mono">
                Supports JPG, PNG, WEBP, AVIF • Direct upload to Cloudinary
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery & Reordering Grid */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#666666]">
            <span>
              <strong className="text-[#111111] font-bold">Image Sequence</strong> (
              {images.length} item{images.length > 1 ? "s" : ""})
            </span>
            <span className="text-[10px] text-[#888888]">
              Drag cards or use ⬅ ➡ buttons to reorder
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const isCover = index === 0;
              const isDragged = draggedIndex === index;
              const isTarget = dragOverIndex === index;

              return (
                <div
                  key={`${imgUrl}-${index}`}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, index)}
                  onDragOver={(e) => handleCardDragOver(e, index)}
                  onDragLeave={(e) => handleCardDragLeave(e, index)}
                  onDrop={(e) => handleCardDrop(e, index)}
                  onDragEnd={handleCardDragEnd}
                  className={`group relative bg-white border transition-all duration-150 select-none overflow-hidden ${
                    isCover
                      ? "border-[#111111] ring-2 ring-[#B6E600]"
                      : "border-[#E2E2E2] hover:border-[#111111]"
                  } ${isDragged ? "opacity-30 scale-95" : "opacity-100"} ${
                    isTarget
                      ? "ring-2 ring-[#111111] scale-[1.03] border-l-4 border-l-[#B6E600]"
                      : ""
                  }`}
                >
                  {/* Aspect ratio container */}
                  <div className="relative aspect-[3/4] w-full bg-[#F5F5F3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Drag Handle Indicator */}
                    <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 bg-black/60 text-white rounded backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    {/* Order Badge */}
                    <div className="absolute top-2 right-2">
                      {isCover ? (
                        <span className="inline-flex items-center gap-1 bg-[#B6E600] text-[#111111] font-black text-[9px] uppercase px-1.5 py-0.5 tracking-wider shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          COVER (#1)
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center bg-black/70 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute bottom-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded shadow transition-transform hover:scale-110"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering Action Buttons Bar */}
                  <div className="p-1.5 bg-[#FAF9F7] border-t border-[#E2E2E2] flex items-center justify-between gap-1 text-[10px]">
                    <div className="flex items-center gap-1">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className={`p-1 border border-[#E2E2E2] rounded transition-colors ${
                          index === 0
                            ? "opacity-30 cursor-not-allowed bg-transparent text-[#999999]"
                            : "hover:bg-white hover:border-[#111111] text-[#111111]"
                        }`}
                        title="Move Left (Earlier)"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className={`p-1 border border-[#E2E2E2] rounded transition-colors ${
                          index === images.length - 1
                            ? "opacity-30 cursor-not-allowed bg-transparent text-[#999999]"
                            : "hover:bg-white hover:border-[#111111] text-[#111111]"
                        }`}
                        title="Move Right (Later)"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Make Cover Button */}
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(index)}
                        className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#111111] hover:bg-[#B6E600] border border-[#CCCCCC] hover:border-[#111111] transition-all flex items-center gap-1"
                        title="Set as main cover photo"
                      >
                        <Star className="w-2.5 h-2.5" />
                        <span>Cover</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 border border-dashed border-[#E2E2E2] bg-[#FAF9F7] text-center text-xs text-[#888888]">
          No images uploaded yet. Drop files above or enter image URLs.
        </div>
      )}
    </div>
  );
}
