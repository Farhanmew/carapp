import { NextResponse } from "next/server";
import { formatDealerResponse } from "@/lib/auth";
import { requireDealerAuth } from "@/lib/dealerMiddleware";

export async function GET(request) {
  try {
    const { dealer, error } = await requireDealerAuth(request);

    if (error) {
      return error;
    }

    return NextResponse.json({
      success: true,
      dealer: formatDealerResponse(dealer),
    });
  } catch (error) {
    console.error("GET /api/dealers/me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading the dealer profile.",
      },
      { status: 500 }
    );
  }
}
