import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/**
 * Lists active users for the Friends page.
 * Query params:
 *   q     — substring search on fullName/username/city
 *   city  — exact city filter
 *   gender — MALE / FEMALE
 *   online — "1" to filter for users active in last 5 minutes
 *   limit  — default 50, max 100
 */
export async function GET(req: Request) {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const city = url.searchParams.get("city")?.trim() || "";
  const gender = url.searchParams.get("gender")?.trim() || "";
  const online = url.searchParams.get("online") === "1";
  const limit = Math.min(
    Math.max(1, Number(url.searchParams.get("limit") || 50)),
    100,
  );

  // Heartbeat the caller while we're at it.
  prisma.user
    .update({ where: { id: sess.uid }, data: { lastActiveAt: new Date() } })
    .catch(() => {});

  const where: Record<string, unknown> = {
    id: { not: sess.uid },
    status: "ACTIVE",
  };
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { username: { contains: q.toLowerCase() } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }
  if (city) where.city = city;
  if (gender === "MALE" || gender === "FEMALE") where.gender = gender;
  if (online) {
    where.lastActiveAt = { gte: new Date(Date.now() - 5 * 60_000) };
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: [{ activityScore: "desc" }, { lastActiveAt: "desc" }],
    take: limit,
    select: {
      id: true,
      fullName: true,
      displayName: true,
      username: true,
      city: true,
      avatarUrl: true,
      gender: true,
      level: true,
      activityScore: true,
      lastActiveAt: true,
    },
  });

  const now = Date.now();
  return ok({
    users: users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      displayName: u.displayName,
      username: u.username,
      city: u.city,
      avatarUrl: u.avatarUrl,
      gender: u.gender,
      level: u.level,
      activityScore: u.activityScore,
      online:
        !!u.lastActiveAt && now - u.lastActiveAt.getTime() < 5 * 60_000,
      lastActiveAt: u.lastActiveAt?.toISOString() ?? null,
    })),
  });
}
