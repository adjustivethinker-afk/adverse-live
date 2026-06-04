import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /** Build the canonical participants key for a 1:1 conversation. */
  private keyFor(a: string, b: string) {
    return [a, b].sort().join("::");
  }

  /** Get or create a direct (1:1) conversation between two users. */
  async getOrCreateDM(userId: string, otherId: string) {
    if (userId === otherId) throw new ForbiddenException("Aap apne aap se message nahi kar sakte.");
    const key = this.keyFor(userId, otherId);

    let convo = await this.prisma.conversation.findUnique({
      where: { participantsKey: key },
      include: { participants: { include: { user: { select: this.userSelect() } } } },
    });

    if (!convo) {
      convo = await this.prisma.conversation.create({
        data: {
          participantsKey: key,
          isGroup: false,
          participants: {
            create: [{ userId }, { userId: otherId }],
          },
        },
        include: { participants: { include: { user: { select: this.userSelect() } } } },
      });
    }
    return convo;
  }

  /** List all my conversations (most recent first). */
  async list(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
      take: 100,
      include: {
        participants: { include: { user: { select: this.userSelect() } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  }

  /** Read messages of a conversation. */
  async messages(userId: string, conversationId: string, opts: { take?: number; cursor?: string } = {}) {
    await this.assertParticipant(userId, conversationId);
    return this.prisma.chatMessage.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: Math.min(opts.take ?? 50, 200),
      ...(opts.cursor && { skip: 1, cursor: { id: opts.cursor } }),
    });
  }

  /** Send a new message in an existing conversation. */
  async send(
    userId: string,
    conversationId: string,
    body: string,
    opts: { attachmentUrl?: string; attachmentKind?: string; replyToId?: string } = {},
  ) {
    await this.assertParticipant(userId, conversationId);
    const text = body.trim();
    if (!text && !opts.attachmentUrl) throw new ForbiddenException("Khaali message nahi bhej sakte.");

    const [msg] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          conversationId,
          senderId: userId,
          body: text,
          attachmentUrl: opts.attachmentUrl,
          attachmentKind: opts.attachmentKind,
          replyToId: opts.replyToId,
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ]);
    return msg;
  }

  /** Mark all messages as read for a participant. */
  async markRead(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    return this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });
  }

  // ---- helpers ----

  private async assertParticipant(userId: string, conversationId: string) {
    const part = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!part) throw new NotFoundException("Conversation nahi mili.");
    return part;
  }

  private userSelect() {
    return {
      id: true,
      fullName: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      city: true,
      lastActiveAt: true,
    } as const;
  }
}
