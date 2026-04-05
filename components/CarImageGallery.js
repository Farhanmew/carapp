"use client";

import { useState } from "react";
import Card from "@/components/Card";

export default function CarImageGallery({ images, title }) {
  // Keep track of the image the user is currently viewing.
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryImages = images.length ? images : [];
  const activeImage = galleryImages[activeImageIndex];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card padding="none" className="overflow-hidden">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={activeImage}
            alt={`${title} image ${activeImageIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {galleryImages.map((image, index) => {
          const isActive = index === activeImageIndex;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`overflow-hidden rounded-2xl border transition ${
                isActive
                  ? "border-[var(--color-brand)] ring-2 ring-orange-100"
                  : "border-[var(--color-line)] hover:border-[var(--color-line-strong)]"
              }`}
            >
              <div className="aspect-square bg-slate-100">
                <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

