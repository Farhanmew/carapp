import { NextResponse } from "next/server";
import { DEALER_TOKEN_COOKIE, getAuthCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Dealer logged out successfully.",
  });

  // Clear the saved auth cookie.
  response.cookies.set(DEALER_TOKEN_COOKIE, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });

  return response;
}
