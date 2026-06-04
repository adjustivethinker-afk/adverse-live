import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import {
  setSessionCookie,
  signSession,
  verifyPassword,
} from "@/lib/auth-server";
import { serializeUser } from "@/lib/serialize";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  identifier: z.string().min(2).max(120),
  password: z.string().min(1).max(200),
});

function normalizePkPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  let local = digits;
  if (digits.startsWith("92")) local = digits.slice(2);
  else if (digits.startsWith("0")) local = digits.slice(1);
  return "+92" + local;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Username/email aur password chahiye", 400, "VALIDATION");
  }

  const idRaw = parsed.data.identifier.trim();
  // Detect identifier kind: email, PK phone, or username.
  const isEmail = idRaw.includes("@");
  const isPhone = /^\+?\d[\d\s-]{8,}$/.test(idRaw);

  const where = isEmail
    ? { email: idRaw.toLowerCase() }
    : isPhone
      ? { phone: normalizePkPhone(idRaw) }
      : { username: idRaw.toLowerCase() };

  const user = await prisma.user.findUnique({
    where,
    include: { wallet: true },
  });
  if (!user || !user.password) {
    return fail("Username/password galat hai", 401, "BAD_CREDENTIALS");
  }
  const matched = await verifyPassword(parsed.data.password, user.password);
  if (!matched) {
    return fail("Username/password galat hai", 401, "BAD_CREDENTIALS");
  }
  if (user.status === "BANNED" || user.status === "SUSPENDED") {
    return fail("Aap ka account suspended hai", 403, "ACCOUNT_LOCKED");
  }

  const token = await signSession({ uid: user.id, role: user.role });
  await setSessionCookie(token);

  // Bump heartbeat
  await prisma.user
    .update({ where: { id: user.id }, data: { lastActiveAt: new Date() } })
    .catch(() => {});

  return ok({ user: serializeUser(user) });
}
