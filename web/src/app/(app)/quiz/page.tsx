"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Coins,
  Clock,
  Sparkles,
  History,
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/store";
import { formatPKR } from "@/lib/utils";
import {
  fetchTodaysQuiz,
  fetchQuizHistory,
  submitQuizAnswer,
  type QuizQuestion,
  type QuizAttempt as FbQuizAttempt,
} from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DAILY_REWARD = 30; // PKR

type Question = QuizQuestion;

type TodayResp = {
  attempted: boolean;
  question: Question;
  attempt?: {
    questionId: string;
    picked: number;
    correct: boolean;
    reward: number;
    at: number;
  };
  nextResetAt?: number;
};

type HistoryItem = FbQuizAttempt & { correctIndex: number };

export default function QuizPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const refresh = useAuth((s) => s.refresh);
  const hydrated = useAuth((s) => s.hydrated);

  const [today, setToday] = useState<TodayResp | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hours, setHours] = useState(0);

  // Redirect to login if hydrated and no user.
  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  // Load today's question + history.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [t, h] = await Promise.all([
          fetchTodaysQuiz(),
          fetchQuizHistory(20),
        ]);
        if (cancelled) return;
        const todayResp: TodayResp = {
          attempted: t.attempted,
          question: t.question,
          attempt: t.attempt
            ? {
                questionId: t.attempt.questionId,
                picked: t.attempt.picked,
                correct: t.attempt.correct,
                reward: t.attempt.reward,
                at: t.attempt.at,
              }
            : undefined,
          nextResetAt: t.attempt
            ? t.attempt.at + 24 * 3600 * 1000
            : undefined,
        };
        setToday(todayResp);
        if (t.attempted && t.attempt) {
          setPicked(t.attempt.picked);
          setRevealedAnswer(t.question.correctIndex);
          setExplanation(t.question.explanation ?? null);
          if (todayResp.nextResetAt) {
            const ms = todayResp.nextResetAt - Date.now();
            setHours(Math.max(0, ms / 3600 / 1000));
          }
        }
        setHistory(
          h.map((a) => ({
            ...a,
            correctIndex: -1,
          })),
        );
      } catch (e) {
        toast.error("Couldn't load quiz", {
          description: e instanceof Error ? e.message : String(e),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!hydrated || !user) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }
  if (!today) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  const question = today.question;
  const revealed = revealedAnswer != null;
  const isCorrect = revealed && picked === revealedAnswer;

  const submit = async () => {
    if (picked == null || revealed || submitting) return;
    setSubmitting(true);
    try {
      const res = await submitQuizAnswer(question.id, picked);
      setRevealedAnswer(res.correctIndex);
      setExplanation(question.explanation ?? null);
      setHours(24);
      if (res.correct) {
        toast.success(`Correct! ${formatPKR(res.reward)} credited.`, {
          description: "Added to your wallet.",
        });
      } else {
        toast.error("Wrong answer. Try again tomorrow.");
      }
      void refresh();
      const h = await fetchQuizHistory(20);
      setHistory(h.map((a) => ({ ...a, correctIndex: -1 })));
    } catch (e) {
      toast.error("Submit failed", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <GlassCard
        variant="strong"
        liquidBorder
        className="relative overflow-hidden p-5 sm:p-6"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="chip">
              <HelpCircle className="h-3 w-3 text-amber-300" /> Daily Quiz Reward
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Today&apos;s <span className="text-gradient-neon">Question</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              One easy question — answer correctly to earn{" "}
              <span className="text-amber-300 font-semibold">
                {formatPKR(DAILY_REWARD)}
              </span>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">
              <Coins className="h-3 w-3" /> +{formatPKR(DAILY_REWARD)}
            </Badge>
            <Badge variant="default">
              <BookOpen className="h-3 w-3" /> {question.category}
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Question card */}
      <motion.div
        key={question.id + (revealed ? "_done" : "_open")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] shrink-0">
              <HelpCircle className="h-6 w-6 text-white" />
            </span>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                Question
              </p>
              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
                {question.question}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const isPicked = picked === i;
              const isAnswer = revealedAnswer === i;
              const showCorrect = revealed && isAnswer;
              const showWrong = revealed && isPicked && !isAnswer;

              return (
                <motion.button
                  key={i}
                  whileHover={!revealed ? { scale: 1.01 } : undefined}
                  whileTap={!revealed ? { scale: 0.99 } : undefined}
                  onClick={() => !revealed && setPicked(i)}
                  disabled={revealed}
                  className={[
                    "relative text-left rounded-2xl border p-4 transition-all",
                    "backdrop-blur-xl",
                    showCorrect
                      ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                      : showWrong
                        ? "border-rose-500/60 bg-rose-500/10"
                        : isPicked
                          ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_0_4px_rgba(124,58,237,0.18)]"
                          : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-semibold",
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                            ? "bg-rose-500 text-white"
                            : isPicked
                              ? "bg-violet-500 text-white"
                              : "bg-white/[0.08] text-white/70",
                      ].join(" ")}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{opt}</span>
                    {showCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                    {showWrong && (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`mt-6 rounded-2xl p-4 border ${
                  isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-rose-500/40 bg-rose-500/10"
                }`}
              >
                {isCorrect ? (
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">
                        Correct answer!
                      </p>
                      <p className="text-xs text-emerald-200">
                        {formatPKR(DAILY_REWARD)} has been added to your wallet.
                        See you tomorrow.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">
                        Better luck next time.
                      </p>
                      <p className="text-xs text-rose-200">
                        Correct answer:{" "}
                        <strong>
                          {revealedAnswer != null
                            ? question.options[revealedAnswer]
                            : "—"}
                        </strong>
                        . Next quiz in ~ {Math.ceil(hours)} hours.
                      </p>
                    </div>
                  </div>
                )}
                {explanation && (
                  <p className="mt-3 text-xs text-white/65 italic border-t border-white/[0.08] pt-3">
                    💡 {explanation}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed ? (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={submit}
                disabled={picked == null || submitting}
                loading={submitting}
                size="lg"
                variant="neon"
                className="w-full sm:w-auto"
              >
                Submit answer <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-[11px] text-white/45">
                Note: You only get one attempt per day. Choose carefully.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button size="lg" variant="glass" className="w-full">
                  Back to dashboard
                </Button>
              </Link>
              <Link href="/friends" className="flex-1">
                <Button size="lg" variant="ghost" className="w-full">
                  Find friends
                </Button>
              </Link>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Stats + history */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Your record
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <p className="font-display text-2xl font-semibold tabular-nums">
              {history.filter((a) => a.correct).length} / {history.length}
            </p>
          </div>
          <p className="mt-1 text-[11px] text-white/55">
            Correct answers so far
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <Mini
              value={history.filter((a) => a.correct).length}
              label="Correct"
              color="emerald"
            />
            <Mini
              value={history.filter((a) => !a.correct).length}
              label="Wrong"
              color="rose"
            />
            <Mini
              value={formatPKR(
                history.reduce((acc, a) => acc + (a.reward || 0), 0),
              )}
              label="Earned"
              color="amber"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 inline-flex items-center gap-1.5">
              <History className="h-3 w-3" /> Past attempts
            </p>
            <Badge variant="default">Last 10</Badge>
          </div>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">
              No attempts yet. Take your first quiz today!
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-white/[0.05]">
              {history.slice(0, 10).map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      a.correct
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {a.correct ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{a.question}</p>
                    <p className="text-[11px] text-white/45">
                      {a.date} · {a.category}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      a.correct ? "text-emerald-300" : "text-white/40"
                    }`}
                  >
                    {a.correct ? `+ ${formatPKR(a.reward)}` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function Mini({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color: "emerald" | "rose" | "amber";
}) {
  const cls = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  }[color];
  return (
    <div className={`rounded-xl border p-2.5 ${cls}`}>
      <p className="font-display text-base font-semibold tabular-nums">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
        {label}
      </p>
    </div>
  );
}

