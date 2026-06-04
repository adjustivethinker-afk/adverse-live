import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
    if (!u) throw new NotFoundException();
    const { password, totpSecret, ...safe } = u as any;
    return safe;
  }

  async getByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, fullName: true, displayName: true, bio: true,
        avatarUrl: true, coverUrl: true, level: true, city: true, gender: true,
        lastActiveAt: true, activityScore: true, isVip: true,
        createdAt: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      coverUrl?: string;
      city?: string;
    },
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }

  leaderboard(period: "weekly" | "alltime") {
    if (period === "alltime") {
      return this.prisma.user.findMany({
        orderBy: { wallet: { totalEarned: "desc" } },
        take: 100,
        select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true, level: true, city: true, wallet: { select: { totalEarned: true } } },
      });
    }
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    return this.prisma.transaction.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: since },
        type: {
          in: [
            "QUIZ_REWARD",
            "REFERRAL_COMMISSION_L1",
            "REFERRAL_COMMISSION_L2",
            "REFERRAL_COMMISSION_L3",
            "VOICE_GIFT_RECEIVED",
            "STREAK_BONUS",
            "MISSION_REWARD",
          ],
        },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 100,
    });
  }
}
