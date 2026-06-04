import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}

  active(userId: string) {
    return this.prisma.userMission.findMany({
      where: { userId, status: "ACTIVE" },
      include: { mission: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async claim(userId: string, userMissionId: string) {
    const um = await this.prisma.userMission.findUnique({
      where: { id: userMissionId },
      include: { mission: true },
    });
    if (!um || um.userId !== userId) throw new NotFoundException();
    if (um.status !== "COMPLETED") throw new BadRequestException("Not completed");

    if (Number(um.mission.rewardCash) > 0) {
      await this.wallet.post(userId, "MISSION_REWARD", Number(um.mission.rewardCash), {
        description: `Mission · ${um.mission.title}`,
        referenceId: um.id,
      });
    }
    if (um.mission.rewardXp > 0) {
      await this.prisma.user.update({ where: { id: userId }, data: { xp: { increment: um.mission.rewardXp } } });
    }
    return this.prisma.userMission.update({
      where: { id: um.id },
      data: { status: "CLAIMED", claimedAt: new Date() },
    });
  }
}
