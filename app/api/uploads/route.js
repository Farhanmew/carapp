import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { MAX_CAR_IMAGES } from "@/lib/carUtils";
import { requireDealerAuth } from "@/lib/dealerMiddleware";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

function getSafeExtension(file) {
  const typeExtension = ALLOWED_IMAGE_TYPES.get(file.type);

  if (typeExtension) {
    return typeExtension;
  }

  const originalExtension = path.extname(file.name || "").toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(originalExtension) ? originalExtension : "";
}

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

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDirectory, { recursive: true });

    const uploadedUrls = [];

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

      const safeExtension = getSafeExtension(file);

      if (!safeExtension) {
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

      const fileName = `${Date.now()}-${randomUUID()}${safeExtension === ".jpeg" ? ".jpg" : safeExtension}`;
      const filePath = path.join(uploadDirectory, fileName);
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      await writeFile(filePath, fileBuffer);
      uploadedUrls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully.",
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("POST /api/uploads error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while uploading the images.",
      },
      { status: 500 }
    );
  }
}
