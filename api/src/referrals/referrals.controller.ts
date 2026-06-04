import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ReferralsService } from "./referrals.service";

@ApiTags("referrals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("referrals")
export class ReferralsController {
  constructor(private referrals: ReferralsService) {}

  @Get("tree")
  tree(@CurrentUser() u: { id: string }) {
    return this.referrals.tree(u.id);
  }

  @Get("stats")
  stats(@CurrentUser() u: { id: string }) {
    return this.referrals.stats(u.id);
  }

  @Get("top")
  top(@Query("period") period: "weekly" | "alltime" = "weekly") {
    return this.referrals.topReferrers(period);
  }
}
