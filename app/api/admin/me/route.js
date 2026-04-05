import { NextResponse } from "next/server";
import { formatDealerResponse } from "@/lib/auth";
import { requireAdminAuth } from "@/lib/adminMiddleware";

export async function GET(request) {
  try {
    const { admin, error } = await requireAdminAuth(request);

    if (error) {
      return error;
    }

    return NextResponse.json({
      success: true,
      admin: formatDealerResponse(admin),
    });
  } catch (error) {
    console.error("GET /api/admin/me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while loading the admin profile.",
      },
      { status: 500 }
    );
  }
}
