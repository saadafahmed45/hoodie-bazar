"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], name = "Product" }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || "/images/placeholder.jpg");

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (desktop left vertical / mobile bottom horizontal) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto shrink-0 pb-2 lg:pb-0">
        {images.map((img, index) => {
          const isSelected = selectedImage === img;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden bg-[#F5F5F3] border transition-all ${
                isSelected
                  ? "border-[#111111] ring-1 ring-[#111111]"
                  : "border-[#E2E2E2] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          );
        })}
      </div>

      {/* Main Feature Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-[#E2E2E2]">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          className="object-cover transition-all duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
