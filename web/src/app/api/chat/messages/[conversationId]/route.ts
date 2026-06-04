import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");
  const { conversationId } = await params;

  const member = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: sess.uid },
    },
  });
  if (!member) return fail("Forbidden", 403, "NOT_PARTICIPANT");

  const url = new URL(req.url);
  const before = url.searchParams.get("before"); // ISO date for pagination
  const messages = await prisma.chatMessage.findMany({
    where: {
      conversationId,
      deletedAt: null,
      ...(before ? { createdAt: { lt: new Date(before) } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      senderId: true,
      body: true,
      createdAt: true,
      edited: true,
    },
  });

  // Mark conversation as read
  prisma.conversationParticipant
    .update({
      where: { conversationId_userId: { conversationId, userId: sess.uid } },
      data: { lastReadAt: new Date() },
    })
    .catch(() => {});

  return ok({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      senderId: m.senderId,
      body: m.body,
      at: m.createdAt.toISOString(),
      edited: m.edited,
      mine: m.senderId === sess.uid,
    })),
  });
}
