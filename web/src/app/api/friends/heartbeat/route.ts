import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/** Lightweight ping called periodically by the client to flag the user
 *  as "online". Touches lastActiveAt + bumps activity score by 1. */
export async function POST() {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  await prisma.user.update({
    where: { id: sess.uid },
    data: {
      lastActiveAt: new Date(),
      activityScore: { increment: 1 },
    },
  });
  return ok({ heartbeat: new Date().toISOString() });
}
