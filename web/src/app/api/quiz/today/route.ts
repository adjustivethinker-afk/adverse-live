import { prisma } from "@/lib/db";
import { dayKey, fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/**
 * Returns the question for today, deterministically picked per user
 * so the experience is stable even if they refresh.
 *
 * Response also tells the client whether they've already attempted today
 * (and the next reset time) so the UI can render the cooldown card.
 */
export async function GET() {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  const today = dayKey();
  const userId = sess.uid;

  const existing = await prisma.quizAttempt.findUnique({
    where: { userId_rewardDay: { userId, rewardDay: today } },
    include: { question: true },
  });
  if (existing) {
    const nextResetAt = new Date(
      new Date(existing.createdAt).getTime() + 24 * 3600_000,
    );
    return ok({
      attempted: true,
      attempt: {
        questionId: existing.questionId,
        picked: existing.pickedIndex,
        correct: existing.correct,
        reward: Number(existing.rewardAmount ?? 0),
        at: existing.createdAt.toISOString(),
      },
      question: {
        id: existing.question.id,
        category: existing.question.category,
        question: existing.question.question,
        options: existing.question.options,
        correctIndex: existing.question.correctIndex,
        explanation: existing.question.explanation,
      },
      nextResetAt: nextResetAt.toISOString(),
    });
  }

  // Pick a question deterministically: stable per (user, day).
  const questions = await prisma.quizQuestion.findMany({
    where: { active: true },
    select: { id: true },
    orderBy: { id: "asc" },
  });
  if (questions.length === 0) {
    return fail("Abhi questions ready nahi", 503, "NO_QUESTIONS");
  }
  // Tiny string hash → index. Stable + portable.
  const seed = `${userId}:${today}`;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  const idx = h % questions.length;
  const picked = await prisma.quizQuestion.findUnique({
    where: { id: questions[idx].id },
  });
  if (!picked) return fail("Question load nahi hua", 500);

  return ok({
    attempted: false,
    question: {
      id: picked.id,
      category: picked.category,
      question: picked.question,
      options: picked.options,
      // correctIndex deliberately omitted before submit
    },
  });
}
