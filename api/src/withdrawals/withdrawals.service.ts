import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { WithdrawalMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";

const MIN_WITHDRAW = 200;

@Injectable()
export class WithdrawalsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}

  async request(userId: string, dto: { method: WithdrawalMethod; amount: number; accountName: string; accountNumber: string }) {
    if (dto.amount < MIN_WITHDRAW) throw new BadRequestException(`Minimum withdrawal is ₨ ${MIN_WITHDRAW}`);
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || Number(wallet.balance) < dto.amount) throw new BadRequestException("Insufficient balance");

    return this.prisma.$transaction(async (tx) => {
      // Hold the balance immediately
      await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: dto.amount }, pending: { increment: dto.amount } },
      });
      const w = await tx.withdrawal.create({
        data: {
          userId,
          method: dto.method,
          amount: dto.amount,
          fee: 0,
          receiveAmount: dto.amount,
          accountName: dto.accountName,
          accountNumber: dto.accountNumber,
        },
      });
      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: "WITHDRAWAL",
          status: "PROCESSING",
          amount: -dto.amount,
          balanceAfter: Number(wallet.balance) - dto.amount,
          description: `Withdrawal request · ${dto.method}`,
          referenceId: w.id,
        },
      });
      return w;
    });
  }

  list(userId: string) {
    return this.prisma.withdrawal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  // Admin
  async complete(adminId: string, id: string, externalRef?: string) {
    const w = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!w) throw new NotFoundException();
    if (w.status !== "PENDING" && w.status !== "PROCESSING") throw new BadRequestException();

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId: w.userId },
        data: { pending: { decrement: w.amount } },
      });
      await tx.withdrawal.update({
        where: { id },
        data: { status: "COMPLETED", externalRef, reviewerId: adminId, reviewedAt: new Date() },
      });
      await tx.transaction.create({
        data: {
          userId: w.userId,
          walletId: wallet.id,
          type: "WITHDRAWAL",
          status: "COMPLETED",
          amount: 0,
          balanceAfter: wallet.balance,
          description: `Withdrawal completed · ${w.method}`,
          referenceId: w.id,
          externalRef,
        },
      });
      return { ok: true };
    });
  }

  async reject(adminId: string, id: string, reason?: string) {
    const w = await this.prisma.withdrawal.findUnique({ where: { id } });
    if (!w) throw new NotFoundException();
    return this.prisma.$transaction(async (tx) => {
      // Refund balance
      await tx.wallet.update({
        where: { userId: w.userId },
        data: { pending: { decrement: w.amount }, balance: { increment: w.amount } },
      });
      await tx.withdrawal.update({
        where: { id },
        data: { status: "REJECTED", reviewerId: adminId, reviewedAt: new Date(), rejectionReason: reason },
      });
      return { ok: true };
    });
  }
}
