import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
export class VoiceRoomsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}

  list(opts: { category?: string; search?: string; trending?: boolean; featured?: boolean; take?: number }) {
    return this.prisma.voiceRoom.findMany({
      where: {
        status: "LIVE",
        category: opts.category,
        title: opts.search ? { contains: opts.search, mode: "insensitive" } : undefined,
        isFeatured: opts.featured,
      },
      orderBy: opts.featured ? [{ isFeatured: "desc" }] : [{ startedAt: "desc" }],
      take: opts.take ?? 30,
      include: { host: { select: { id: true, displayName: true, avatarUrl: true } }, _count: { select: { participants: true } } },
    });
  }

  async create(hostId: string, input: { title: string; description?: string; category?: string; tags?: string[]; visibility?: "PUBLIC" | "PRIVATE" | "PASSWORD"; password?: string }) {
    const passwordHash = input.password ? await argon2.hash(input.password) : null;
    return this.prisma.voiceRoom.create({
      data: {
        hostId,
        title: input.title,
        description: input.description,
        category: input.category,
        tags: input.tags ?? [],
        visibility: input.visibility ?? "PUBLIC",
        passwordHash,
        rtcRoomId: uuid(),
        status: "LIVE",
        startedAt: new Date(),
        participants: { create: { userId: hostId, role: "HOST" } },
      },
    });
  }

  async join(roomId: string, userId: string, password?: string) {
    const room = await this.prisma.voiceRoom.findUnique({ where: { id: roomId } });
    if (!room || room.status !== "LIVE") throw new NotFoundException();
    if (room.visibility === "PASSWORD") {
      if (!password || !room.passwordHash || !(await argon2.verify(room.passwordHash, password))) {
        throw new ForbiddenException("Wrong password");
      }
    }
    return this.prisma.roomParticipant.upsert({
      where: { roomId_userId: { roomId, userId } },
      create: { roomId, userId, role: "LISTENER" },
      update: { leftAt: null },
    });
  }

  async leave(roomId: string, userId: string) {
    return this.prisma.roomParticipant.update({
      where: { roomId_userId: { roomId, userId } },
      data: { leftAt: new Date() },
    });
  }

  async sendMessage(roomId: string, userId: string, body: string) {
    const part = await this.prisma.roomParticipant.findUnique({ where: { roomId_userId: { roomId, userId } } });
    if (!part) throw new ForbiddenException("Not in room");
    return this.prisma.roomMessage.create({ data: { roomId, userId, body } });
  }

  async sendGift(roomId: string, fromUserId: string, toUserId: string, giftCode: string, amount: number) {
    if (amount <= 0) throw new BadRequestException("Invalid amount");
    return this.prisma.$transaction(async (tx) => {
      // Check sender balance
      const wallet = await tx.wallet.findUnique({ where: { userId: fromUserId } });
      if (!wallet || Number(wallet.balance) < amount) throw new BadRequestException("Insufficient balance");

      // Debit sender
      await tx.wallet.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount }, totalSpent: { increment: amount } },
      });
      await tx.transaction.create({
        data: { userId: fromUserId, walletId: wallet.id, type: "VOICE_GIFT_SENT", status: "COMPLETED", amount: -amount, balanceAfter: Number(wallet.balance) - amount, description: `Gift sent · ${giftCode}` },
      });
      // Credit receiver
      const rWallet = await tx.wallet.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount }, totalEarned: { increment: amount } },
      });
      await tx.transaction.create({
        data: { userId: toUserId, walletId: rWallet.id, type: "VOICE_GIFT_RECEIVED", status: "COMPLETED", amount, balanceAfter: rWallet.balance, description: `Gift received · ${giftCode}` },
      });
      return tx.voiceGift.create({ data: { roomId, fromUserId, toUserId, giftCode, amount } });
    });
  }

  async end(roomId: string, hostId: string) {
    const room = await this.prisma.voiceRoom.findUnique({ where: { id: roomId } });
    if (!room || room.hostId !== hostId) throw new ForbiddenException();
    return this.prisma.voiceRoom.update({
      where: { id: roomId },
      data: { status: "ENDED", endedAt: new Date() },
    });
  }
}
