import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

const Schema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

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
  if (!parsed.success) return fail("Validation failed", 400, "VALIDATION");

  const member = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: parsed.data.conversationId,
        userId: sess.uid,
      },
    },
  });
  if (!member) return fail("Forbidden", 403, "NOT_PARTICIPANT");

  const [msg] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: {
        conversationId: parsed.data.conversationId,
        senderId: sess.uid,
        body: parsed.data.body,
      },
    }),
    prisma.conversation.update({
      where: { id: parsed.data.conversationId },
      data: { lastMessageAt: new Date() },
    }),
    prisma.user.update({
      where: { id: sess.uid },
      data: {
        lastActiveAt: new Date(),
        activityScore: { increment: 1 },
      },
    }),
  ]);

  return ok({
    message: {
      id: msg.id,
      senderId: msg.senderId,
      body: msg.body,
      at: msg.createdAt.toISOString(),
      mine: true,
    },
  });
}
