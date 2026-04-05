import { NextResponse } from "next/server";
import { sampleCars } from "@/data/sampleCars";
import connectToDatabase from "@/lib/mongodb";
import { requireDealerAuth } from "@/lib/dealerMiddleware";
import Car from "@/models/Car";

function serializeCars(cars) {
  return cars.map((car) => ({
    ...car,
    _id: car._id?.toString ? car._id.toString() : car._id,
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
  }));
}

function formatCarResponse(car) {
  return {
    ...car.toObject(),
    _id: car._id.toString(),
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
    createdAt: car.createdAt?.toISOString(),
  };
}

function escapeRegexValue(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCarFilters(searchParams) {
  const brand = searchParams.get("brand")?.trim() || "";
  const priceValue = searchParams.get("price")?.trim() || "";
  const price = priceValue ? Number(priceValue) : null;
  const mine = searchParams.get("mine") === "true";

  if (priceValue && (Number.isNaN(price) || price < 0)) {
    return {
      error: "price must be a valid positive number.",
    };
  }

  return {
    filters: {
      brand,
      price,
      mine,
    },
  };
}

function filterSampleCars(cars, filters) {
  return cars.filter((car) => {
    const carBrand = car.brand || car.make || "";
    const matchesBrand = filters.brand
      ? carBrand.toLowerCase() === filters.brand.toLowerCase()
      : true;
    const matchesPrice = filters.price !== null ? Number(car.price) <= filters.price : true;

    return matchesBrand && matchesPrice;
  });
}

function buildDatabaseFilters(filters) {
  const databaseFilters = {};

  // Brand filter is optional and uses a case-insensitive match.
  if (filters.brand) {
    databaseFilters.brand = new RegExp(`^${escapeRegexValue(filters.brand)}$`, "i");
  }

  // Price filter is optional and works as "maximum price".
  if (filters.price !== null) {
    databaseFilters.price = { $lte: filters.price };
  }

  return databaseFilters;
}

function validateCarInput(body) {
  const title = body.title?.trim();
  const brand = body.brand?.trim();
  const fuelType = body.fuelType?.trim();
  const price = Number(body.price);
  const year = Number(body.year);
  const kilometersDriven = Number(body.kilometersDriven);
  const images = Array.isArray(body.images)
    ? body.images.filter((image) => typeof image === "string" && image.trim())
    : [];

  if (!title || !brand || !fuelType) {
    return {
      error: "title, brand, and fuelType are required.",
    };
  }

  // Price, year, and kilometersDriven should be valid numbers before saving.
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
      price,
      year,
      kilometersDriven,
      images,
    },
  };
}

export async function GET(request) {
  const filterResult = getCarFilters(request.nextUrl.searchParams);

  if (filterResult.error) {
    return NextResponse.json(
      {
        success: false,
        message: filterResult.error,
      },
      { status: 400 }
    );
  }

  const { filters } = filterResult;

  if (filters.mine) {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          success: false,
          message: "Add MONGODB_URI before loading dealer cars.",
        },
        { status: 400 }
      );
    }

    try {
      const { dealer, error } = await requireDealerAuth(request);

      if (error) {
        return error;
      }

      await connectToDatabase();

      const databaseFilters = {
        ...buildDatabaseFilters(filters),
        dealerId: dealer._id,
      };

      const cars = await Car.find(databaseFilters).sort({ createdAt: -1 }).lean();

      return NextResponse.json({
        success: true,
        source: "database",
        cars: serializeCars(cars),
      });
    } catch (error) {
      console.error("GET /api/cars?mine=true error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong while loading your cars.",
        },
        { status: 500 }
      );
    }
  }

  // Return sample data first so the UI still works before MongoDB is configured.
  if (!process.env.MONGODB_URI) {
    const filteredSampleCars = filterSampleCars(sampleCars, filters);

    return NextResponse.json({
      success: true,
      source: "sample",
      message: "Add MONGODB_URI to start loading cars from MongoDB.",
      cars: filteredSampleCars,
    });
  }

  try {
    await connectToDatabase();
    const databaseFilters = buildDatabaseFilters(filters);
    const cars = await Car.find(databaseFilters).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      source: "database",
      cars: serializeCars(cars),
    });
  } catch (error) {
    console.error("GET /api/cars error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading cars.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        success: false,
        message: "Add MONGODB_URI before creating cars in MongoDB.",
      },
      { status: 400 }
    );
  }

  try {
    const { dealer, error } = await requireDealerAuth(request);

    if (error) {
      return error;
    }

    const body = await request.json();
    const validationResult = validateCarInput(body);

    if (validationResult.error) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error,
        },
        { status: 400 }
      );
    }

    // Use the dealer from the verified JWT instead of trusting dealerId from the client.
    const createdCar = await Car.create({
      ...validationResult.data,
      dealerId: dealer._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Car added successfully.",
        car: formatCarResponse(createdCar),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cars error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the car.",
      },
      { status: 500 }
    );
  }
}
