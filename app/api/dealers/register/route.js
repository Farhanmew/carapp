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
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const phone = body.phone?.trim() || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "name, email, and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingDealer = await Dealer.findOne({ email });

    if (existingDealer) {
      return NextResponse.json(
        {
          success: false,
          message: "A dealer with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Password hashing happens inside the Dealer model before save.
    const dealer = await Dealer.create({
      name,
      email,
      password,
      phone,
    });

    const token = createDealerToken(dealer);

    const response = NextResponse.json(
      {
        success: true,
        message: "Dealer registered successfully.",
        token,
        dealer: formatDealerResponse(dealer),
      },
      { status: 201 }
    );

    // Save the JWT in an HTTP-only cookie for browser requests.
    response.cookies.set(DEALER_TOKEN_COOKIE, token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("POST /api/dealers/register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while registering the dealer.",
      },
      { status: 500 }
    );
  }
}
