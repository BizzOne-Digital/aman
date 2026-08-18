import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import { getSession } from "@/lib/auth";
import { adminModels, isAdminCollection, pickAllowed } from "@/lib/admin-data";
import { connectDb, serialize } from "@/lib/db";

type Context = { params: Promise<{ collection: string; id: string }> };

export async function GET(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { collection, id } = await params;
  if (!isAdminCollection(collection)) return NextResponse.json({ ok: false, error: "Unknown collection" }, { status: 404 });
  await connectDb();
  const model = adminModels[collection] as Model<Record<string, unknown>>;
  const item = id === "singleton" && collection === "settings" ? await model.findOne({ singletonKey: "site" }).lean() : await model.findById(id).lean();
  return item ? NextResponse.json({ ok: true, data: serialize(item) }) : NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { collection, id } = await params;
  if (!isAdminCollection(collection)) return NextResponse.json({ ok: false, error: "Unknown collection" }, { status: 404 });
  try {
    await connectDb();
    const model = adminModels[collection] as Model<Record<string, unknown>>;
    const update = pickAllowed(collection, await request.json() as Record<string, unknown>);
    const item = id === "singleton" && collection === "settings"
      ? await model.findOneAndUpdate({ singletonKey: "site" }, { $set: update, $setOnInsert: { singletonKey: "site" } }, { new: true, upsert: true, runValidators: true }).lean()
      : await model.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).lean();
    if (!item) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, data: serialize(item) });
  } catch (error) {
    const duplicate = typeof error === "object" && error !== null && "code" in error && error.code === 11000;
    return NextResponse.json({ ok: false, error: duplicate ? "That slug is already in use." : "Unable to save changes." }, { status: duplicate ? 409 : 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  if (!(await getSession())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { collection, id } = await params;
  if (!isAdminCollection(collection) || collection === "settings") return NextResponse.json({ ok: false, error: "Unsupported" }, { status: 400 });
  await connectDb();
  const model = adminModels[collection] as Model<Record<string, unknown>>;
  if (collection === "services") await model.findByIdAndUpdate(id, { $set: { archived: true, published: false } });
  else await model.findByIdAndDelete(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
