import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Please add MONGODB_URI to your .env.local file.");
  }

  // Reuse the existing connection during development so hot reload does not create extra connections.
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }

  return global.mongoose.conn;
}

