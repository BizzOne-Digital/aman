import type { Model } from "mongoose";
import { adminModels, type AdminCollection } from "@/lib/admin-data";
import { connectDb, serialize } from "@/lib/db";

export async function listAdmin(collection: AdminCollection) {
  try {
    await connectDb();
    const model = adminModels[collection] as Model<Record<string, unknown>>;
    return serialize(await model.find().sort({ order: 1, createdAt: -1 }).lean()) as Array<Record<string, unknown> & { _id: string }>;
  } catch {
    return [];
  }
}

export async function getAdminItem(collection: AdminCollection, id: string) {
  await connectDb();
  const model = adminModels[collection] as Model<Record<string, unknown>>;
  const item = await model.findById(id).lean();
  return item ? serialize(item) as Record<string, unknown> & { _id: string } : null;
}
