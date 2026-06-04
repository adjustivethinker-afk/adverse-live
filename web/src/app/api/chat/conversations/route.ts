import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");
  const me = sess.uid;

  const parts = await prisma.conversationParticipant.findMany({
    where: { userId: me, archived: false },
    include: {
      conversation: {
        include: {
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
          participants: {
            where: { userId: { not: me } },
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  displayName: true,
                  username: true,
                  avatarUrl: true,
                  lastActiveAt: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ conversation: { lastMessageAt: "desc" } }],
  });

  const now = Date.now();
  return ok({
    conversations: parts.map((p) => {
      const peer = p.conversation.participants[0]?.user;
      const last = p.conversation.messages[0];
      return {
        id: p.conversation.id,
        peer: peer
          ? {
              id: peer.id,
              fullName: peer.fullName,
              displayName: peer.displayName,
              username: peer.username,
              avatarUrl: peer.avatarUrl,
              online:
                !!peer.lastActiveAt &&
                now - peer.lastActiveAt.getTime() < 5 * 60_000,
            }
          : null,
        lastMessage: last
          ? {
              body: last.body,
              senderId: last.senderId,
              at: last.createdAt.toISOString(),
            }
          : null,
        lastReadAt: p.lastReadAt?.toISOString() ?? null,
        updatedAt:
          p.conversation.lastMessageAt?.toISOString() ??
          p.conversation.createdAt.toISOString(),
      };
    }),
  });
}
