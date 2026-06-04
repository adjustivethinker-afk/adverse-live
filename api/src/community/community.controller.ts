import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CommunityService } from "./community.service";

@ApiTags("community")
@Controller("community")
export class CommunityController {
  constructor(private community: CommunityService) {}

  @Get("feed")
  feed() {
    return this.community.feed();
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post("posts")
  create(@CurrentUser() u: { id: string }, @Body() body: { body: string; imageUrl?: string }) {
    return this.community.createPost(u.id, body.body, body.imageUrl);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post("posts/:id/like")
  like(@CurrentUser() u: { id: string }, @Param("id") id: string) {
    return this.community.toggleLike(u.id, id);
  }

  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post("posts/:id/comments")
  comment(@CurrentUser() u: { id: string }, @Param("id") id: string, @Body() body: { body: string; parentId?: string }) {
    return this.community.comment(id, u.id, body.body, body.parentId);
  }
}
