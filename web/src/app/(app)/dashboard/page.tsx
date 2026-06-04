"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard, StatCounter } from "@/components/ui/stat";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Flame,
  HelpCircle,
  Mic,
  MessageSquare,
  Play,
  Sparkles,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth, useQuiz } from "@/lib/store";
import { formatPKR } from "@/lib/utils";

const earningsData = Array.from({ length: 14 }).map((_, i) => ({
  d: `D${i + 1}`,
  v: Math.round(40 + Math.sin(i / 2) * 20 + i * 5 + Math.random() * 12),
}));
const sourceData = [
  { name: "Quiz reward", v: 480, color: "#FFC700" },
  { name: "Referrals", v: 940, color: "#8B5CF6" },
  { name: "Voice gifts", v: 230, color: "#00E5FF" },
  { name: "Missions", v: 118, color: "#00D26A" },
];
const weekly = [
  { d: "Sun", v: 32 },
  { d: "Mon", v: 48 },
  { d: "Tue", v: 41 },
  { d: "Wed", v: 62 },
  { d: "Thu", v: 80 },
  { d: "Fri", v: 95 },
  { d: "Sat", v: 88 },
];

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
        <StatCard label="Wallet balance" value={balance} prefix="₨ " icon={<Wallet className="h-4 w-4" />} accent="violet" />
        <StatCard label="Aaj ki kamai" value={Math.round(total * 0.18)} prefix="₨ " icon={<Coins className="h-4 w-4" />} accent="cyan" delta={12.8} />
        <StatCard label="Total kamai" value={total} prefix="₨ " icon={<TrendingUp className="h-4 w-4" />} accent="emerald" />
        <StatCard label="Team commission" value={Math.round(total * 0.4)} prefix="₨ " icon={<Users className="h-4 w-4" />} accent="amber" />
      </div>

      {/* Daily quiz CTA */}
      <DailyQuizCTA done={!!todays} correct={todays?.correct ?? false} hours={hours} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Earnings · last 14 days</p>
              <p className="font-display text-2xl font-semibold">
                ₨ <StatCounter value={Math.round(total)} />
              </p>
            </div>
            <Badge variant="success" pulse>Live</Badge>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="g-earn" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                  contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Area type="monotone" dataKey="v" stroke="#00E5FF" strokeWidth={2.4} fill="url(#g-earn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Income sources</p>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="v" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                  {sourceData.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {sourceData.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="text-white/65 tabular-nums">{formatPKR(s.v)}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Aapka level</p>
          <p className="mt-1 font-display text-2xl font-semibold">Level {user?.level ?? 1}</p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((user?.xp ?? 0) % 200) / 2)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/55">{(user?.xp ?? 0) % 200} / 200 XP — agle level tak</p>
          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center justify-between"><span className="text-white/60">Daily quiz solve karein</span><span className="text-amber-300">+ 20 XP</span></li>
            <li className="flex items-center justify-between"><span className="text-white/60">Voice room mein 10 min</span><span className="text-amber-300">+ 30 XP</span></li>
            <li className="flex items-center justify-between"><span className="text-white/60">Friend invite karein</span><span className="text-amber-300">+ 50 XP</span></li>
          </ul>
          <Link href="/missions" className="mt-4 btn-ghost-glass !h-9 text-xs w-full justify-center">
            Missions dekhein <ArrowRight className="h-3 w-3" />
          </Link>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Recent activity</p>
            <Link href="/wallet" className="text-xs text-white/65 hover:text-white">Sab dekhein</Link>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {[
              { i: <HelpCircle className="h-3.5 w-3.5 text-amber-300" />, t: "Daily quiz reward", a: "+ ₨ 30", d: "2m ago", g: true },
              { i: <Users className="h-3.5 w-3.5 text-violet-300" />, t: "Referral commission · L1 Sara", a: "+ ₨ 124", d: "12m ago", g: true },
              { i: <Mic className="h-3.5 w-3.5 text-fuchsia-300" />, t: "Voice room gift · 'Karachi Talks'", a: "+ ₨ 45", d: "32m ago", g: true },
              { i: <Wallet className="h-3.5 w-3.5 text-emerald-300" />, t: "JazzCash withdrawal", a: "− ₨ 2,000", d: "1h ago", g: false },
              { i: <Trophy className="h-3.5 w-3.5 text-amber-300" />, t: "Mission complete · 3-day streak", a: "+ 80 XP", d: "3h ago", g: true },
            ].map((row, i) => (
              <li key={i} className="flex items-center gap-3 py-2.5">
                <span className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">{row.i}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{row.t}</p>
                  <p className="text-[11px] text-white/45">{row.d}</p>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${row.g ? "text-emerald-300" : "text-rose-300"}`}>{row.a}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Weekly streak</p>
          <div className="mt-2 flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-300" />
            <p className="font-display text-2xl font-semibold tabular-nums">7 days</p>
          </div>
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" radius={[6,6,0,0]} fill="url(#bar-grad)" />
                <defs>
                  <linearGradient id="bar-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Top friends · is hafte</p>
            <Link href="/friends" className="text-xs text-white/65 hover:text-white">Sab</Link>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              { n: "Aroush K.", c: "Karachi", you: true },
              { n: "Hassan R.", c: "Lahore" },
              { n: "Zoya M.", c: "Islamabad" },
              { n: "Maya S.", c: "Multan" },
              { n: "Bilal R.", c: "Faisalabad" },
            ].map((u, i) => (
              <li key={u.n} className={`flex items-center gap-3 rounded-xl ${u.you ? "bg-gradient-to-r from-violet-500/15 to-cyan-400/10 ring-1 ring-violet-500/30" : ""} p-2`}>
                <span className="w-5 text-center text-[11px] text-white/45 tabular-nums">#{i + 1}</span>
                <Avatar name={u.n} size={28} ring={i === 0 ? "violet" : "none"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{u.n}</p>
                  <p className="text-[11px] text-white/45">{u.c}</p>
                </div>
                <Link href="/chat" className="rounded-lg p-1.5 hover:bg-white/[0.06]">
                  <MessageSquare className="h-3.5 w-3.5 text-white/60" />
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Live voice rooms</p>
            <Link href="/voice-rooms" className="text-xs text-white/65 hover:text-white">Sab</Link>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              { t: "Karachi Walay 🌃", l: 182, host: "Imran" },
              { t: "Friday Night Talks", l: 412, host: "Aroush" },
              { t: "Lahori Mehfil 🎧", l: 92, host: "Hassan" },
            ].map((r) => (
              <li key={r.t} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-rose-500" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{r.t}</p>
                  <p className="text-[11px] text-white/45">Host: {r.host} · {r.l} listeners</p>
                </div>
                <Link href="/voice-rooms"><Button size="sm" variant="glass"><Play className="h-3.5 w-3.5" /> Join</Button></Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Hero({ name, balance, city }: { name: string; balance: number; city?: string }) {
  return (
    <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip"><Sparkles className="h-3 w-3 text-cyan-300" /> Khush amdeed</span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Assalam-o-Alaikum, <span className="text-gradient-neon">{name}</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {city && <>{city} · </>}Apka balance: <span className="text-emerald-300 font-semibold">{formatPKR(balance)}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/quiz"><Button size="md" variant="neon"><HelpCircle className="h-4 w-4" /> Aaj ka quiz</Button></Link>
          <Link href="/voice-rooms"><Button size="md" variant="glass"><Mic className="h-4 w-4" /> Live rooms</Button></Link>
          <Link href="/team"><Button size="md" variant="ghost"><UserPlus className="h-4 w-4" /> Invite</Button></Link>
        </div>
      </div>
    </GlassCard>
  );
}

function DailyQuizCTA({ done, correct, hours }: { done: boolean; correct: boolean; hours: number }) {
  if (!done) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-5 relative overflow-hidden border-amber-400/20">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-amber-400/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-orange-500/30 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
                <HelpCircle className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Aaj ka task</p>
                <p className="font-display text-xl font-semibold tracking-tight">Daily Quiz Reward</p>
                <p className="mt-0.5 text-xs text-white/60">Aik aasaan sawaal — sahi jawab par PKR 30 reward.</p>
              </div>
            </div>
            <Link href="/quiz">
              <Button size="lg" variant="neon" className="!bg-gradient-to-r !from-amber-400 !to-orange-500 !shadow-[0_8px_30px_-4px_rgba(251,146,60,0.5)]">
                Quiz hal karein <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    );
  }
  const h = Math.ceil(hours);
  return (
    <GlassCard className="p-5 border-emerald-500/20">
      <div className="flex items-center gap-3">
        <span className={`h-12 w-12 rounded-2xl ${correct ? "bg-gradient-to-br from-emerald-400 to-teal-500" : "bg-gradient-to-br from-rose-400 to-rose-600"} flex items-center justify-center`}>
          {correct ? <Coins className="h-6 w-6 text-white" /> : <HelpCircle className="h-6 w-6 text-white" />}
        </span>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Aaj ka quiz</p>
          <p className="font-display text-lg font-semibold">
            {correct ? "Mubarak — sahi jawab! Reward credited." : "Ghalat jawab. Agla mauqa kal."}
          </p>
          <p className="text-xs text-white/55">Agla quiz: ~ {h} ghante baad</p>
        </div>
      </div>
    </GlassCard>
  );
}
