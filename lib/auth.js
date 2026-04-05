import jwt from "jsonwebtoken";

export const DEALER_TOKEN_COOKIE = "dealerToken";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function ensureJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Please add JWT_SECRET to your .env.local file.");
  }

  return jwtSecret;
}

export function createDealerToken(dealer) {
  const jwtSecret = ensureJwtSecret();

  return jwt.sign(
    {
      dealerId: dealer._id.toString(),
      email: dealer.email,
      role: dealer.role,
    },
    jwtSecret,
    {
      expiresIn: TOKEN_MAX_AGE,
    }
  );
}

export function verifyDealerToken(token) {
  const jwtSecret = ensureJwtSecret();
  return jwt.verify(token, jwtSecret);
}

export function getDealerTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");

  // Allow both Bearer token headers and cookie-based authentication.
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return request.cookies.get(DEALER_TOKEN_COOKIE)?.value || null;
}

export function getDealerFromToken(request) {
  const token = getDealerTokenFromRequest(request);

  if (!token) {
    return null;
  }

  try {
    return verifyDealerToken(token);
  } catch (error) {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  };
}

export function formatDealerResponse(dealer) {
  const dealerObject = dealer.toObject ? dealer.toObject() : dealer;

  return {
    _id: dealerObject._id?.toString ? dealerObject._id.toString() : dealerObject._id,
    name: dealerObject.name,
    email: dealerObject.email,
    phone: dealerObject.phone,
    role: dealerObject.role,
    createdAt: dealerObject.createdAt?.toISOString
      ? dealerObject.createdAt.toISOString()
      : dealerObject.createdAt,
  };
}
