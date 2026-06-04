"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Flame, Gift, HelpCircle, Lock, MessageSquare, Trophy, UserPlus, Users } from "lucide-react";

const DAILY = [
  { i: <HelpCircle className="h-4 w-4" />, t: "Solve today's quiz", p: 0, m: 1, r: "₨ 30 + 20 XP" },
  { i: <Users className="h-4 w-4" />, t: "Invite a friend", p: 0, m: 1, r: "₨ 25 + 50 XP" },
  { i: <UserPlus className="h-4 w-4" />, t: "Add a new friend", p: 0, m: 1, r: "10 XP" },
  { i: <MessageSquare className="h-4 w-4" />, t: "Message 3 friends", p: 2, m: 3, r: "15 XP" },
];

const WEEKLY = [
  { i: <Trophy className="h-4 w-4" />, t: "7-day streak", p: 5, m: 7, r: "₨ 200 + Streak chest" },
  { i: <Users className="h-4 w-4" />, t: "Bring 5 friends to your team", p: 2, m: 5, r: "₨ 250 + 500 XP" },
  { i: <HelpCircle className="h-4 w-4" />, t: "Solve 5 quizzes correctly", p: 3, m: 5, r: "₨ 100 + 100 XP" },
];

const CHESTS = [
  { name: "Bronze chest", desc: "Unlocks at 500 XP", color: "from-amber-700 to-amber-500", earn: "₨ 50", locked: false },
  { name: "Silver chest", desc: "Unlocks at 1,500 XP", color: "from-slate-300 to-slate-500", earn: "₨ 150", locked: false },
  { name: "Gold chest", desc: "Unlocks at 3,000 XP", color: "from-amber-300 to-yellow-500", earn: "₨ 300", locked: true },
  { name: "Diamond chest", desc: "Unlocks at 5,000 XP", color: "from-cyan-300 to-blue-500", earn: "₨ 500", locked: true },
];

export default function MissionsPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <span className="chip"><Flame className="h-3 w-3 text-amber-300" /> 7-day streak</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Earn XP. Level up. <span className="text-gradient-neon">Win chests.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">Daily and weekly missions, streak bonuses, and chest unlocks — designed to grow your level.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat k="Level" v="1" />
            <Stat k="XP" v="0 / 200" />
            <Stat k="Streak" v="0 days" />
          </div>
        </div>
        <div className="relative mt-5 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500" style={{ width: "80%" }} />
        </div>
        <p className="relative mt-2 text-[11px] text-white/55">580 XP to next level</p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Today's missions</p>
          <ul className="mt-3 space-y-2">
            {DAILY.map((d) => <Mission key={d.t} {...d} />)}
          </ul>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Weekly missions</p>
          <ul className="mt-3 space-y-2">
            {WEEKLY.map((d) => <Mission key={d.t} {...d} />)}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Chests · earn keys by completing missions</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHESTS.map((c) => (
            <div key={c.name} className={`relative rounded-2xl border p-4 ${c.locked ? "border-white/[0.05] bg-white/[0.02]" : "border-white/[0.08] bg-white/[0.04]"}`}>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]`}>
                <Gift className="h-5 w-5 text-white" />
              </div>
              <p className="mt-3 text-sm font-semibold">{c.name}</p>
              <p className="text-[11px] text-white/55">{c.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold tabular-nums">{c.earn}</span>
                {c.locked ? (
                  <Badge variant="default"><Lock className="h-3 w-3" /> Locked</Badge>
                ) : (
                  <Button size="sm" variant="neon">Open</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Mission({ i, t, p, m, r }: { i: React.ReactNode; t: string; p: number; m: number; r: string }) {
  const pct = Math.min(100, Math.round((p / m) * 100));
  const done = p >= m;
  return (
    <li className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3.5">
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">{i}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold flex items-center gap-2">
            {t} {done && <Badge variant="success">Done</Badge>}
          </p>
          <p className="text-[11px] text-white/55">Reward: <span className="text-white/85">{r}</span></p>
        </div>
        <span className="text-xs tabular-nums text-white/65">{p}/{m}</span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full ${done ? "bg-emerald-400" : "bg-gradient-to-r from-cyan-400 to-violet-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">{k}</p>
      <p className="mt-1 font-display text-lg font-semibold tabular-nums">{v}</p>
    </div>
  );
}
