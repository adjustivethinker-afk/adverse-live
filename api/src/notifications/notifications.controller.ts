import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NotificationKind } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() u: { id: string }, @Query("kind") kind?: NotificationKind) {
    return this.notifications.list(u.id, kind);
  }

  @Patch("read-all")
  readAll(@CurrentUser() u: { id: string }) {
    return this.notifications.markAllRead(u.id);
  }

  @Patch(":id/read")
  read(@CurrentUser() u: { id: string }, @Param("id") id: string) {
    return this.notifications.markRead(u.id, id);
  }
}
