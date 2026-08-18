import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { bookingSchema, rateLimit } from "@/lib/validation";
import { BookingRequest } from "@/models";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`booking:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid booking data.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    await connectDb();
    const { website, ...safe } = parsed.data;
    if (website) return NextResponse.json({ ok: true }, { status: 201 });
    await BookingRequest.create({ ...safe, ipHash: createHash("sha256").update(ip).digest("hex") });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Booking creation failed", error);
    return NextResponse.json({ ok: false, error: "Unable to save booking." }, { status: 500 });
  }
}
