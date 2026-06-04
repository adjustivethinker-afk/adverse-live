import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import {
  hashPassword,
  setSessionCookie,
  signSession,
} from "@/lib/auth-server";
import { isValidPkPhone } from "@/lib/pk";
import { serializeUser } from "@/lib/serialize";

export const dynamic = "force-dynamic";

const SignupSchema = z.object({
  fullName: z.string().min(2).max(80),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_]+$/i, "Sirf letters, numbers, aur _ allowed"),
  gender: z.enum(["male", "female", "MALE", "FEMALE"]),
  city: z.string().min(2).max(60),
  phone: z.string().refine(isValidPkPhone, "Pakistan ka phone number sahi nahi"),
  password: z.string().min(8).max(72),
  referralCode: z.string().optional().nullable(),
});

function normalizePkPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  let local = digits;
  if (digits.startsWith("92")) local = digits.slice(2);
  else if (digits.startsWith("0")) local = digits.slice(1);
  return "+92" + local;
}

function genReferralCode(): string {
  return (
    Math.random().toString(36).slice(2, 4).toUpperCase() +
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return fail(first?.message ?? "Validation failed", 400, "VALIDATION");
  }

  const { fullName, username, gender, city, phone, password, referralCode } =
    parsed.data;

  const phoneE164 = normalizePkPhone(phone);
  const usernameLower = username.toLowerCase();

  // Username + phone uniqueness checks (Prisma will also enforce, but a
  // friendly message beats a 500).
  const dupe = await prisma.user.findFirst({
    where: { OR: [{ username: usernameLower }, { phone: phoneE164 }] },
    select: { username: true, phone: true },
  });
  if (dupe?.username === usernameLower) {
    return fail("Yeh username pehle se mojood hai", 409, "USERNAME_TAKEN");
  }
  if (dupe?.phone === phoneE164) {
    return fail("Yeh phone number pehle se register hai", 409, "PHONE_TAKEN");
  }

  // Optional referral
  let referredById: string | undefined;
  if (referralCode) {
    const ref = await prisma.user.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
      select: { id: true },
    });
    referredById = ref?.id;
  }

  const passwordHash = await hashPassword(password);
  const code = genReferralCode();
  const display =
    fullName.split(/\s+/)[0]?.slice(0, 24) || usernameLower.slice(0, 24);

  // Create user + wallet first, then add the welcome-bonus transaction
  // (Transaction needs walletId, which we only know after the wallet row
  // exists). Wrap both in a single Prisma transaction for atomicity.
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        fullName,
        displayName: display,
        username: usernameLower,
        phone: phoneE164,
        gender: (gender.toUpperCase() as "MALE" | "FEMALE") ?? null,
        city,
        country: "PK",
        password: passwordHash,
        role: "USER",
        status: "ACTIVE",
        referralCode: code,
        referredById,
        lastActiveAt: new Date(),
        wallet: { create: { balance: 10, totalEarned: 10 } },
      },
      include: { wallet: true },
    });
    if (created.wallet) {
      await tx.transaction.create({
        data: {
          userId: created.id,
          walletId: created.wallet.id,
          type: "WELCOME_BONUS",
          status: "COMPLETED",
          amount: 10,
          balanceAfter: 10,
          description: "Welcome bonus",
        },
      });
    }
    return created;
  });

  const token = await signSession({ uid: user.id, role: user.role });
  await setSessionCookie(token);

  return ok({
    user: serializeUser(user),
  });
}
