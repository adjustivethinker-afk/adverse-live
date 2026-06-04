import { Injectable } from "@nestjs/common";
import { NotificationChannel, NotificationKind, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string, kind?: NotificationKind, take = 100) {
    return this.prisma.notification.findMany({
      where: { userId, kind },
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  push(userId: string, opts: {
    kind: NotificationKind;
    channel?: NotificationChannel;
    title: string;
    body?: string;
    url?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.notification.create({
      data: {
        userId,
        kind: opts.kind,
        channel: opts.channel ?? "IN_APP",
        title: opts.title,
        body: opts.body,
        url: opts.url,
        metadata: opts.metadata,
      },
    });
  }
}
