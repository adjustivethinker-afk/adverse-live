"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat";
import { motion } from "framer-motion";
import { Copy, MessageSquare, Share2, TrendingUp, UserPlus, Users } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const TEAM = [
  { id: "u1", name: "Aroush K.", level: 1, joined: "2026-05-12", earnings: 4220, status: "active" as const, l2: [
    { id: "u2", name: "Sara M.", level: 2, joined: "2026-05-18", earnings: 1240, status: "active" as const },
    { id: "u3", name: "Maya S.", level: 2, joined: "2026-05-21", earnings: 980, status: "active" as const },
  ]},
  { id: "u4", name: "Hassan R.", level: 1, joined: "2026-05-10", earnings: 3180, status: "active" as const, l2: [
    { id: "u5", name: "Bilal R.", level: 2, joined: "2026-05-23", earnings: 1010, status: "active" as const },
  ]},
  { id: "u6", name: "Zoya M.", level: 1, joined: "2026-05-09", earnings: 2640, status: "active" as const, l2: [
    { id: "u7", name: "Reema A.", level: 2, joined: "2026-05-19", earnings: 720, status: "idle" as const },
    { id: "u8", name: "Ali H.", level: 2, joined: "2026-05-30", earnings: 460, status: "idle" as const },
  ]},
];

const growth = Array.from({ length: 14 }).map((_, i) => ({
  d: `D${i + 1}`,
  v: Math.round(2 + i * 1.4 + Math.random() * 4),
}));

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="chip"><Users className="h-3 w-3" /> 3-level referral team</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Apni <span className="text-gradient-neon">team</span> banaiye
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Apne dosto ko invite karein. L1 se 10%, L2 se 5%, L3 se 2% commission — hamesha ke liye.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Apka referral link</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/20 border border-white/[0.06] p-2 pl-4">
                <span className="flex-1 text-sm font-mono text-white/80 truncate">adverse.live/r/AR0US71</span>
                <Button size="sm" variant="glass"><Copy className="h-3.5 w-3.5" /> Copy</Button>
                <Button size="sm" variant="neon"><Share2 className="h-3.5 w-3.5" /> Share</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Invite code</p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-widest">AR0US71</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Har naye signup par</p>
                <p className="mt-1 font-display text-lg font-semibold">₨ 25</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="L1 dost" value={24} icon={<Users className="h-4 w-4" />} accent="cyan" delta={6.4} />
        <StatCard label="L2 dost" value={58} icon={<Users className="h-4 w-4" />} accent="violet" delta={12.1} />
        <StatCard label="L3 dost" value={142} icon={<Users className="h-4 w-4" />} accent="emerald" delta={4.8} />
        <StatCard label="Team commission" value={28640} prefix="₨ " icon={<TrendingUp className="h-4 w-4" />} accent="amber" delta={9.7} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Network growth</p>
            <Badge variant="success" pulse>Live</Badge>
          </div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" radius={[6,6,0,0]} fill="url(#g-bar)" />
                <defs>
                  <linearGradient id="g-bar" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Team activity</p>
          <ul className="mt-3 space-y-2.5">
            {[
              { i: <UserPlus className="h-3.5 w-3.5 text-cyan-300" />, t: "Sara apke link se join hui", d: "2m ago" },
              { i: <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />, t: "Hassan ka quiz reward + commission", d: "12m ago" },
              { i: <MessageSquare className="h-3.5 w-3.5 text-violet-300" />, t: "Maya ne pehla room host kiya", d: "32m ago" },
              { i: <UserPlus className="h-3.5 w-3.5 text-cyan-300" />, t: "Reema joined via Aroush (L2)", d: "1h ago" },
            ].map((row, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="h-7 w-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center mt-0.5">{row.i}</span>
                <div>
                  <p className="text-sm">{row.t}</p>
                  <p className="text-[11px] text-white/45">{row.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Apki team</p>
          <Button size="sm" variant="glass">Export CSV</Button>
        </div>

        <div className="mt-4 space-y-2">
          {TEAM.map((u, i) => (
            <motion.details
              key={u.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-white/[0.04] border border-white/[0.08] open:bg-white/[0.06] transition"
            >
              <summary className="cursor-pointer list-none flex items-center gap-3 p-3">
                <Avatar name={u.name} size={36} ring="violet" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {u.name} <Badge variant="neon">L{u.level}</Badge>
                  </p>
                  <p className="text-[11px] text-white/45">Joined {u.joined} · {u.l2.length} L2 referrals</p>
                </div>
                <span className="text-sm font-semibold text-emerald-300 tabular-nums">+ ₨ {u.earnings.toLocaleString()}</span>
                <span className="text-white/40 text-xs ml-3 select-none">▾</span>
              </summary>
              <ul className="px-3 pb-3 ml-12 border-l border-white/[0.08] space-y-1.5">
                {u.l2.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-2">
                    <Avatar name={c.name} size={28} />
                    <div className="flex-1">
                      <p className="text-sm flex items-center gap-2">{c.name} <Badge>L{c.level}</Badge></p>
                      <p className="text-[11px] text-white/45">Joined {c.joined}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-300 tabular-nums">+ ₨ {c.earnings.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </motion.details>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
