import { NextRequest, NextResponse } from "next/server";
import type { Model } from "mongoose";
import { getSession } from "@/lib/auth";
import { adminModels, isAdminCollection, pickAllowed } from "@/lib/admin-data";
import { connectDb, serialize } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { collection } = await params;
  if (!isAdminCollection(collection)) return NextResponse.json({ ok: false, error: "Unknown collection" }, { status: 404 });
  await connectDb();
  const model = adminModels[collection] as Model<Record<string, unknown>>;
  const search = request.nextUrl.searchParams.get("q")?.trim();
  const query = search ? { $or: ["title", "name", "clientName", "question", "email"].map((field) => ({ [field]: { $regex: search, $options: "i" } })) } : {};
  const items = await model.find(query).sort({ order: 1, createdAt: -1 }).limit(250).lean();
  return NextResponse.json({ ok: true, data: serialize(items) });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { collection } = await params;
  if (!isAdminCollection(collection) || ["inquiries", "bookings"].includes(collection)) return NextResponse.json({ ok: false, error: "Unsupported" }, { status: 400 });
  try {
    await connectDb();
    const input = await request.json() as Record<string, unknown>;
    const model = adminModels[collection] as Model<Record<string, unknown>>;
    const item = await model.create(pickAllowed(collection, input));
    return NextResponse.json({ ok: true, data: serialize(item.toObject()) }, { status: 201 });
  } catch (error) {
    const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
    return NextResponse.json({ ok: false, error: duplicate ? "That slug or name is already in use." : "Unable to create record." }, { status: duplicate ? 409 : 400 });
  }
}
