"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCounter } from "@/components/ui/stat";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Download,
  Filter,
  HelpCircle,
  Search,
  Users,
  Wallet,
  Mic,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";

const CHART = Array.from({ length: 30 }).map((_, i) => ({
  d: i,
  v: Math.round(38000 + Math.sin(i / 3) * 2400 + i * 320),
}));

type Tx = {
  id: string;
  kind: "quiz" | "ref" | "gift" | "deposit" | "withdraw" | "bonus";
  title: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
};

const TX: Tx[] = [
  { id: "T-90123", kind: "quiz", title: "Daily quiz reward", amount: 30, status: "completed", date: "Aaj · 6:42 PM" },
  { id: "T-90122", kind: "ref", title: "Referral · L1 Sara", amount: 124, status: "completed", date: "Aaj · 6:18 PM" },
  { id: "T-90121", kind: "gift", title: "Voice room tohfa · Karachi Walay", amount: 45, status: "completed", date: "Aaj · 5:01 PM" },
  { id: "T-90120", kind: "withdraw", title: "Withdraw · JazzCash", amount: -2000, status: "completed", date: "Aaj · 4:33 PM" },
  { id: "T-90119", kind: "bonus", title: "Streak bonus · 7 din", amount: 80, status: "completed", date: "Aaj · 12:00 AM" },
  { id: "T-90118", kind: "deposit", title: "Deposit · EasyPaisa", amount: 5000, status: "pending", date: "Kal · 11:14 PM" },
  { id: "T-90117", kind: "quiz", title: "Daily quiz reward", amount: 30, status: "completed", date: "Kal · 9:30 PM" },
  { id: "T-90116", kind: "ref", title: "Referral · L2 Bilal", amount: 62, status: "completed", date: "Kal · 8:11 PM" },
];

const TABS = ["Sab", "Quiz", "Referral", "Tohfey", "Deposit", "Withdraw", "Bonus"];

export default function WalletPage() {
  const [tab, setTab] = useState("Sab");

  const filtered = TX.filter((t) => {
    if (tab === "Sab") return true;
    if (tab === "Quiz") return t.kind === "quiz";
    if (tab === "Referral") return t.kind === "ref";
    if (tab === "Tohfey") return t.kind === "gift";
    if (tab === "Deposit") return t.kind === "deposit";
    if (tab === "Withdraw") return t.kind === "withdraw";
    if (tab === "Bonus") return t.kind === "bonus";
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard variant="strong" liquidBorder className="p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <span className="chip"><Wallet className="h-3 w-3" /> Liquid wallet</span>
            <Badge variant="success" pulse>Synced</Badge>
          </div>

          <p className="relative mt-3 text-[11px] uppercase tracking-[0.18em] text-white/55">Available balance</p>
          <p className="relative mt-1 font-display text-5xl sm:text-6xl font-semibold tracking-tight">
            ₨ <StatCounter value={42810} />
          </p>
          <p className="relative mt-1 text-sm text-emerald-300">▲ + ₨ 1,240 today</p>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <Button variant="neon"><ArrowDownToLine className="h-4 w-4" /> Deposit</Button>
            <Button variant="glass"><ArrowUpFromLine className="h-4 w-4" /> Withdraw</Button>
            <Button variant="ghost"><Download className="h-4 w-4" /> Export statement</Button>
          </div>

          <div className="relative mt-6 h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART}>
                <defs>
                  <linearGradient id="wal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis hide dataKey="d" />
                <Tooltip contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#00E5FF" strokeWidth={2.4} fill="url(#wal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-3">
          <Tile k="Income · 30 din" v={28420} prefix="₨ " accent="from-cyan-400 to-blue-500" />
          <Tile k="Deposits · 30 din" v={12000} prefix="₨ " accent="from-violet-500 to-fuchsia-500" />
          <Tile k="Withdrawals · 30 din" v={9800} prefix="₨ " accent="from-emerald-400 to-teal-500" />
          <Tile k="Pending" v={5000} prefix="₨ " accent="from-amber-400 to-orange-500" />
          <Tile k="Referral commission" v={6280} prefix="₨ " accent="from-pink-500 to-rose-500" />
          <Tile k="Voice tohfey" v={2310} prefix="₨ " accent="from-fuchsia-400 to-purple-500" />
        </div>
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold">Transactions</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
              <Search className="h-3.5 w-3.5 text-white/55" />
              <input placeholder="Search…" className="bg-transparent py-2 text-xs placeholder:text-white/35 outline-none" />
            </div>
            <Button size="sm" variant="glass"><Filter className="h-3.5 w-3.5" /> Filters</Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${tab === t ? "bg-gradient-to-r from-violet-500/30 to-cyan-400/20 ring-1 ring-violet-500/40 text-white" : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-white/[0.05]">
          {filtered.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-2.5">
              <KindIcon kind={t.kind} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{t.title}</p>
                <p className="text-[11px] text-white/45">{t.id} · {t.date}</p>
              </div>
              <Badge variant={t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "danger"}>{t.status}</Badge>
              <span className={`w-24 text-right text-sm font-semibold tabular-nums ${t.amount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {t.amount >= 0 ? "+" : "−"} ₨ {Math.abs(t.amount).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function Tile({ k, v, prefix, accent }: { k: string; v: number; prefix?: string; accent: string }) {
  return (
    <div className="relative glass rounded-2xl p-4 overflow-hidden">
      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-2xl`} />
      <p className="relative text-[10px] uppercase tracking-[0.18em] text-white/50">{k}</p>
      <p className="relative mt-1 font-display text-xl font-semibold tabular-nums">
        <StatCounter value={v} prefix={prefix} />
      </p>
    </div>
  );
}

function KindIcon({ kind }: { kind: Tx["kind"] }) {
  const map: Record<Tx["kind"], { icon: React.ReactNode; color: string }> = {
    quiz:     { icon: <HelpCircle className="h-3.5 w-3.5" />, color: "text-amber-300" },
    ref:      { icon: <Users className="h-3.5 w-3.5" />, color: "text-violet-300" },
    gift:     { icon: <Mic className="h-3.5 w-3.5" />, color: "text-fuchsia-300" },
    deposit:  { icon: <ArrowDownToLine className="h-3.5 w-3.5" />, color: "text-emerald-300" },
    withdraw: { icon: <ArrowUpFromLine className="h-3.5 w-3.5" />, color: "text-rose-300" },
    bonus:    { icon: <Trophy className="h-3.5 w-3.5" />, color: "text-amber-300" },
  };
  return (
    <span className={`h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center ${map[kind].color}`}>
      {map[kind].icon}
    </span>
  );
}
