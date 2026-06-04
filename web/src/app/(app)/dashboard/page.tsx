"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat";
import {
  ArrowRight,
  Coins,
  Flame,
  HelpCircle,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useAuth, useQuiz } from "@/lib/store";
import { formatPKR } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAuth((s) => s.user);
  const todays = useQuiz((s) => s.todaysAttempt());
  const hours = useQuiz((s) => s.hoursUntilNextQuiz());

  const balance = user?.balance ?? 0;
  const total = user?.totalEarned ?? 0;
  const name = user?.fullName?.split(" ")[0] ?? "Friend";

  return (
    <div className="space-y-4">
      <Hero name={name} balance={balance} city={user?.city} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Wallet balance"
          value={balance}
          prefix="₨ "
          icon={<Wallet className="h-4 w-4" />}
          accent="violet"
        />
        <StatCard
          label="Today's earnings"
          value={Math.round(total * 0.18)}
          prefix="₨ "
          icon={<Coins className="h-4 w-4" />}
          accent="cyan"
          delta={12.8}
        />
        <StatCard
          label="Total earnings"
          value={total}
          prefix="₨ "
          icon={<TrendingUp className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          label="Team commission"
          value={Math.round(total * 0.4)}
          prefix="₨ "
          icon={<Users className="h-4 w-4" />}
          accent="amber"
        />
      </div>

      <DailyQuizCTA
        done={!!todays}
        correct={todays?.correct ?? false}
        hours={hours}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Your level
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">
            Level {user?.level ?? 1}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all"
              style={{
                width: `${Math.min(100, ((user?.xp ?? 0) % 200) / 2)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/55">
            {(user?.xp ?? 0) % 200} / 200 XP — until next level
          </p>
          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center justify-between">
              <span className="text-white/60">Solve daily quiz</span>
              <span className="text-amber-300">+ 20 XP</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/60">Invite a friend</span>
              <span className="text-amber-300">+ 50 XP</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-white/60">3-day streak</span>
              <span className="text-amber-300">+ 80 XP</span>
            </li>
          </ul>
          <Link
            href="/missions"
            className="mt-4 btn-ghost-glass !h-9 text-xs w-full justify-center"
          >
            View missions <ArrowRight className="h-3 w-3" />
          </Link>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
              Recent activity
            </p>
            <Link
              href="/wallet"
              className="text-xs text-white/65 hover:text-white"
            >
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {[
              {
                i: <HelpCircle className="h-3.5 w-3.5 text-amber-300" />,
                t: "Daily quiz reward",
                a: "+ ₨ 30",
                d: "2m ago",
                g: true,
              },
              {
                i: <Users className="h-3.5 w-3.5 text-violet-300" />,
                t: "Referral commission · L1 Sara",
                a: "+ ₨ 124",
                d: "12m ago",
                g: true,
              },
              {
                i: <Wallet className="h-3.5 w-3.5 text-emerald-300" />,
                t: "JazzCash withdrawal",
                a: "− ₨ 2,000",
                d: "1h ago",
                g: false,
              },
              {
                i: <Trophy className="h-3.5 w-3.5 text-amber-300" />,
                t: "Mission complete · 3-day streak",
                a: "+ 80 XP",
                d: "3h ago",
                g: true,
              },
            ].map((row, i) => (
              <li key={i} className="flex items-center gap-3 py-2.5">
                <span className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  {row.i}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{row.t}</p>
                  <p className="text-[11px] text-white/45">{row.d}</p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    row.g ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {row.a}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
              Streak
            </p>
            <Flame className="h-5 w-5 text-amber-300" />
          </div>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
            {user?.streak ?? 0} days
          </p>
          <p className="mt-1 text-xs text-white/55">
            Solve a quiz daily to grow your streak.
          </p>
          <Link href="/quiz" className="mt-4 btn-neon !h-9 text-xs w-full">
            Take today&apos;s quiz <ArrowRight className="h-3 w-3" />
          </Link>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
              Top friends · this week
            </p>
            <Link
              href="/friends"
              className="text-xs text-white/65 hover:text-white"
            >
              View all
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              { n: "Aroush K.", c: "Karachi", you: true },
              { n: "Hassan R.", c: "Lahore" },
              { n: "Zoya M.", c: "Islamabad" },
              { n: "Maya S.", c: "Multan" },
            ].map((u, i) => (
              <li
                key={u.n}
                className={`flex items-center gap-3 rounded-xl ${
                  u.you ? "bg-white/[0.06] ring-1 ring-violet-500/30" : ""
                } p-2`}
              >
                <span className="w-5 text-center text-[11px] text-white/45 tabular-nums">
                  #{i + 1}
                </span>
                <Avatar name={u.n} size={28} ring={i === 0 ? "violet" : "none"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{u.n}</p>
                  <p className="text-[11px] text-white/45">{u.c}</p>
                </div>
                <Link
                  href="/chat"
                  className="rounded-lg p-1.5 hover:bg-white/[0.06]"
                  aria-label="Chat"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-white/60" />
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Hero({
  name,
  balance,
  city,
}: {
  name: string;
  balance: number;
  city?: string;
}) {
  return (
    <GlassCard variant="strong" className="p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip">
            <Sparkles className="h-3 w-3 text-cyan-300" /> Welcome
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Hello, <span className="text-gradient-neon">{name}</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {city && <>{city} · </>}Your balance:{" "}
            <span className="text-emerald-300 font-semibold">
              {formatPKR(balance)}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/quiz">
            <Button size="md" variant="neon">
              <HelpCircle className="h-4 w-4" /> Today&apos;s quiz
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="md" variant="glass">
              <MessageSquare className="h-4 w-4" /> Chat
            </Button>
          </Link>
          <Link href="/team">
            <Button size="md" variant="ghost">
              <UserPlus className="h-4 w-4" /> Invite
            </Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}

function DailyQuizCTA({
  done,
  correct,
  hours,
}: {
  done: boolean;
  correct: boolean;
  hours: number;
}) {
  if (!done) {
    return (
      <GlassCard className="p-5 relative overflow-hidden border-amber-400/20">
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Today&apos;s task
              </p>
              <p className="font-display text-xl font-semibold tracking-tight">
                Daily Quiz Reward
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                One easy question — answer correctly to earn ₨ 30.
              </p>
            </div>
          </div>
          <Link href="/quiz">
            <Button
              size="lg"
              variant="neon"
              className="!bg-gradient-to-r !from-amber-400 !to-orange-500"
            >
              Take quiz <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </GlassCard>
    );
  }
  const h = Math.ceil(hours);
  return (
    <GlassCard className="p-5 border-emerald-500/20">
      <div className="flex items-center gap-3">
        <span
          className={`h-12 w-12 rounded-2xl ${
            correct
              ? "bg-gradient-to-br from-emerald-400 to-teal-500"
              : "bg-gradient-to-br from-rose-400 to-rose-600"
          } flex items-center justify-center`}
        >
          {correct ? (
            <Coins className="h-6 w-6 text-white" />
          ) : (
            <HelpCircle className="h-6 w-6 text-white" />
          )}
        </span>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Today&apos;s quiz
          </p>
          <p className="font-display text-lg font-semibold">
            {correct
              ? "Correct! Reward credited."
              : "Wrong answer. Try again tomorrow."}
          </p>
          <p className="text-xs text-white/55">Next quiz in ~ {h} hours</p>
        </div>
      </div>
    </GlassCard>
  );
}
