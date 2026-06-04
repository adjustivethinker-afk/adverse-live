"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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
} from "lucide-react";
import { pickDailyQuestion, todayKey, QUIZ_BANK } from "@/lib/quiz-bank";
import { useAuth, useQuiz } from "@/lib/store";
import { formatPKR } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

const DAILY_REWARD = 30; // PKR

export default function QuizPage() {
  const user = useAuth((s) => s.user);
  const credit = useAuth((s) => s.credit);
  const { attempts, recordAttempt, todaysAttempt, hoursUntilNextQuiz } = useQuiz();
  const todays = todaysAttempt();
  const hours = hoursUntilNextQuiz();

  const userId = user?.id ?? "anon";
  const day = todayKey();
  const question = useMemo(() => pickDailyQuestion(userId, day), [userId, day]);

  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (todays) {
      setPicked(todays.picked);
      setRevealed(true);
    }
  }, [todays]);

  const isCorrect = revealed && picked === question.correctIndex;

  const submit = () => {
    if (picked == null || revealed) return;
    const correct = picked === question.correctIndex;
    recordAttempt({
      date: day,
      questionId: question.id,
      picked,
      correct,
      reward: correct ? DAILY_REWARD : 0,
      at: new Date().toISOString(),
    });
    setRevealed(true);
    if (correct) {
      credit(DAILY_REWARD, "daily-quiz");
      fireConfetti();
      toast.success(`Mubarak! ${formatPKR(DAILY_REWARD)} reward credited.`, {
        description: "Apke wallet mein add ho gaya hai.",
      });
    } else {
      toast.error("Galat jawab. Agla mauqa 24 ghante baad.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <GlassCard variant="strong" liquidBorder className="relative overflow-hidden p-5 sm:p-6">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="chip"><HelpCircle className="h-3 w-3 text-amber-300" /> Daily Quiz Reward</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Aaj ka <span className="text-gradient-neon">Sawaal</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Aik aasaan sawaal — sahi jawab par <span className="text-amber-300 font-semibold">{formatPKR(DAILY_REWARD)}</span> reward.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning"><Coins className="h-3 w-3" /> +{formatPKR(DAILY_REWARD)}</Badge>
            <Badge variant="default"><BookOpen className="h-3 w-3" /> {question.category}</Badge>
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Sawaal {question.id.toUpperCase()}</p>
              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
                {question.q}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const isPicked = picked === i;
              const isAnswer = i === question.correctIndex;
              const showCorrect = revealed && isAnswer;
              const showWrong = revealed && isPicked && !isAnswer;

              return (
                <motion.button
                  key={opt}
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
                    {showCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    {showWrong && <XCircle className="h-5 w-5 text-rose-400" />}
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
                      <p className="font-display text-base font-semibold">Mubarak! Sahi jawab.</p>
                      <p className="text-xs text-emerald-200">
                        {formatPKR(DAILY_REWARD)} apke wallet mein add ho gaya. Kal phir milte hain.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">Koi baat nahi.</p>
                      <p className="text-xs text-rose-200">
                        Sahi jawab: <strong>{question.options[question.correctIndex]}</strong>. Agla quiz ~ {Math.ceil(hours)} ghante baad.
                      </p>
                    </div>
                  </div>
                )}
                {question.explain && (
                  <p className="mt-3 text-xs text-white/65 italic border-t border-white/[0.08] pt-3">
                    💡 {question.explain}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed ? (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={submit}
                disabled={picked == null}
                size="lg"
                variant="neon"
                className="w-full sm:w-auto"
              >
                Jawab submit karein <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-[11px] text-white/45">
                Note: Aaj sirf aik mauqa milta hai. Soch samajh kar select karein.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button size="lg" variant="glass" className="w-full">
                  Dashboard par jayein
                </Button>
              </Link>
              <Link href="/voice-rooms" className="flex-1">
                <Button size="lg" variant="ghost" className="w-full">
                  Voice rooms explore karein
                </Button>
              </Link>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Stats + history */}
      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Aap ka record</p>
          <div className="mt-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <p className="font-display text-2xl font-semibold tabular-nums">
              {attempts.filter((a) => a.correct).length} / {attempts.length}
            </p>
          </div>
          <p className="mt-1 text-[11px] text-white/55">Sahi jawab ki tadaad</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <Mini value={attempts.filter((a) => a.correct).length} label="Sahi" color="emerald" />
            <Mini value={attempts.filter((a) => !a.correct).length} label="Ghalat" color="rose" />
            <Mini value={formatPKR(attempts.filter((a) => a.correct).length * DAILY_REWARD)} label="Total kamai" color="amber" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 inline-flex items-center gap-1.5">
              <History className="h-3 w-3" /> Pichli koshishein
            </p>
            <Badge variant="default">Last 10</Badge>
          </div>
          {attempts.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">Abhi tak koi attempt nahi. Apna pehla quiz aaj hi solve karein!</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/[0.05]">
              {attempts.slice(0, 10).map((a, i) => {
                const q = QUIZ_BANK.find((qq) => qq.id === a.questionId);
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span
                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        a.correct ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {a.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{q?.q ?? "—"}</p>
                      <p className="text-[11px] text-white/45">
                        {a.date} · {q?.category}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold tabular-nums ${a.correct ? "text-emerald-300" : "text-white/40"}`}>
                      {a.correct ? `+ ${formatPKR(DAILY_REWARD)}` : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function Mini({ value, label, color }: { value: number | string; label: string; color: "emerald" | "rose" | "amber" }) {
  const cls = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  }[color];
  return (
    <div className={`rounded-xl border p-2.5 ${cls}`}>
      <p className="font-display text-base font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">{label}</p>
    </div>
  );
}

function fireConfetti() {
  const fire = (particleRatio: number, opts: confetti.Options) =>
    confetti({
      ...opts,
      origin: { y: 0.6 },
      particleCount: Math.floor(160 * particleRatio),
      colors: ["#FFC700", "#FF8A00", "#00D26A", "#00E5FF", "#FFFFFF"],
    });
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
