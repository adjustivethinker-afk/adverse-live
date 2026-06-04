import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { VoiceRoomsService } from "./voice-rooms.service";

@ApiTags("voice-rooms")
@Controller("voice-rooms")
export class VoiceRoomsController {
  constructor(private rooms: VoiceRoomsService) {}

  @Get()
  list(
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("featured") featured?: string,
  ) {
    return this.rooms.list({ category, search, featured: featured === "1" });
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() u: { id: string }, @Body() dto: any) {
    return this.rooms.create(u.id, dto);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post(":id/join")
  join(@CurrentUser() u: { id: string }, @Param("id") id: string, @Body() body: { password?: string } = {}) {
    return this.rooms.join(id, u.id, body.password);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post(":id/leave")
  leave(@CurrentUser() u: { id: string }, @Param("id") id: string) {
    return this.rooms.leave(id, u.id);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post(":id/messages")
  message(@CurrentUser() u: { id: string }, @Param("id") id: string, @Body() body: { body: string }) {
    return this.rooms.sendMessage(id, u.id, body.body);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post(":id/gifts")
  gift(
    @CurrentUser() u: { id: string },
    @Param("id") id: string,
    @Body() body: { toUserId: string; giftCode: string; amount: number },
  ) {
    return this.rooms.sendGift(id, u.id, body.toUserId, body.giftCode, body.amount);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post(":id/end")
  end(@CurrentUser() u: { id: string }, @Param("id") id: string) {
    return this.rooms.end(id, u.id);
  }
}
