import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "up";
  } catch {
    dbStatus = "down";
  }
  return Response.json({
    status: dbStatus === "up" ? "ok" : "degraded",
    db: dbStatus,
    now: new Date().toISOString(),
  });
}
