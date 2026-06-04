import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { DepositsService } from "./deposits.service";

@ApiTags("deposits")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("deposits")
export class DepositsController {
  constructor(private deposits: DepositsService) {}

  @Post()
  create(@CurrentUser() u: { id: string }, @Body() dto: any) {
    return this.deposits.create(u.id, dto);
  }

  @Get()
  list(@CurrentUser() u: { id: string }) {
    return this.deposits.list(u.id);
  }
}
