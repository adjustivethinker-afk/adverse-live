import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { dayKey, fail, ok } from "@/lib/api";
import { getSession } from "@/lib/auth-server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const SubmitSchema = z.object({
  questionId: z.string().min(1),
  pickedIndex: z.number().int().min(0).max(10),
});

const DEFAULT_REWARD = 30; // PKR — matches Setting "platform.dailyQuizReward"
const REFERRAL_RATES = { l1: 0.1, l2: 0.05, l3: 0.02 };

async function getReward(): Promise<number> {
  const s = await prisma.setting.findUnique({ where: { key: "platform" } });
  if (s && typeof s.value === "object" && s.value) {
    const v = s.value as Record<string, unknown>;
    if (typeof v.dailyQuizReward === "number") return v.dailyQuizReward;
  }
  return DEFAULT_REWARD;
}

export async function POST(req: NextRequest) {
  const sess = await getSession();
  if (!sess) return fail("Login required", 401, "UNAUTHENTICATED");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed", 400, "VALIDATION");

  const { questionId, pickedIndex } = parsed.data;
  const userId = sess.uid;
  const today = dayKey();

  // 1) Hard cooldown — DB unique constraint on (userId, rewardDay)
  const existing = await prisma.quizAttempt.findUnique({
    where: { userId_rewardDay: { userId, rewardDay: today } },
  });
  if (existing) {
    return fail(
      "Aaj ka quiz already complete ho chuka. Kal phir try karein.",
      409,
      "ALREADY_ATTEMPTED",
    );
  }

  // 2) Load the question to grade against the *server* answer key.
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
  });
  if (!question || !question.active) {
    return fail("Question not found", 404, "QUESTION_MISSING");
  }
  if (pickedIndex >= question.options.length) {
    return fail("Invalid option", 400, "BAD_OPTION");
  }

  const correct = pickedIndex === question.correctIndex;
  const reward = correct ? await getReward() : 0;

  // 3) Atomic write: attempt + (optional) wallet credit + transaction +
  //    XP/streak bump. Use $transaction so we never half-credit.
  const txResult = await prisma.$transaction(async (tx) => {
    const attempt = await tx.quizAttempt.create({
      data: {
        userId,
        questionId,
        pickedIndex,
        correct,
        rewardAmount: reward,
        rewardDay: today,
      },
    });

    let newBalance = 0;
    let newXp = 0;
    let newLevel = 1;
    let newStreak = 0;

    if (correct) {
      // Wallet credit
      const wallet = await tx.wallet.upsert({
        where: { userId },
        update: {
          balance: { increment: reward },
          totalEarned: { increment: reward },
        },
        create: { userId, balance: reward, totalEarned: reward },
      });
      newBalance = Number(wallet.balance);

      await tx.transaction.create({
        data: {
          userId,
          walletId: wallet.id,
          type: "QUIZ_REWARD",
          status: "COMPLETED",
          amount: reward,
          balanceAfter: wallet.balance,
          description: `Quiz reward — ${question.category}`,
          referenceId: attempt.id,
        },
      });

      // XP, streak, activity
      const xpGain = 20;
      const u = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { xp: true, streak: true, streakLastAt: true },
      });
      const lastDay = u.streakLastAt
        ? u.streakLastAt.toISOString().slice(0, 10)
        : null;
      const yesterday = new Date(Date.now() - 86_400_000)
        .toISOString()
        .slice(0, 10);
      const continued = lastDay === yesterday || lastDay === today;
      newStreak = continued ? u.streak + (lastDay === today ? 0 : 1) : 1;
      newXp = u.xp + xpGain;
      newLevel = 1 + Math.floor(newXp / 200);

      await tx.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          streakLastAt: new Date(),
          activityScore: { increment: 5 },
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Even on a wrong answer we mark them as active.
      await tx.user.update({
        where: { id: userId },
        data: {
          lastActiveAt: new Date(),
          activityScore: { increment: 1 },
        },
      });
    }

    return { attempt, reward, newBalance, newXp, newLevel, newStreak };
  });

  // 4) Pay referral commissions outside the main tx so a failure here
  //    doesn't roll back the user's quiz reward. Best-effort.
  if (correct && reward > 0) {
    void payReferralCommissions(userId, reward).catch(() => {});
  }

  return ok({
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    reward,
    balance: txResult.newBalance,
    xp: txResult.newXp,
    level: txResult.newLevel,
    streak: txResult.newStreak,
  });
}

async function payReferralCommissions(childId: string, baseAmount: number) {
  // Walk up to 3 levels and pay rates 10% / 5% / 2%.
  const levels: Array<{
    rate: number;
    type:
      | "REFERRAL_COMMISSION_L1"
      | "REFERRAL_COMMISSION_L2"
      | "REFERRAL_COMMISSION_L3";
  }> = [
    { rate: REFERRAL_RATES.l1, type: "REFERRAL_COMMISSION_L1" },
    { rate: REFERRAL_RATES.l2, type: "REFERRAL_COMMISSION_L2" },
    { rate: REFERRAL_RATES.l3, type: "REFERRAL_COMMISSION_L3" },
  ];

  let cursor: string | null = childId;
  for (const lvl of levels) {
    if (!cursor) break;
    const c: { referredById: string | null } | null =
      await prisma.user.findUnique({
        where: { id: cursor },
        select: { referredById: true },
      });
    const parentId: string | null = c?.referredById ?? null;
    if (!parentId) break;
    const amount = new Prisma.Decimal(baseAmount * lvl.rate);
    if (amount.lessThanOrEqualTo(0)) {
      cursor = parentId;
      continue;
    }
    await prisma.$transaction(async (tx) => {
      const w = await tx.wallet.upsert({
        where: { userId: parentId },
        update: {
          balance: { increment: amount },
          totalEarned: { increment: amount },
        },
        create: {
          userId: parentId,
          balance: amount,
          totalEarned: amount,
        },
      });
      await tx.transaction.create({
        data: {
          userId: parentId,
          walletId: w.id,
          type: lvl.type,
          status: "COMPLETED",
          amount,
          balanceAfter: w.balance,
          description: `Team commission (${(lvl.rate * 100).toFixed(0)}%)`,
          referenceId: childId,
        },
      });
    });
    cursor = parentId;
  }
}
