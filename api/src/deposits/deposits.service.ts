import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DepositMethod } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
export class DepositsService {
  constructor(private prisma: PrismaService, private wallet: WalletService) {}

  create(userId: string, dto: { method: DepositMethod; amount: number; txnRef: string; receiptUrl?: string; note?: string }) {
    if (dto.amount < 500) throw new BadRequestException("Minimum deposit is ₨ 500");
    return this.prisma.deposit.create({
      data: { userId, method: dto.method, amount: dto.amount, txnRef: dto.txnRef, receiptUrl: dto.receiptUrl, note: dto.note },
    });
  }

  list(userId: string) {
    return this.prisma.deposit.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  // Admin
  async approve(adminId: string, depositId: string) {
    const deposit = await this.prisma.deposit.findUnique({ where: { id: depositId } });
    if (!deposit) throw new NotFoundException();
    if (deposit.status !== "PENDING") throw new BadRequestException("Already reviewed");
    await this.prisma.deposit.update({
      where: { id: depositId },
      data: { status: "APPROVED", reviewerId: adminId, reviewedAt: new Date() },
    });
    await this.wallet.post(deposit.userId, "DEPOSIT", Number(deposit.amount), {
      description: `Deposit · ${deposit.method}`,
      referenceId: deposit.id,
      externalRef: deposit.txnRef,
    });
    return { ok: true };
  }

  async reject(adminId: string, depositId: string, reason?: string) {
    return this.prisma.deposit.update({
      where: { id: depositId },
      data: { status: "REJECTED", reviewerId: adminId, reviewedAt: new Date(), rejectionReason: reason },
    });
  }
}
