import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/adminMiddleware";
import Dealer from "@/models/Dealer";

function serializeDealers(dealers) {
  return dealers.map((dealer) => ({
    ...dealer,
    _id: dealer._id?.toString ? dealer._id.toString() : dealer._id,
    createdAt: dealer.createdAt?.toISOString ? dealer.createdAt.toISOString() : dealer.createdAt,
  }));
}

export async function GET(request) {
  try {
    const { error } = await requireAdminAuth(request);

    if (error) {
      return error;
    }

    await connectToDatabase();

    // Only show dealer accounts in the dealer management list.
    const dealers = await Dealer.find({ role: "dealer" }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      dealers: serializeDealers(dealers),
    });
  } catch (error) {
    console.error("GET /api/admin/dealers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading dealers.",
      },
      { status: 500 }
    );
  }
}
