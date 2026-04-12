"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import Card from "@/components/Card";
import { getWishlistIds } from "@/lib/wishlist";

export default function WishlistContent() {
  const [inventory, setInventory] = useState([]);
  const [savedCars, setSavedCars] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInventory() {
      setInventoryLoading(true);

      try {
        const response = await fetch("/api/cars", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load the marketplace inventory.");
        }

        if (isMounted) {
          setInventory(result.cars || []);
        }
      } catch (error) {
        console.error("Wishlist inventory error:", error);

        if (isMounted) {
          setInventory([]);
        }
      } finally {
        if (isMounted) {
          setInventoryLoading(false);
        }
      }
    }

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Rebuild the saved list from localStorage whenever the page loads or the user updates the wishlist.
    const loadSavedCars = () => {
      const wishlistIds = new Set(getWishlistIds());
      const matchingCars = inventory.filter((car) => wishlistIds.has(String(car._id)));
      setSavedCars(matchingCars);
    };

    loadSavedCars();
    window.addEventListener("wishlist-updated", loadSavedCars);
    window.addEventListener("storage", loadSavedCars);

    return () => {
      window.removeEventListener("wishlist-updated", loadSavedCars);
      window.removeEventListener("storage", loadSavedCars);
    };
  }, [inventory]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Card tone="soft" padding="lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Wishlist</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Cars saved on this device</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-soft)]">
          The starter wishlist uses <code className="rounded bg-slate-100 px-2 py-1 text-xs">localStorage</code>, so
          it works without a backend and stays easy to understand.
        </p>
      </Card>

      {inventoryLoading ? (
        <Card className="mt-8 text-center" padding="lg">
          <h2 className="text-xl font-bold text-slate-900">Loading saved cars...</h2>
        </Card>
      ) : savedCars.length === 0 ? (
        <Card className="mt-8 border-dashed text-center" padding="lg">
          <h2 className="text-xl font-bold text-slate-900">No saved cars yet</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
            Open the marketplace, click the save button on any listing, and it will appear here.
          </p>
        </Card>
      ) : (
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {savedCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </section>
      )}
    </div>
  );
}
