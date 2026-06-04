import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { WithdrawalsService } from "./withdrawals.service";

@ApiTags("withdrawals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("withdrawals")
export class WithdrawalsController {
  constructor(private withdrawals: WithdrawalsService) {}

  @Post()
  request(@CurrentUser() u: { id: string }, @Body() dto: any) {
    return this.withdrawals.request(u.id, dto);
  }

  @Get()
  list(@CurrentUser() u: { id: string }) {
    return this.withdrawals.list(u.id);
  }
}
