import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

const Schema = z.object({ peerId: z.string().min(1) });

/**
 * Get-or-create a 1:1 conversation between the current user and `peerId`.
 * Uses a deterministic `participantsKey = sorted(uA::uB)` so we can
 * upsert without races.
 */
export async function POST(req: NextRequest) {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return fail("peerId required", 400, "VALIDATION");
  const peerId = parsed.data.peerId;
  if (peerId === sess.uid)
    return fail("Apne aap se baat nahi kar sakte", 400, "SAME_USER");

  const peer = await prisma.user.findUnique({
    where: { id: peerId },
    select: { id: true },
  });
  if (!peer) return fail("User not found", 404, "USER_NOT_FOUND");

  const key = [sess.uid, peerId].sort().join("::");
  const existing = await prisma.conversation.findUnique({
    where: { participantsKey: key },
  });
  let conversationId: string;
  if (existing) {
    conversationId = existing.id;
  } else {
    const created = await prisma.conversation.create({
      data: {
        participantsKey: key,
        participants: {
          create: [{ userId: sess.uid }, { userId: peerId }],
        },
      },
    });
    conversationId = created.id;
  }

  return ok({ id: conversationId });
}
