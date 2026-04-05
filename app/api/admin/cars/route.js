import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/adminMiddleware";
import Car from "@/models/Car";
import Dealer from "@/models/Dealer";

function serializeAdminCars(cars, dealers) {
  const dealerMap = new Map(
    dealers.map((dealer) => [
      dealer._id.toString(),
      {
        name: dealer.name,
        email: dealer.email,
      },
    ])
  );

  return cars.map((car) => {
    const dealer = dealerMap.get(car.dealerId?.toString ? car.dealerId.toString() : car.dealerId) || {};

    return {
      ...car,
      _id: car._id?.toString ? car._id.toString() : car._id,
      dealerId: car.dealerId?.toString ? car.dealerId.toString() : car.dealerId,
      createdAt: car.createdAt?.toISOString ? car.createdAt.toISOString() : car.createdAt,
      dealerName: dealer.name || "Dealer not found",
      dealerEmail: dealer.email || "",
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

    const [cars, dealers] = await Promise.all([
      Car.find().sort({ createdAt: -1 }).lean(),
      Dealer.find().select("name email").lean(),
    ]);

    return NextResponse.json({
      success: true,
      cars: serializeAdminCars(cars, dealers),
    });
  } catch (error) {
    console.error("GET /api/admin/cars error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading cars.",
      },
      { status: 500 }
    );
  }
}
