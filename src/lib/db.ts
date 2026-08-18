import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/canam_facility";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cache;

export async function connectDb() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5_000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
