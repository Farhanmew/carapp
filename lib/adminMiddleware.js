import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ensureJwtSecret, getDealerFromToken } from "@/lib/auth";
import Dealer from "@/models/Dealer";

export async function requireAdminAuth(request) {
  try {
    ensureJwtSecret();

    const decodedToken = getDealerFromToken(request);

    // Stop early if the request does not include a valid token.
    if (!decodedToken?.dealerId) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Unauthorized. Please log in as admin first.",
          },
          { status: 401 }
        ),
      };
    }

    // Only admin accounts can access admin routes.
    if (decodedToken.role !== "admin") {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Access denied. Admin account required.",
          },
          { status: 403 }
        ),
      };
    }

    await connectToDatabase();

    const admin = await Dealer.findById(decodedToken.dealerId);

    if (!admin) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Admin account not found.",
          },
          { status: 404 }
        ),
      };
    }

    if (admin.role !== "admin") {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: "Access denied. Admin account required.",
          },
          { status: 403 }
        ),
      };
    }

    return { admin };
  } catch (error) {
    console.error("Admin middleware error:", error);

    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Something went wrong while checking admin access.",
        },
        { status: 500 }
      ),
    };
  }
}
