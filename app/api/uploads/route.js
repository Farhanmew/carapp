import { NextResponse } from "next/server";
import { MAX_CAR_IMAGES } from "@/lib/carUtils";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { requireDealerAuth } from "@/lib/dealerMiddleware";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request) {
  try {
    const { error } = await requireDealerAuth(request);

    if (error) {
      return error;
    }

    const formData = await request.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please choose at least one image to upload.",
        },
        { status: 400 }
      );
    }

    if (files.length > MAX_CAR_IMAGES) {
      return NextResponse.json(
        {
          success: false,
          message: `You can upload up to ${MAX_CAR_IMAGES} images at a time.`,
        },
        { status: 400 }
      );
    }

    const uploadedAssets = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file payload.",
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Only JPG, PNG, WEBP, and GIF files are allowed.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            message: "Each image must be 5 MB or smaller.",
          },
          { status: 400 }
        );
      }

      const uploadResult = await uploadImageBuffer(Buffer.from(await file.arrayBuffer()));

      uploadedAssets.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully.",
      assets: uploadedAssets,
      urls: uploadedAssets.map((asset) => asset.url),
    });
  } catch (error) {
    console.error("POST /api/uploads error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong while uploading the images.",
      },
      { status: 500 }
    );
  }
}
