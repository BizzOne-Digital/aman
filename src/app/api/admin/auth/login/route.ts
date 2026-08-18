import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { loginSchema, rateLimit } from "@/lib/validation";
import { AdminUser } from "@/models";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!rateLimit(`login:${ip}`, 8, 10 * 60_000)) return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 400 });
    await connectDb();
    const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase(), active: true });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }
    await createSession({ userId: String(user._id), email: user.email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ ok: false, error: "Login unavailable." }, { status: 500 });
  }
}
