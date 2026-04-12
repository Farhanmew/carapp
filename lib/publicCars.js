import connectToDatabase from "@/lib/mongodb";
import { escapeRegexValue } from "@/lib/carUtils";
import { sampleCars } from "@/data/sampleCars";
import Car from "@/models/Car";
import Dealer from "@/models/Dealer";

const FALLBACK_CAR_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#dbeafe" offset="0%"/>
        <stop stop-color="#e2e8f0" offset="100%"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    <g fill="#1e293b" opacity="0.9">
      <path d="M327 392c19-57 64-100 123-115l84-22c25-7 51-10 77-10h107c24 0 47 3 69 10l85 27c42 13 77 45 95 86l23 52c6 13-4 28-18 28h-42c-12 0-22-10-22-22v-16H368v16c0 12-10 22-22 22h-39c-15 0-25-15-20-29l40-127Z"/>
      <circle cx="428" cy="470" r="53"/>
      <circle cx="828" cy="470" r="53"/>
    </g>
    <text x="50%" y="86%" text-anchor="middle" fill="#1e293b" font-family="Arial, sans-serif" font-size="44" font-weight="700">
      valuedrive
    </text>
  </svg>
`)}`;

function formatKilometers(kilometersDriven) {
  if (!Number.isFinite(kilometersDriven)) {
    return "Mileage not added";
  }

  return `${new Intl.NumberFormat("en-US").format(kilometersDriven)} km`;
}

function getNormalizedPublicFilters(filters = {}) {
  const priceValue = `${filters.price ?? ""}`.trim();
  const parsedPrice = priceValue ? Number(priceValue) : null;

  return {
    search: `${filters.search ?? ""}`.trim(),
    brand: `${filters.brand ?? ""}`.trim(),
    fuelType: `${filters.fuelType ?? ""}`.trim(),
    price: Number.isNaN(parsedPrice) ? null : parsedPrice,
  };
}

function matchesPublicFilters(car, filters) {
  const searchableText = [
    car.title,
    car.brand,
    car.bodyType,
    car.description,
    car.location,
    car.dealerName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesSearch = filters.search ? searchableText.includes(filters.search.toLowerCase()) : true;
  const matchesBrand = filters.brand ? car.brand.toLowerCase().includes(filters.brand.toLowerCase()) : true;
  const matchesFuelType = filters.fuelType ? car.fuelType.toLowerCase() === filters.fuelType.toLowerCase() : true;
  const matchesPrice = filters.price !== null ? Number(car.price) <= filters.price : true;

  return matchesSearch && matchesBrand && matchesFuelType && matchesPrice;
}

function normalizeSampleCar(car) {
  const imageList = Array.isArray(car.images) && car.images.length > 0 ? car.images : car.coverImage ? [car.coverImage] : [];
  const location = car.location || "Location not added";

  return {
    _id: car._id?.toString ? car._id.toString() : String(car._id),
    slug: car.slug || "",
    title: car.title,
    brand: car.brand || car.make || "Brand not added",
    model: car.model || "",
    price: car.price,
    fuelType: car.fuelType || "Fuel type not added",
    year: car.year || "Year not added",
    kilometersDriven: car.kilometersDriven || null,
    mileage: car.mileage || formatKilometers(car.kilometersDriven),
    transmission: car.transmission || "Automatic",
    bodyType: car.bodyType || "Premium listing",
    location,
    description: car.description || "Vehicle description not added.",
    images: imageList,
    coverImage: imageList[0] || FALLBACK_CAR_IMAGE,
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId || "",
    dealerName: car.dealerName || "Dealer not added",
    dealerEmail: car.dealerEmail || "sales@valuedrive.com",
    dealerPhone: car.dealerPhone || "+1 (555) 010-2020",
    createdAt: car.createdAt || null,
    featured: Boolean(car.featured),
  };
}

function normalizeDatabaseCar(car, dealer) {
  const imageList = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const location = car.location || "Location not added";

  return {
    _id: car._id?.toString ? car._id.toString() : String(car._id),
    slug: car.slug || "",
    title: car.title,
    brand: car.brand || "Brand not added",
    model: "",
    price: car.price,
    fuelType: car.fuelType || "Fuel type not added",
    year: car.year || "Year not added",
    kilometersDriven: car.kilometersDriven || null,
    mileage: formatKilometers(car.kilometersDriven),
    transmission: car.transmission || "Automatic",
    bodyType: car.bodyType || "Verified listing",
    location,
    description: car.description || `${car.title} is now available in the marketplace inventory.`,
    images: imageList,
    coverImage: imageList[0] || FALLBACK_CAR_IMAGE,
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
    dealerName: dealer?.name || "Dealer not found",
    dealerEmail: dealer?.email || "",
    dealerPhone: dealer?.phone || "",
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
    featured: false,
  };
}

function buildDatabaseFilters(filters) {
  const databaseFilters = {};

  if (filters.search) {
    const searchPattern = new RegExp(escapeRegexValue(filters.search), "i");

    databaseFilters.$or = [
      { title: searchPattern },
      { brand: searchPattern },
      { bodyType: searchPattern },
      { description: searchPattern },
      { location: searchPattern },
    ];
  }

  if (filters.brand) {
    databaseFilters.brand = new RegExp(escapeRegexValue(filters.brand), "i");
  }

  if (filters.fuelType) {
    databaseFilters.fuelType = new RegExp(`^${escapeRegexValue(filters.fuelType)}$`, "i");
  }

  if (filters.price !== null) {
    databaseFilters.price = { $lte: filters.price };
  }

  return databaseFilters;
}

function getSampleCars(filters) {
  return sampleCars.map(normalizeSampleCar).filter((car) => matchesPublicFilters(car, filters));
}

async function getDatabaseCars(filters) {
  await connectToDatabase();

  const cars = await Car.find(buildDatabaseFilters(filters)).sort({ createdAt: -1 }).lean();
  const dealerIds = [...new Set(cars.map((car) => car.dealerId?.toString()).filter(Boolean))];
  const dealers = dealerIds.length
    ? await Dealer.find({ _id: { $in: dealerIds } }).select("name email phone").lean()
    : [];
  const dealerMap = new Map(dealers.map((dealer) => [dealer._id.toString(), dealer]));

  return cars.map((car) => normalizeDatabaseCar(car, dealerMap.get(car.dealerId?.toString())));
}

export async function loadPublicCars(filters = {}) {
  const normalizedFilters = getNormalizedPublicFilters(filters);

  if (!process.env.MONGODB_URI) {
    return {
      source: "sample",
      cars: getSampleCars(normalizedFilters),
    };
  }

  try {
    return {
      source: "database",
      cars: await getDatabaseCars(normalizedFilters),
    };
  } catch (error) {
    console.error("Public cars loader error:", error);

    return {
      source: "database",
      cars: [],
    };
  }
}

export async function getPublicCars(filters = {}) {
  const result = await loadPublicCars(filters);
  return result.cars;
}

export async function getPublicCarByIdentifier(identifier) {
  const cars = await getPublicCars();
  return cars.find((car) => car.slug === identifier || car._id === identifier) || null;
}

export async function getRelatedPublicCars(carId, limit = 3) {
  const cars = await getPublicCars();
  return cars.filter((car) => car._id !== carId).slice(0, limit);
}
