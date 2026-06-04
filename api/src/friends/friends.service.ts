import { Injectable } from "@nestjs/common";
import { Gender, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  /**
   * List all platform users sorted by activity (most active first).
   * The "Friends" page is essentially a discovery surface — anyone can see
   * anyone, but new + old users mix together; ranking is by activity, not signup time.
   */
  async listActive(opts: {
    excludeUserId?: string;
    city?: string;
    gender?: Gender;
    onlineOnly?: boolean;
    search?: string;
    take?: number;
    cursor?: string;
  } = {}) {
    const where: Prisma.UserWhereInput = {
      status: "ACTIVE",
      country: "PK",
      ...(opts.excludeUserId && { NOT: { id: opts.excludeUserId } }),
      ...(opts.city && opts.city !== "All" && { city: opts.city }),
      ...(opts.gender && { gender: opts.gender }),
      ...(opts.onlineOnly && {
        lastActiveAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // active in last 5 min
      }),
      ...(opts.search && {
        OR: [
          { fullName: { contains: opts.search, mode: "insensitive" } },
          { username: { contains: opts.search, mode: "insensitive" } },
          { city: { contains: opts.search, mode: "insensitive" } },
        ],
      }),
    };

    return this.prisma.user.findMany({
      where,
      orderBy: [{ activityScore: "desc" }, { lastActiveAt: "desc" }, { createdAt: "desc" }],
      take: Math.min(opts.take ?? 60, 200),
      ...(opts.cursor && { skip: 1, cursor: { id: opts.cursor } }),
      select: {
        id: true,
        fullName: true,
        displayName: true,
        username: true,
        avatarUrl: true,
        city: true,
        gender: true,
        level: true,
        bio: true,
        lastActiveAt: true,
        activityScore: true,
        isVip: true,
      },
    });
  }

  /**
   * Mark a user active right now and bump their activity score by 1.
   * Should be called from key actions: open app, send message, join room.
   */
  async heartbeat(userId: string, scoreDelta = 1) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lastActiveAt: new Date(),
        activityScore: { increment: scoreDelta },
      },
      select: { id: true, lastActiveAt: true, activityScore: true },
    });
  }
}
