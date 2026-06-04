import { fail, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-server";
import { serializeUser } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401, "UNAUTHENTICATED");
  return ok({ user: serializeUser(user) });
}
