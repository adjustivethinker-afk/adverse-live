import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [users, liveRooms, todayRevenue, openTickets, pendingDeposits, pendingWithdrawals, fraudCount] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.voiceRoom.count({ where: { status: "LIVE" } }),
        this.prisma.transaction.aggregate({
          where: { createdAt: { gte: startOfToday() }, type: { in: ["QUIZ_REWARD", "DEPOSIT", "VOICE_GIFT_RECEIVED"] } },
          _sum: { amount: true },
        }),
        this.prisma.report.count({ where: { status: "OPEN" } }),
        this.prisma.deposit.count({ where: { status: "PENDING" } }),
        this.prisma.withdrawal.count({ where: { status: { in: ["PENDING","PROCESSING"] } } }),
        this.prisma.fraudSignal.count({ where: { resolved: false, severity: { in: ["HIGH","CRITICAL"] } } }),
      ]);

    return {
      users,
      liveRooms,
      todayRevenue: todayRevenue._sum.amount ?? 0,
      openTickets,
      pendingDeposits,
      pendingWithdrawals,
      fraudCount,
    };
  }

  listUsers(opts: { search?: string; status?: string; take?: number }) {
    return this.prisma.user.findMany({
      where: {
        ...(opts.search && {
          OR: [
            { email: { contains: opts.search, mode: "insensitive" } },
            { displayName: { contains: opts.search, mode: "insensitive" } },
            { username: { contains: opts.search, mode: "insensitive" } },
          ],
        }),
        ...(opts.status && opts.status !== "all" && { status: opts.status as any }),
      },
      take: opts.take ?? 50,
      include: { wallet: true },
      orderBy: { createdAt: "desc" },
    });
  }

  setUserStatus(adminId: string, userId: string, status: "ACTIVE" | "SUSPENDED" | "BANNED") {
    return this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { status } }),
      this.prisma.auditLog.create({
        data: { actorId: adminId, userId, action: "USER_STATUS_CHANGE", entity: "User", entityId: userId, data: { status } },
      }),
    ]);
  }

  listFraud() {
    return this.prisma.fraudSignal.findMany({
      where: { resolved: false },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
  }
}

function startOfToday() {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}
