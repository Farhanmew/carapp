import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireDealerAuth } from "@/lib/dealerMiddleware";
import Car from "@/models/Car";
import Enquiry from "@/models/Enquiry";

function formatEnquiryResponse(enquiry) {
  return {
    ...enquiry.toObject(),
    _id: enquiry._id.toString(),
    createdAt: enquiry.createdAt?.toISOString ? enquiry.createdAt.toISOString() : enquiry.createdAt,
  };
}

function serializeDealerEnquiries(enquiries, cars) {
  const carMap = new Map(
    cars.map((car) => [
      car._id.toString(),
      {
        title: car.title,
        brand: car.brand,
      },
    ])
  );

  return enquiries.map((enquiry) => {
    const relatedCar = carMap.get(enquiry.carId) || {};

    return {
      ...enquiry,
      _id: enquiry._id?.toString ? enquiry._id.toString() : enquiry._id,
      createdAt: enquiry.createdAt?.toISOString ? enquiry.createdAt.toISOString() : enquiry.createdAt,
      carTitle: relatedCar.title || "Car not found",
      carBrand: relatedCar.brand || "",
    };
  });
}

function validateEnquiryInput(body) {
  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();
  const carId = body.carId?.toString().trim();

  if (!name || !phone || !message || !carId) {
    return {
      error: "name, phone, message, and carId are required.",
    };
  }

  // Keep phone validation simple while still blocking obviously invalid values.
  if (phone.replace(/\D/g, "").length < 7) {
    return {
      error: "Please enter a valid phone number.",
    };
  }

  return {
    data: {
      name,
      phone,
      message,
      carId,
    },
  };
}

export async function GET(request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      {
        success: false,
        message: "Add MONGODB_URI before loading enquiries.",
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

    // Load the dealer's cars first so enquiries can be matched to those listings.
    const dealerCars = await Car.find({ dealerId: dealer._id }).sort({ createdAt: -1 }).lean();
    const dealerCarIds = dealerCars.map((car) => car._id.toString());

    if (dealerCarIds.length === 0) {
      return NextResponse.json({
        success: true,
        enquiries: [],
      });
    }

    const enquiries = await Enquiry.find({ carId: { $in: dealerCarIds } }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      enquiries: serializeDealerEnquiries(enquiries, dealerCars),
    });
  } catch (error) {
    console.error("GET /api/enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading enquiries.",
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
        message: "Add MONGODB_URI before saving enquiries.",
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const validationResult = validateEnquiryInput(body);

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

    // Save only the validated fields so the payload stays predictable.
    const enquiry = await Enquiry.create(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry sent successfully.",
        enquiry: formatEnquiryResponse(enquiry),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving the enquiry.",
      },
      { status: 500 }
    );
  }
}
