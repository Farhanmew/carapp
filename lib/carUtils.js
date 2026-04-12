import mongoose from "mongoose";
import Car from "@/models/Car";

export const MAX_CAR_IMAGES = 8;

export function escapeRegexValue(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugifyCarTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "car";
}

export async function createUniqueCarSlug(title, excludeCarId = "") {
  const baseSlug = slugifyCarTitle(title);
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingCar = await Car.findOne({
      slug: candidateSlug,
      ...(excludeCarId && mongoose.Types.ObjectId.isValid(excludeCarId) ? { _id: { $ne: excludeCarId } } : {}),
    })
      .select("_id")
      .lean();

    if (!existingCar) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export function validateCarInput(body) {
  const title = body.title?.trim();
  const brand = body.brand?.trim();
  const fuelType = body.fuelType?.trim();
  const location = body.location?.trim() || "";
  const bodyType = body.bodyType?.trim() || "";
  const transmission = body.transmission?.trim() || "";
  const description = body.description?.trim() || "";
  const price = Number(body.price);
  const year = Number(body.year);
  const kilometersDriven = Number(body.kilometersDriven);
  const images = Array.isArray(body.images)
    ? body.images
        .map((image) => (typeof image === "string" ? image.trim() : ""))
        .filter(Boolean)
        .slice(0, MAX_CAR_IMAGES)
    : [];
  const imagePublicIds = Array.isArray(body.imagePublicIds)
    ? body.imagePublicIds
        .map((publicId) => (typeof publicId === "string" ? publicId.trim() : ""))
        .slice(0, MAX_CAR_IMAGES)
    : [];
  const imageAssets = images.map((image, index) => ({
    image,
    publicId: imagePublicIds[index] || "",
  }));

  if (!title || !brand || !fuelType) {
    return {
      error: "title, brand, and fuelType are required.",
    };
  }

  if (
    Number.isNaN(price) ||
    price < 0 ||
    Number.isNaN(year) ||
    year < 1900 ||
    Number.isNaN(kilometersDriven) ||
    kilometersDriven < 0
  ) {
    return {
      error: "price, year, and kilometersDriven must be valid numbers.",
    };
  }

  return {
    data: {
      title,
      brand,
      fuelType,
      location,
      bodyType,
      transmission,
      description,
      price,
      year,
      kilometersDriven,
      images: imageAssets.map((asset) => asset.image),
      imagePublicIds: imageAssets.map((asset) => asset.publicId),
    },
  };
}

export async function buildValidatedCarData(body, excludeCarId = "") {
  const validationResult = validateCarInput(body);

  if (validationResult.error) {
    return validationResult;
  }

  const slug = await createUniqueCarSlug(validationResult.data.title, excludeCarId);

  return {
    data: {
      ...validationResult.data,
      slug,
    },
  };
}
