import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ensureJwtSecret, getDealerFromToken } from "@/lib/auth";
import Dealer from "@/models/Dealer";

export async function requireDealerAuth(request) {
  try {
    ensureJwtSecret();

    const decodedToken = getDealerFromToken(request);

    // Stop early if there is no valid token in the request.
    if (!decodedToken?.dealerId) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Unauthorized. Please log in first.",
          },
          { status: 401 }
        ),
      };
    }

    // Only allow logged-in dealers to continue.
    if (decodedToken.role !== "dealer") {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Access denied. Dealer account required.",
          },
          { status: 403 }
        ),
      };
    }

    await connectToDatabase();

    const dealer = await Dealer.findById(decodedToken.dealerId);

    if (!dealer) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Dealer not found.",
          },
          { status: 404 }
        ),
      };
    }

    if (dealer.role !== "dealer") {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Access denied. Dealer account required.",
          },
          { status: 403 }
        ),
      };
    }

    return { dealer };
  } catch (error) {
    console.error("Dealer middleware error:", error);

    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Something went wrong while checking dealer access.",
        },
        { status: 500 }
      ),
    };
  }
}
