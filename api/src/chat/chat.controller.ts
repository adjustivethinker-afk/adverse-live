import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send.dto";
import { OpenDmDto } from "./dto/open-dm.dto";

@ApiTags("chat")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("chat")
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get("conversations")
  @ApiOperation({ summary: "Apni saari conversations" })
  list(@CurrentUser() user: { id: string }) {
    return this.chat.list(user.id);
  }

  @Post("conversations")
  @ApiOperation({ summary: "Kisi user se DM open ya create karein" })
  open(@CurrentUser() user: { id: string }, @Body() dto: OpenDmDto) {
    return this.chat.getOrCreateDM(user.id, dto.userId);
  }

  @Get("conversations/:id/messages")
  messages(
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
    @Query("cursor") cursor?: string,
    @Query("take") take?: string,
  ) {
    return this.chat.messages(user.id, id, {
      cursor,
      take: take ? Number(take) : undefined,
    });
  }

  @Post("conversations/:id/messages")
  send(@CurrentUser() user: { id: string }, @Param("id") id: string, @Body() dto: SendMessageDto) {
    return this.chat.send(user.id, id, dto.body, {
      attachmentUrl: dto.attachmentUrl,
      attachmentKind: dto.attachmentKind,
      replyToId: dto.replyToId,
    });
  }

  @Post("conversations/:id/read")
  markRead(@CurrentUser() user: { id: string }, @Param("id") id: string) {
    return this.chat.markRead(user.id, id);
  }
}
