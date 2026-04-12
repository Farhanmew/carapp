import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { buildValidatedCarData } from "@/lib/carUtils";
import { deleteCloudinaryAssets } from "@/lib/cloudinary";
import { requireDealerAuth } from "@/lib/dealerMiddleware";
import Car from "@/models/Car";
import Enquiry from "@/models/Enquiry";

function formatCarResponse(car) {
  return {
    ...car.toObject(),
    _id: car._id.toString(),
    dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
    createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
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
    const validationResult = await buildValidatedCarData(body, resolvedParams.carId);

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

    const existingCar = await Car.findOne({
      _id: resolvedParams.carId,
      dealerId: dealer._id,
    });

    if (!existingCar) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found.",
        },
        { status: 404 }
      );
    }

    const previousPublicIds = Array.isArray(existingCar.imagePublicIds) ? existingCar.imagePublicIds.filter(Boolean) : [];

    Object.assign(existingCar, validationResult.data);
    await existingCar.save();

    const currentPublicIds = Array.isArray(existingCar.imagePublicIds) ? existingCar.imagePublicIds.filter(Boolean) : [];
    const removedPublicIds = previousPublicIds.filter((publicId) => !currentPublicIds.includes(publicId));

    if (removedPublicIds.length > 0) {
      deleteCloudinaryAssets(removedPublicIds).catch((cloudinaryError) => {
        console.error("Cloudinary cleanup after car update failed:", cloudinaryError);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully.",
      car: formatCarResponse(existingCar),
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

    await Enquiry.deleteMany({ carId: resolvedParams.carId });

    if (Array.isArray(deletedCar.imagePublicIds) && deletedCar.imagePublicIds.length > 0) {
      deleteCloudinaryAssets(deletedCar.imagePublicIds).catch((cloudinaryError) => {
        console.error("Cloudinary cleanup after car delete failed:", cloudinaryError);
      });
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
