import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";
import { ReferralsService } from "../referrals/referrals.service";

const DAILY_REWARD = 30; // PKR — keep in sync with /web/src/app/(app)/quiz/page.tsx

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private referrals: ReferralsService,
  ) {}

  /** Today's date as YYYY-MM-DD in Asia/Karachi. */
  private todayKey(): string {
    const d = new Date();
    // Use UTC + 5h offset (Pakistan = UTC+5, no DST)
    const pk = new Date(d.getTime() + 5 * 3600 * 1000);
    return `${pk.getUTCFullYear()}-${String(pk.getUTCMonth() + 1).padStart(2, "0")}-${String(pk.getUTCDate()).padStart(2, "0")}`;
  }

  /** Pick a deterministic question for (user, day) so refresh can't change it. */
  async getDailyQuestion(userId: string) {
    const day = this.todayKey();

    // If user has already attempted today, return that question + result.
    const existing = await this.prisma.quizAttempt.findUnique({
      where: { userId_rewardDay: { userId, rewardDay: day } },
      include: { question: true },
    });
    if (existing) {
      return {
        question: this.publicQuestion(existing.question),
        attempt: {
          pickedIndex: existing.pickedIndex,
          correct: existing.correct,
          rewardAmount: existing.rewardAmount?.toString() ?? null,
          createdAt: existing.createdAt,
        },
        nextAvailableAt: this.nextAvailableAt(existing.createdAt),
      };
    }

    // Otherwise pick a random active question (deterministic by user+day).
    const total = await this.prisma.quizQuestion.count({ where: { active: true } });
    if (total === 0) throw new NotFoundException("Koi quiz available nahi hai.");
    const seed = hash(`${userId}::${day}`);
    const skip = seed % total;
    const [q] = await this.prisma.quizQuestion.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
      skip,
      take: 1,
    });
    return {
      question: this.publicQuestion(q),
      attempt: null,
      nextAvailableAt: null,
    };
  }

  /** Submit today's answer. */
  async submit(userId: string, questionId: string, pickedIndex: number, ctx: { ip?: string; deviceId?: string } = {}) {
    const day = this.todayKey();

    // Block multiple attempts.
    const already = await this.prisma.quizAttempt.findUnique({
      where: { userId_rewardDay: { userId, rewardDay: day } },
    });
    if (already) {
      throw new BadRequestException("Aaj ka quiz pehle hi attempt ho chuka hai. Kal phir try karein.");
    }

    const question = await this.prisma.quizQuestion.findUnique({ where: { id: questionId } });
    if (!question || !question.active) throw new NotFoundException("Sawaal nahi mila.");
    if (pickedIndex < 0 || pickedIndex >= question.options.length) {
      throw new BadRequestException("Invalid jawab.");
    }

    const correct = pickedIndex === question.correctIndex;
    const rewardAmount = correct ? DAILY_REWARD : 0;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        questionId,
        pickedIndex,
        correct,
        rewardAmount: correct ? rewardAmount : null,
        rewardDay: day,
        ip: ctx.ip,
        deviceId: ctx.deviceId,
      },
    });

    if (correct) {
      // Atomic credit + 3-level referral commission (10/5/2%).
      await this.wallet.post(userId, "QUIZ_REWARD", rewardAmount, {
        description: "Daily quiz reward",
        referenceId: attempt.id,
      });
      await this.referrals.payCommissions(userId, rewardAmount, attempt.id);
    }

    return {
      correct,
      rewardAmount,
      explanation: question.explanation ?? null,
      correctIndex: question.correctIndex,
      nextAvailableAt: this.nextAvailableAt(attempt.createdAt),
    };
  }

  /** Recent quiz history for the user. */
  async history(userId: string, take = 30) {
    return this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: Math.min(take, 100),
      include: { question: { select: { question: true, category: true } } },
    });
  }

  // ---- helpers ----

  private publicQuestion<T extends { id: string; category: string; question: string; options: string[] }>(q: T) {
    // Never leak the correct index to the client during the open phase.
    return { id: q.id, category: q.category, question: q.question, options: q.options };
  }

  private nextAvailableAt(lastAttempt: Date) {
    return new Date(lastAttempt.getTime() + 24 * 3600 * 1000);
  }
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0);
}
