import { Injectable } from "@nestjs/common";
import { TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";

const TYPE_BY_LEVEL: Record<number, TransactionType> = {
  1: "REFERRAL_COMMISSION_L1",
  2: "REFERRAL_COMMISSION_L2",
  3: "REFERRAL_COMMISSION_L3",
};

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}

  async payCommissions(childId: string, baseAmount: number, refId?: string) {
    const ancestors = await this.prisma.referral.findMany({
      where: { childId },
    });
    for (const r of ancestors) {
      const commission = +(baseAmount * Number(r.rate)).toFixed(2);
      if (commission <= 0) continue;
      await this.wallet.post(r.parentId, TYPE_BY_LEVEL[r.level], commission, {
        description: `Referral L${r.level} commission`,
        referenceId: refId,
        metadata: { childId, baseAmount, rate: Number(r.rate) },
      });
      await this.prisma.referral.update({
        where: { id: r.id },
        data: { totalEarned: { increment: commission } },
      });
    }
  }

  async tree(userId: string) {
    const l1 = await this.prisma.user.findMany({
      where: { referredById: userId },
      select: { id: true, displayName: true, avatarUrl: true, createdAt: true, isVip: true },
    });
    const l1Ids = l1.map((u) => u.id);
    const l2 = await this.prisma.user.findMany({
      where: { referredById: { in: l1Ids } },
      select: { id: true, displayName: true, avatarUrl: true, createdAt: true, referredById: true, isVip: true },
    });
    return { l1, l2 };
  }

  async stats(userId: string) {
    const [l1, l2, l3, totalEarned] = await Promise.all([
      this.prisma.referral.count({ where: { parentId: userId, level: 1 } }),
      this.prisma.referral.count({ where: { parentId: userId, level: 2 } }),
      this.prisma.referral.count({ where: { parentId: userId, level: 3 } }),
      this.prisma.referral.aggregate({ where: { parentId: userId }, _sum: { totalEarned: true } }),
    ]);
    return {
      l1, l2, l3,
      totalEarned: totalEarned._sum.totalEarned ?? 0,
    };
  }

  topReferrers(period: "weekly" | "alltime" = "weekly") {
    if (period === "alltime") {
      return this.prisma.user.findMany({
        orderBy: { l1ReferralRows: { _count: "desc" } },
        take: 50,
        select: { id: true, displayName: true, avatarUrl: true, _count: { select: { l1ReferralRows: true } } },
      });
    }
    const since = new Date(Date.now() - 7 * 86400_000);
    return this.prisma.referral.groupBy({
      by: ["parentId"],
      where: { createdAt: { gte: since } },
      _sum: { totalEarned: true },
      _count: { _all: true },
      orderBy: { _sum: { totalEarned: "desc" } },
      take: 50,
    });
  }
}
