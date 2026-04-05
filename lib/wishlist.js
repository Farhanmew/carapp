const STORAGE_KEY = "valuedrive-wishlist";

function normalizeWishlistIds(ids) {
  // Keep ids as strings and remove duplicates before saving.
  return [...new Set(ids.map((id) => String(id)))];
}

export function getWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedIds = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedIds) ? normalizeWishlistIds(parsedIds) : [];
  } catch (error) {
    console.error("Could not read wishlist from localStorage:", error);
    return [];
  }
}

export function saveWishlistIds(ids) {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedIds = normalizeWishlistIds(ids);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedIds));
  window.dispatchEvent(new Event("wishlist-updated"));

  return normalizedIds;
}

export function isCarInWishlist(carId) {
  const savedIds = getWishlistIds();
  return savedIds.includes(String(carId));
}

export function toggleWishlistId(carId) {
  const currentIds = getWishlistIds();
  const normalizedCarId = String(carId);
  const alreadySaved = currentIds.includes(normalizedCarId);

  if (alreadySaved) {
    return saveWishlistIds(currentIds.filter((id) => id !== normalizedCarId));
  }

  return saveWishlistIds([...currentIds, normalizedCarId]);
}
