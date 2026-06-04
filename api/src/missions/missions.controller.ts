import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { MissionsService } from "./missions.service";

@ApiTags("missions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("missions")
export class MissionsController {
  constructor(private missions: MissionsService) {}

  @Get("active")
  active(@CurrentUser() u: { id: string }) {
    return this.missions.active(u.id);
  }

  @Post(":id/claim")
  claim(@CurrentUser() u: { id: string }, @Param("id") id: string) {
    return this.missions.claim(u.id, id);
  }
}
