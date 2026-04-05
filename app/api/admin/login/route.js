import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import {
  createDealerToken,
  ensureJwtSecret,
  formatDealerResponse,
  getAuthCookieOptions,
  DEALER_TOKEN_COOKIE,
} from "@/lib/auth";
import Dealer from "@/models/Dealer";

export async function POST(request) {
  try {
    ensureJwtSecret();

    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "email and password are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Admin accounts use the same model as dealers and are identified by role.
    const admin = await Dealer.findOne({ email, role: "admin" });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin email or password.",
        },
        { status: 401 }
      );
    }

    const passwordMatches = await admin.comparePassword(password);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin email or password.",
        },
        { status: 401 }
      );
    }

    const token = createDealerToken(admin);

    const response = NextResponse.json({
      success: true,
      message: "Admin logged in successfully.",
      admin: formatDealerResponse(admin),
    });

    response.cookies.set(DEALER_TOKEN_COOKIE, token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("POST /api/admin/login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in as admin.",
      },
      { status: 500 }
    );
  }
}
