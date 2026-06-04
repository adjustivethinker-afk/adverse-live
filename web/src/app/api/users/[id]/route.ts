import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Accept either user id or username so URLs can use either.
  const u = await prisma.user.findFirst({
    where: { OR: [{ id }, { username: id.toLowerCase() }] },
    select: {
      id: true,
      fullName: true,
      displayName: true,
      username: true,
      city: true,
      bio: true,
      avatarUrl: true,
      gender: true,
      level: true,
      xp: true,
      streak: true,
      activityScore: true,
      lastActiveAt: true,
      createdAt: true,
    },
  });
  if (!u) return fail("User not found", 404, "USER_NOT_FOUND");
  return ok({
    user: {
      id: u.id,
      fullName: u.fullName,
      displayName: u.displayName,
      username: u.username,
      city: u.city,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      gender: u.gender,
      level: u.level,
      xp: u.xp,
      streak: u.streak,
      activityScore: u.activityScore,
      lastActiveAt: u.lastActiveAt?.toISOString() ?? null,
      joinedAt: u.createdAt.toISOString(),
    },
  });
}
