import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: sess.uid },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      question: {
        select: { question: true, category: true, options: true, correctIndex: true },
      },
    },
  });

  return ok({
    attempts: attempts.map((a) => ({
      id: a.id,
      date: a.rewardDay,
      correct: a.correct,
      picked: a.pickedIndex,
      reward: Number(a.rewardAmount ?? 0),
      at: a.createdAt.toISOString(),
      question: a.question.question,
      category: a.question.category,
      options: a.question.options,
      correctIndex: a.question.correctIndex,
    })),
  });
}
