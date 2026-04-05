import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/adminMiddleware";
import Car from "@/models/Car";
import Dealer from "@/models/Dealer";
import Enquiry from "@/models/Enquiry";

function validateDealerId(dealerId) {
  if (!mongoose.Types.ObjectId.isValid(dealerId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid dealer id.",
      },
      { status: 400 }
    );
  }

  return null;
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { admin, error } = await requireAdminAuth(request);

    if (error) {
      return error;
    }

    const invalidDealerIdResponse = validateDealerId(resolvedParams.dealerId);

    if (invalidDealerIdResponse) {
      return invalidDealerIdResponse;
    }

    // Prevent deleting the currently logged-in admin account.
    if (admin._id.toString() === resolvedParams.dealerId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot delete your own admin account.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const dealer = await Dealer.findOne({
      _id: resolvedParams.dealerId,
      role: "dealer",
    });

    if (!dealer) {
      return NextResponse.json(
        {
          success: false,
          message: "Dealer not found.",
        },
        { status: 404 }
      );
    }

    // Remove the dealer's cars and related enquiries to keep the data clean.
    const dealerCars = await Car.find({ dealerId: dealer._id }).select("_id").lean();
    const dealerCarIds = dealerCars.map((car) => car._id.toString());

    await Dealer.findByIdAndDelete(dealer._id);
    await Car.deleteMany({ dealerId: dealer._id });

    if (dealerCarIds.length > 0) {
      await Enquiry.deleteMany({ carId: { $in: dealerCarIds } });
    }

    return NextResponse.json({
      success: true,
      message: "Dealer deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/dealers/[dealerId] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the dealer.",
      },
      { status: 500 }
    );
  }
}
