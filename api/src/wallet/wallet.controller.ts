import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { WalletService } from "./wallet.service";

@ApiTags("wallet")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wallet")
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  mine(@CurrentUser() u: { id: string }) {
    return this.wallet.getMine(u.id);
  }

  @Get("stats")
  stats(@CurrentUser() u: { id: string }) {
    return this.wallet.stats(u.id);
  }

  @Get("transactions")
  list(
    @CurrentUser() u: { id: string },
    @Query("type") type?: TransactionType,
    @Query("cursor") cursor?: string,
    @Query("take") take?: string,
  ) {
    return this.wallet.listTransactions(u.id, { type, cursor, take: take ? +take : undefined });
  }
}
