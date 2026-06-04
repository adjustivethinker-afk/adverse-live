import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import { DepositsService } from "../deposits/deposits.service";
import { WithdrawalsService } from "../withdrawals/withdrawals.service";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private admin: AdminService,
    private deposits: DepositsService,
    private withdrawals: WithdrawalsService,
  ) {}

  @Get("overview")
  overview() {
    return this.admin.overview();
  }

  @Get("users")
  users(
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("take") take?: string,
  ) {
    return this.admin.listUsers({ search, status, take: take ? +take : undefined });
  }

  @Patch("users/:id/status")
  setStatus(
    @CurrentUser() admin: { id: string },
    @Param("id") id: string,
    @Body() body: { status: "ACTIVE" | "SUSPENDED" | "BANNED" },
  ) {
    return this.admin.setUserStatus(admin.id, id, body.status);
  }

  @Get("fraud")
  fraud() {
    return this.admin.listFraud();
  }

  // Deposits
  @Post("deposits/:id/approve")
  approveDeposit(@CurrentUser() admin: { id: string }, @Param("id") id: string) {
    return this.deposits.approve(admin.id, id);
  }

  @Post("deposits/:id/reject")
  rejectDeposit(@CurrentUser() admin: { id: string }, @Param("id") id: string, @Body() body: { reason?: string }) {
    return this.deposits.reject(admin.id, id, body.reason);
  }

  // Withdrawals
  @Post("withdrawals/:id/complete")
  completeWithdrawal(@CurrentUser() admin: { id: string }, @Param("id") id: string, @Body() body: { externalRef?: string }) {
    return this.withdrawals.complete(admin.id, id, body.externalRef);
  }

  @Post("withdrawals/:id/reject")
  rejectWithdrawal(@CurrentUser() admin: { id: string }, @Param("id") id: string, @Body() body: { reason?: string }) {
    return this.withdrawals.reject(admin.id, id, body.reason);
  }
}
