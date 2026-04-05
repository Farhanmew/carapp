import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/adminMiddleware";
import Car from "@/models/Car";
import Dealer from "@/models/Dealer";
import Enquiry from "@/models/Enquiry";

function serializeAdminEnquiries(enquiries, cars, dealers) {
  const carMap = new Map(
    cars.map((car) => [
      car._id.toString(),
      {
        title: car.title,
        brand: car.brand,
        dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
      },
    ])
  );

  const dealerMap = new Map(
    dealers.map((dealer) => [
      dealer._id.toString(),
      {
        name: dealer.name,
        email: dealer.email,
      },
    ])
  );

  return enquiries.map((enquiry) => {
    const relatedCar = carMap.get(enquiry.carId) || {};
    const relatedDealer = dealerMap.get(relatedCar.dealerId) || {};

    return {
      ...enquiry,
      _id: enquiry._id?.toString ? enquiry._id.toString() : enquiry._id,
      createdAt: enquiry.createdAt?.toISOString ? enquiry.createdAt.toISOString() : enquiry.createdAt,
      carTitle: relatedCar.title || "Car not found",
      carBrand: relatedCar.brand || "",
      dealerName: relatedDealer.name || "Dealer not found",
      dealerEmail: relatedDealer.email || "",
    };
  });
}

export async function GET(request) {
  try {
    const { error } = await requireAdminAuth(request);

    if (error) {
      return error;
    }

    await connectToDatabase();

    const [enquiries, cars, dealers] = await Promise.all([
      Enquiry.find().sort({ createdAt: -1 }).lean(),
      Car.find().select("title brand dealerId").lean(),
      Dealer.find().select("name email").lean(),
    ]);

    return NextResponse.json({
      success: true,
      enquiries: serializeAdminEnquiries(enquiries, cars, dealers),
    });
  } catch (error) {
    console.error("GET /api/admin/enquiries error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading enquiries.",
      },
      { status: 500 }
    );
  }
}
