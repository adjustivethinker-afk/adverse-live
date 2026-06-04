import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  const [wallet, txs] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: sess.uid } }),
    prisma.transaction.findMany({
      where: { userId: sess.uid },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        description: true,
        createdAt: true,
      },
    }),
  ]);

  return ok({
    balance: Number(wallet?.balance ?? 0),
    pending: Number(wallet?.pending ?? 0),
    totalEarned: Number(wallet?.totalEarned ?? 0),
    transactions: txs.map((t) => ({
      id: t.id,
      type: t.type,
      status: t.status,
      amount: Number(t.amount),
      note: t.description,
      at: t.createdAt.toISOString(),
    })),
  });
}
