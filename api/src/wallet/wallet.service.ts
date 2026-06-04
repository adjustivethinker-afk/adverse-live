import { Injectable } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getMine(userId: string) {
    return this.prisma.wallet.findUnique({ where: { userId } });
  }

  async listTransactions(userId: string, opts: { type?: TransactionType; cursor?: string; take?: number } = {}) {
    return this.prisma.transaction.findMany({
      where: { userId, type: opts.type },
      orderBy: { createdAt: "desc" },
      take: Math.min(opts.take ?? 50, 200),
      ...(opts.cursor && { skip: 1, cursor: { id: opts.cursor } }),
    });
  }

  /** Atomic credit/debit. Use this everywhere money moves. */
  async post(
    userId: string,
    type: TransactionType,
    amount: number,
    opts: {
      description?: string;
      referenceId?: string;
      metadata?: Prisma.InputJsonValue;
      externalRef?: string;
    } = {},
  ) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: amount >= 0
          ? { balance: { increment: amount }, totalEarned: { increment: amount } }
          : { balance: { decrement: -amount }, totalSpent: { increment: -amount } },
      });
      const txn = await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type,
          status: "COMPLETED",
          amount,
          balanceAfter: wallet.balance,
          description: opts.description,
          referenceId: opts.referenceId,
          metadata: opts.metadata,
          externalRef: opts.externalRef,
        },
      });
      return { wallet, transaction: txn };
    });
  }

  async stats(userId: string) {
    const since = (days: number) => new Date(Date.now() - days * 86400_000);
    const [wallet, today, week, month] = await Promise.all([
      this.prisma.wallet.findUnique({ where: { userId } }),
      this.prisma.transaction.aggregate({
        where: { userId, createdAt: { gte: since(1) } },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, createdAt: { gte: since(7) } },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, createdAt: { gte: since(30) } },
        _sum: { amount: true },
      }),
    ]);
    return {
      balance: wallet?.balance ?? 0,
      today: today._sum.amount ?? 0,
      week: week._sum.amount ?? 0,
      month: month._sum.amount ?? 0,
    };
  }
}
