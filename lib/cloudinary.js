function parseCloudinaryUrl(value) {
  try {
    const parsedUrl = new URL(value);

    if (parsedUrl.protocol !== "cloudinary:") {
      return null;
    }

    const credentials = {
      cloud_name: parsedUrl.hostname?.trim(),
      api_key: decodeURIComponent(parsedUrl.username || "").trim(),
      api_secret: decodeURIComponent(parsedUrl.password || "").trim(),
    };

    if (!credentials.cloud_name || !credentials.api_key || !credentials.api_secret) {
      return null;
    }

    if ([credentials.cloud_name, credentials.api_key, credentials.api_secret].some(isPlaceholderValue)) {
      return null;
    }

    return credentials;
  } catch (error) {
    return null;
  }
}

function isPlaceholderValue(value) {
  const normalizedValue = `${value || ""}`.trim();

  return !normalizedValue || normalizedValue.includes("<") || normalizedValue.includes(">");
}

function buildCloudinaryUrl(credentials) {
  return `cloudinary://${encodeURIComponent(credentials.api_key)}:${encodeURIComponent(
    credentials.api_secret
  )}@${credentials.cloud_name}`;
}

function getCloudinaryCredentials() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const parsedCloudinaryUrl = cloudinaryUrl ? parseCloudinaryUrl(cloudinaryUrl) : null;

  if (parsedCloudinaryUrl) {
    return parsedCloudinaryUrl;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (isPlaceholderValue(cloudName) || isPlaceholderValue(apiKey) || isPlaceholderValue(apiSecret)) {
    if (cloudinaryUrl) {
      throw new Error("Cloudinary is not configured correctly. Fix CLOUDINARY_URL or the individual Cloudinary credentials.");
    }

    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  };
}

let cloudinaryClientPromise;

async function getCloudinaryClient() {
  const credentials = getCloudinaryCredentials();
  const validCloudinaryUrl = buildCloudinaryUrl(credentials);
  process.env.CLOUDINARY_URL = validCloudinaryUrl;

  if (!cloudinaryClientPromise) {
    cloudinaryClientPromise = import("cloudinary").then(({ v2: cloudinary }) => cloudinary);
  }

  const cloudinary = await cloudinaryClientPromise;

  cloudinary.config({
    ...credentials,
    secure: true,
  });

  return cloudinary;
}

export function getCloudinaryUploadFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "valuedrive/cars";
}

export async function uploadImageBuffer(buffer) {
  const client = await getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: getCloudinaryUploadFolder(),
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteCloudinaryAssets(publicIds = []) {
  const sanitizedIds = [...new Set(publicIds.map((publicId) => `${publicId}`.trim()).filter(Boolean))];

  if (sanitizedIds.length === 0) {
    return null;
  }

  const client = await getCloudinaryClient();

  return client.api.delete_resources(sanitizedIds, {
    resource_type: "image",
    type: "upload",
    invalidate: true,
  });
}
