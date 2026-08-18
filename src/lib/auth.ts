import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "canam_admin_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "development-only-change-this-auth-secret",
);

export type AdminSession = {
  userId: string;
  email: string;
};

export async function createSession(session: AdminSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
