"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, BarChart3, Coins, HelpCircle, Shield, ShieldCheck, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";

const revenue = Array.from({ length: 30 }).map((_, i) => ({ d: i, v: Math.round(8200 + Math.sin(i / 3) * 1800 + i * 280 + Math.random() * 600) }));
const signups = Array.from({ length: 14 }).map((_, i) => ({ d: `D${i+1}`, v: Math.round(40 + Math.random() * 80 + i * 4) }));

export default function SuperAdmin() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-rose-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="chip"><ShieldCheck className="h-3 w-3 text-rose-300" /> Super Admin Dashboard</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              System status: <span className="text-emerald-300">All systems normal</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">Realtime metrics across users, money, and trust.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" pulse>API · 99.99% · 42ms</Badge>
            <Badge variant="success" pulse>DB · healthy</Badge>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={120480} icon={<Users className="h-4 w-4" />} accent="cyan" delta={4.2} />
        <StatCard label="Today's revenue" value={42810} prefix="₨ " icon={<Coins className="h-4 w-4" />} accent="emerald" delta={9.6} />
        <StatCard label="Open tickets" value={28} icon={<AlertTriangle className="h-4 w-4" />} accent="amber" delta={-12.5} />
        <StatCard label="Active today" value={5840} icon={<Users className="h-4 w-4" />} accent="violet" delta={3.1} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Revenue · 30 days</p>
            <Badge variant="success" pulse>Live</Badge>
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="adm-rev" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF4D6D" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: "rgba(255,255,255,0.1)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#FF4D6D" strokeWidth={2.4} fill="url(#adm-rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Signups · 14 days</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signups}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" radius={[6,6,0,0]} fill="url(#adm-bar)" />
                <defs>
                  <linearGradient id="adm-bar" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Pending approvals</p>
            <span className="chip text-[10px]">20 total</span>
          </div>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {[
              { type: "deposit", t: "Deposit · ₨ 5,000 · EasyPaisa", u: "Aroush K.", ago: "2m" },
              { type: "withdraw", t: "Withdraw · ₨ 12,000 · Bank", u: "Hassan R.", ago: "8m" },
              { type: "deposit", t: "Deposit · ₨ 1,500 · JazzCash", u: "Sara M.", ago: "12m" },
              { type: "withdraw", t: "Withdraw · ₨ 800 · JazzCash", u: "Bilal R.", ago: "20m" },
            ].map((row, i) => (
              <li key={i} className="flex items-center gap-3 py-2.5">
                <span className={`h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center ${row.type === "deposit" ? "text-emerald-300" : "text-rose-300"}`}>
                  {row.type === "deposit" ? <ArrowDownToLine className="h-3.5 w-3.5" /> : <ArrowUpFromLine className="h-3.5 w-3.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{row.t}</p>
                  <p className="text-[11px] text-white/45">{row.u} · {row.ago} ago</p>
                </div>
                <Button size="sm" variant="success">Approve</Button>
                <Button size="sm" variant="ghost">Reject</Button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Fraud watchlist</p>
            <Badge variant="danger" pulse>3 alerts</Badge>
          </div>
          <ul className="mt-3 space-y-2.5">
            {[
              { u: "Faraz A.", reason: "Suspicious referral burst", level: "high" as const },
              { u: "Reema K.", reason: "Multi-account device fingerprint", level: "high" as const },
              { u: "Naveed", reason: "Repeated failed deposits", level: "med" as const },
              { u: "Saad", reason: "Unusual IP pattern", level: "low" as const },
            ].map((row, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5">
                <Avatar name={row.u} size={32} ring={row.level === "high" ? "live" : "none"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{row.u}</p>
                  <p className="text-[11px] text-white/55">{row.reason}</p>
                </div>
                <Badge variant={row.level === "high" ? "danger" : row.level === "med" ? "warning" : "default"}>{row.level}</Badge>
                <Button size="sm" variant="glass">Review</Button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
