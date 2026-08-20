import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/mail";
import { inquirySchema, rateLimit } from "@/lib/validation";
import { Inquiry } from "@/models";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`inquiry:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  try {
    const parsed = inquirySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid form data.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    await connectDb();
    const { website, ...safe } = parsed.data;
    if (website) return NextResponse.json({ ok: true }, { status: 201 });
    await Inquiry.create({
      ...safe,
      ipHash: createHash("sha256").update(ip).digest("hex"),
    });
    try {
      await sendInquiryNotification(safe);
    } catch (error) {
      console.error("Inquiry notification email failed", error);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Inquiry creation failed", error);
    return NextResponse.json({ ok: false, error: "Unable to save inquiry." }, { status: 500 });
  }
}
