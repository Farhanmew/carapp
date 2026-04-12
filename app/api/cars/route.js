import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { buildValidatedCarData, escapeRegexValue } from "@/lib/carUtils";
import { requireDealerAuth } from "@/lib/dealerMiddleware";
import { loadPublicCars } from "@/lib/publicCars";
import Car from "@/models/Car";

export const dynamic = "force-dynamic";

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
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
  };
}

function getCarFilters(searchParams) {
  const search = searchParams.get("search")?.trim() || "";
  const brand = searchParams.get("brand")?.trim() || "";
  const fuelType = searchParams.get("fuelType")?.trim() || "";
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
      search,
      brand,
      fuelType,
      price,
      mine,
    },
  };
}

function buildDealerFilters(filters, dealerId) {
  const databaseFilters = {
    dealerId,
  };

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

      const cars = await Car.find(buildDealerFilters(filters, dealer._id)).sort({ createdAt: -1 }).lean();

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

  try {
    const { cars, source } = await loadPublicCars(filters);

    return NextResponse.json({
      success: true,
      source,
      cars,
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
    const validationResult = await buildValidatedCarData(body);

    if (validationResult.error) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error,
        },
        { status: 400 }
      );
    }

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
