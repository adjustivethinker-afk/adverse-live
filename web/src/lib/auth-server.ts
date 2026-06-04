import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE_NAME = "adverse_session";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_ACCESS_SECRET ||
    // Fallback ONLY for local dev where you forgot to set the env. In
    // production we throw so you can't accidentally ship a known secret.
    (process.env.NODE_ENV !== "production" ? "dev-only-please-change" : "");
  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not set. Configure it in your hosting environment.",
    );
  }
  return new TextEncoder().encode(secret);
}

import type { Role } from "@prisma/client";

export type SessionPayload = {
  uid: string;
  role: Role;
};

export async function signSession(
  payload: SessionPayload,
  ttl: string = "30d",
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    if (typeof payload.uid !== "string") return null;
    return {
      uid: payload.uid,
      role: ((payload.role as Role) || "USER") as Role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

/** Returns the current user's id+role, or null if unauthenticated. */
export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Loads the full user record from the database for the current session.
 * Touches `lastActiveAt` so we can show "online now" status to others.
 */
export async function getCurrentUser() {
  const sess = await getSession();
  if (!sess) return null;
  const user = await prisma.user.findUnique({
    where: { id: sess.uid },
    include: { wallet: true },
  });
  if (!user) return null;
  // Best-effort heartbeat; ignore failures (e.g. read replica lag).
  prisma.user
    .update({ where: { id: user.id }, data: { lastActiveAt: new Date() } })
    .catch(() => {});
  return user;
}

export async function hashPassword(plain: string): Promise<string> {
  // bcryptjs (12 rounds) is intentionally chosen over argon2 because
  // argon2 ships native binaries that don't run on Vercel's serverless
  // runtime without extra config. bcryptjs is pure JS, slower but safe.
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
