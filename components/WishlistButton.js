"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isCarInWishlist, toggleWishlistId } from "@/lib/wishlist";

export default function WishlistButton({ carId }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Keep the button in sync when the wishlist changes anywhere in the app.
    const syncSavedState = () => {
      setSaved(isCarInWishlist(carId));
    };

    syncSavedState();
    window.addEventListener("wishlist-updated", syncSavedState);

    return () => {
      window.removeEventListener("wishlist-updated", syncSavedState);
    };
  }, [carId]);

  const handleToggle = () => {
    const updatedIds = toggleWishlistId(carId);
    setSaved(updatedIds.includes(String(carId)));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 backdrop-blur-xl transition-all duration-300 ${
        saved
          ? "bg-[var(--color-brand)] text-white shadow-lg shadow-blue-500/25"
          : "bg-white/55 text-slate-900 shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-white/75"
      }`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} strokeWidth={2} />
    </button>
  );
}
