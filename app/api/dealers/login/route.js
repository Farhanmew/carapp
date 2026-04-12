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

    const dealer = await Dealer.findOne({ email, role: "dealer" });

    if (!dealer) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordMatches = await dealer.comparePassword(password);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = createDealerToken(dealer);

    const response = NextResponse.json({
      success: true,
      message: "Dealer logged in successfully.",
      token,
      dealer: formatDealerResponse(dealer),
    });

    // Save the JWT in an HTTP-only cookie for browser requests.
    response.cookies.set(DEALER_TOKEN_COOKIE, token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("POST /api/dealers/login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}
