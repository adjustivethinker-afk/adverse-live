import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getCurrentUser, getSession } from "@/lib/auth-server";
import { serializeUser } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getCurrentUser();
  if (!u) return fail("Login required", 401, "UNAUTHENTICATED");
  return ok({ user: serializeUser(u) });
}

const PatchSchema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  displayName: z.string().min(1).max(40).optional(),
  bio: z.string().max(200).optional().nullable(),
  city: z.string().min(2).max(60).optional(),
  avatarUrl: z.string().url().max(500).optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed", 400, "VALIDATION");

  const updated = await prisma.user.update({
    where: { id: sess.uid },
    data: parsed.data,
    include: { wallet: true },
  });
  return ok({ user: serializeUser(updated) });
}
