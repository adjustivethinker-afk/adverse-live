"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Bell, CheckCheck, Coins, Mic, ShieldAlert, Trophy, Users, Wallet } from "lucide-react";
import { useState } from "react";

type Notif = {
  id: string;
  kind: "reward" | "ref" | "voice" | "deposit" | "withdraw" | "system";
  title: string;
  desc: string;
  date: string;
  read?: boolean;
};

const SEED: Notif[] = [
  { id: "n1", kind: "reward", title: "Reward mil gaya", desc: "₨ 30 add hua · Daily quiz reward", date: "2 min pehle" },
  { id: "n2", kind: "ref", title: "Naya dost", desc: "Sara apke link se join hui", date: "12 min pehle" },
  { id: "n3", kind: "voice", title: "Abhi live", desc: "Karachi Walay room shuru hua", date: "32 min pehle", read: true },
  { id: "n4", kind: "deposit", title: "Deposit verify ho gaya", desc: "₨ 5,000 EasyPaisa se", date: "1 ghanta pehle", read: true },
  { id: "n5", kind: "withdraw", title: "Withdrawal complete", desc: "₨ 2,000 JazzCash mein", date: "1 ghanta pehle", read: true },
  { id: "n6", kind: "system", title: "Naya device sign-in", desc: "Karachi, PK · Chrome", date: "3 ghante pehle" },
];

const TABS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "reward", label: "Rewards" },
  { id: "ref", label: "Referrals" },
  { id: "voice", label: "Voice" },
  { id: "system", label: "System" },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState(SEED);
  const filtered = items.filter((n) => tab === "all" ? true : tab === "unread" ? !n.read : n.kind === tab);

  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <span className="chip"><Bell className="h-3 w-3 text-cyan-300" /> Notifications</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Stay in the loop</h1>
          </div>
          <Button variant="glass" onClick={() => setItems((arr) => arr.map(n => ({...n, read: true})))}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${tab === t.id ? "bg-gradient-to-r from-violet-500/30 to-cyan-400/20 ring-1 ring-violet-500/40 text-white" : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-2">
        <ul className="divide-y divide-white/[0.05]">
          {filtered.map((n) => (
            <li key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-white/[0.03]" : ""}`}>
              <NotifIcon kind={n.kind} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold flex items-center gap-2">
                  {n.title}
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </p>
                <p className="text-xs text-white/60">{n.desc}</p>
                <p className="text-[11px] text-white/45 mt-0.5">{n.date}</p>
              </div>
              {!n.read && <Button size="sm" variant="ghost" onClick={() => setItems((arr) => arr.map(x => x.id === n.id ? {...x, read: true} : x))}>Mark read</Button>}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function NotifIcon({ kind }: { kind: Notif["kind"] }) {
  const map: Record<Notif["kind"], { icon: React.ReactNode; color: string }> = {
    reward:   { icon: <Coins className="h-4 w-4" />, color: "from-amber-400 to-orange-500" },
    ref:      { icon: <Users className="h-4 w-4" />, color: "from-cyan-400 to-blue-500" },
    voice:    { icon: <Mic className="h-4 w-4" />, color: "from-violet-500 to-fuchsia-500" },
    deposit:  { icon: <Wallet className="h-4 w-4" />, color: "from-emerald-400 to-teal-500" },
    withdraw: { icon: <Wallet className="h-4 w-4" />, color: "from-pink-500 to-rose-500" },
    system:   { icon: <ShieldAlert className="h-4 w-4" />, color: "from-indigo-500 to-violet-500" },
  };
  const m = map[kind];
  return (
    <span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0 text-white`}>
      {m.icon}
    </span>
  );
}
