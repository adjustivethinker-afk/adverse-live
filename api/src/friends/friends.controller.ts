import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Gender } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { FriendsService } from "./friends.service";

@ApiTags("friends")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("friends")
export class FriendsController {
  constructor(private friends: FriendsService) {}

  @Get()
  @ApiOperation({ summary: "Saare active users — most active sab se top par" })
  list(
    @CurrentUser() user: { id: string },
    @Query("city") city?: string,
    @Query("gender") gender?: Gender,
    @Query("online") online?: string,
    @Query("q") q?: string,
    @Query("take") take?: string,
    @Query("cursor") cursor?: string,
  ) {
    return this.friends.listActive({
      excludeUserId: user.id,
      city,
      gender,
      onlineOnly: online === "true",
      search: q,
      take: take ? Number(take) : undefined,
      cursor,
    });
  }

  @Post("heartbeat")
  @ApiOperation({ summary: "User active hai — call from app open / activity events" })
  heartbeat(@CurrentUser() user: { id: string }) {
    return this.friends.heartbeat(user.id);
  }
}
