import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  feed(take = 30) {
    return this.prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true, level: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  createPost(authorId: string, body: string, imageUrl?: string) {
    return this.prisma.post.create({ data: { authorId, body, imageUrl } });
  }

  toggleLike(userId: string, postId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.postLike.findUnique({ where: { postId_userId: { postId, userId } } });
      if (existing) {
        await tx.postLike.delete({ where: { id: existing.id } });
        return { liked: false };
      }
      await tx.postLike.create({ data: { postId, userId } });
      return { liked: true };
    });
  }

  comment(postId: string, authorId: string, body: string, parentId?: string) {
    return this.prisma.comment.create({ data: { postId, authorId, body, parentId } });
  }
}
