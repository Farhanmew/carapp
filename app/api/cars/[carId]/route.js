import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireDealerAuth } from "@/lib/dealerMiddleware";
import Car from "@/models/Car";

function formatCarResponse(car) {
  return {
    ...car.toObject(),
    _id: car._id.toString(),
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
  };
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

  // Validate the numeric fields before saving the updated car.
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

function validateCarId(carId) {
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid car id.",
      },
      { status: 400 }
    );
  }

  return null;
}

export async function PATCH(request, { params }) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        success: false,
        message: "Add MONGODB_URI before updating cars in MongoDB.",
      },
      { status: 400 }
    );
  }

  try {
    const resolvedParams = await params;
    const { dealer, error } = await requireDealerAuth(request);

    if (error) {
      return error;
    }

    const invalidCarIdResponse = validateCarId(resolvedParams.carId);

    if (invalidCarIdResponse) {
      return invalidCarIdResponse;
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

    await connectToDatabase();

    // Update only the car that belongs to the logged-in dealer.
    const updatedCar = await Car.findOneAndUpdate(
      {
        _id: resolvedParams.carId,
        dealerId: dealer._id,
      },
      validationResult.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCar) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully.",
      car: formatCarResponse(updatedCar),
    });
  } catch (error) {
    console.error("PATCH /api/cars/[carId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating the car.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        success: false,
        message: "Add MONGODB_URI before deleting cars from MongoDB.",
      },
      { status: 400 }
    );
  }

  try {
    const resolvedParams = await params;
    const { dealer, error } = await requireDealerAuth(request);

    if (error) {
      return error;
    }

    const invalidCarIdResponse = validateCarId(resolvedParams.carId);

    if (invalidCarIdResponse) {
      return invalidCarIdResponse;
    }

    await connectToDatabase();

    // Delete only the car that belongs to the logged-in dealer.
    const deletedCar = await Car.findOneAndDelete({
      _id: resolvedParams.carId,
      dealerId: dealer._id,
    });

    if (!deletedCar) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/cars/[carId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the car.",
      },
      { status: 500 }
    );
  }
}
