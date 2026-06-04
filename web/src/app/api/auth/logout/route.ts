import { ok } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return ok({ loggedOut: true });
}
