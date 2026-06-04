import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() u: { id: string }) {
    return this.users.getById(u.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(@CurrentUser() u: { id: string }, @Body() dto: any) {
    return this.users.update(u.id, dto);
  }

  @Get("leaderboard")
  leaderboard(@Query("period") period: "weekly" | "alltime" = "weekly") {
    return this.users.leaderboard(period);
  }

  @Get(":username")
  byUsername(@Param("username") username: string) {
    return this.users.getByUsername(username);
  }
}
