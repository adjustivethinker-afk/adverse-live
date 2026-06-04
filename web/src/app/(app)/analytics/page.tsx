"use client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat";
import { ArrowUpRight, BarChart3, Coins, HelpCircle, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const earnings = Array.from({ length: 30 }).map((_, i) => ({ d: i, v: Math.round(800 + Math.sin(i / 3) * 320 + i * 40 + Math.random() * 200) }));
const retention = [
  { d: "D0", v: 100 }, { d: "D1", v: 78 }, { d: "D3", v: 62 }, { d: "D7", v: 51 }, { d: "D14", v: 44 }, { d: "D30", v: 38 },
];
const sources = [
  { name: "Quiz", v: 42, color: "#00E5FF" },
  { name: "Referrals", v: 38, color: "#8B5CF6" },
  { name: "Missions", v: 12, color: "#00D26A" },
  { name: "Bonus", v: 8, color: "#FFC700" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <span className="chip"><BarChart3 className="h-3 w-3" /> Realtime · last 30 days</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Performance analytics</h1>
          </div>
          <Badge variant="success" pulse>Live</Badge>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total earnings" value={184902} prefix="₨ " icon={<Coins className="h-4 w-4" />} accent="cyan" delta={12.4} />
        <StatCard label="Active referrals" value={224} icon={<Users className="h-4 w-4" />} accent="violet" delta={6.4} />
        <StatCard label="Quiz wins" value={84} icon={<HelpCircle className="h-4 w-4" />} accent="emerald" delta={9.4} />
        <StatCard label="Avg session" value={12.6} decimals={1} suffix=" min" icon={<ArrowUpRight className="h-4 w-4" />} accent="amber" delta={2.1} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Revenue · 30 days</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings}>
                <defs>
                  <linearGradient id="r1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: "rgba(255,255,255,0.1)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#00E5FF" strokeWidth={2.4} fill="url(#r1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Earning sources</p>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sources} dataKey="v" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                  {sources.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {sources.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="flex-1 text-white/65">{s.name}</span>
                <span>{s.v}%</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Retention curve</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retention}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2.4} dot={{ fill: "#8B5CF6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Engagement</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.from({ length: 7 }).map((_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], v: Math.round(40 + Math.random() * 60) }))}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ background: "rgba(18,19,26,0.92)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" radius={[6,6,0,0]} fill="url(#bar2)" />
                <defs>
                  <linearGradient id="bar2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
