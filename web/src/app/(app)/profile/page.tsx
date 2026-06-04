"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  AtSign,
  Calendar,
  Coins,
  Edit3,
  Save,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  X,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useQuiz } from "@/lib/store";
import { PK_CITIES } from "@/lib/pk";
import { formatPKR } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

const LEVELS = [
  { lvl: 1, name: "Naya Saathi", color: "from-slate-500 to-slate-700" },
  { lvl: 5, name: "Active Member", color: "from-cyan-400 to-blue-500" },
  { lvl: 10, name: "Star User", color: "from-violet-500 to-fuchsia-500" },
  { lvl: 20, name: "Pro Host", color: "from-pink-500 to-rose-500" },
  { lvl: 35, name: "Legend", color: "from-amber-400 to-pink-500" },
];

export default function ProfilePage() {
  const user = useAuth((s) => s.user);
  const update = useAuth((s) => s.update);
  const attempts = useQuiz((s) => s.attempts);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    username: user?.username ?? "",
    gender: user?.gender ?? "male",
    city: user?.city ?? "Karachi",
    bio: "",
  });

  const tier = useMemo(() => {
    if (!user) return LEVELS[0];
    let cur = LEVELS[0];
    for (const l of LEVELS) if (user.level >= l.lvl) cur = l;
    return cur;
  }, [user]);

  const xpProgress = useMemo(() => {
    if (!user) return 0;
    return Math.min(100, ((user.xp ?? 0) % 200) / 2);
  }, [user]);

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="font-display text-xl">Pehle sign in karein</p>
        <Link href="/login" className="mt-4 inline-block">
          <Button variant="neon">Sign in</Button>
        </Link>
      </GlassCard>
    );
  }

  const correctQuizzes = attempts.filter((a) => a.correct).length;
  const joinedDate = new Date(user.joinedAt).toLocaleDateString("en-PK", {
    month: "long", year: "numeric",
  });

  const onSave = async () => {
    if (form.fullName.trim().length < 2) return toast.error("Naam likhein.");
    if (!/^[a-z0-9_]{3,20}$/i.test(form.username)) return toast.error("Username 3-20 chars, sirf letters/numbers/underscore.");
    // Optimistic local update for snappy UX
    update({
      fullName: form.fullName,
      gender: form.gender as "male" | "female",
      city: form.city,
    });
    const res = await api("/api/users/me", {
      method: "PATCH",
      json: {
        fullName: form.fullName,
        city: form.city,
      },
    });
    setEditing(false);
    if (!res.ok) {
      toast.error("Save nahi hua", { description: res.error.message });
    } else {
      toast.success("Profile update ho gayi.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <GlassCard variant="strong" liquidBorder className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/15 to-cyan-400/20" />
        <div className="absolute inset-0 bg-aurora-1 opacity-70" />
        <div className="relative h-40" />

        <div className="relative px-5 sm:px-8 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-3xl ring-4 ring-graphite p-1 bg-graphite">
                <Avatar name={user.fullName} size={104} ring="violet" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2 flex-wrap">
                  {user.fullName}
                  <Badge variant="vip">PK</Badge>
                  <Badge variant="default">L{user.level}</Badge>
                </h1>
                <p className="mt-1 text-sm text-white/60 inline-flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1"><AtSign className="h-3 w-3" />{user.username}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{user.city}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {joinedDate}</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-br ${tier.color} text-white shadow-[0_0_18px_-4px_rgba(0,0,0,0.5)]`}>
                    <Sparkles className="h-3 w-3" /> {tier.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="glass" onClick={() => setEditing(true)}><Edit3 className="h-4 w-4" /> Edit profile</Button>
              <Button variant="neon">Share</Button>
            </div>
          </div>

          {/* Level progress */}
          <div className="mt-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/65">Level <strong className="text-white">{user.level}</strong> · {user.xp} XP</span>
              <span className="text-white/45">Next: Level {user.level + 1}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
              />
            </div>
            <p className="mt-2 text-[11px] text-white/55">
              Daily quiz, voice rooms, dosti aur invites se XP barhta hai. Har 200 XP par naya level.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Coins className="h-4 w-4 text-amber-300" />} label="Wallet" value={formatPKR(user.balance)} />
        <Stat icon={<TrendingUp className="h-4 w-4 text-emerald-300" />} label="Total kamai" value={formatPKR(user.totalEarned)} />
        <Stat icon={<Trophy className="h-4 w-4 text-violet-300" />} label="Quiz wins" value={correctQuizzes.toString()} />
        <Stat icon={<Users className="h-4 w-4 text-cyan-300" />} label="Referral code" value={user.referralCode} />
      </div>

      {/* Activity / How to level up */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Level kaise barhta hai?</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { k: "Daily quiz solve", v: "+ 20 XP", c: "from-amber-400 to-orange-500" },
              { k: "Voice room mein 10 min", v: "+ 30 XP", c: "from-cyan-400 to-blue-500" },
              { k: "Friend invite karein", v: "+ 50 XP", c: "from-violet-500 to-fuchsia-500" },
              { k: "Apna room host karein", v: "+ 40 XP", c: "from-pink-500 to-rose-500" },
              { k: "Dost se message karein", v: "+ 5 XP", c: "from-emerald-400 to-teal-500" },
              { k: "7-din streak", v: "+ 100 XP", c: "from-yellow-400 to-amber-500" },
            ].map((x) => (
              <li key={x.k} className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="flex items-center gap-2.5">
                  <span className={`h-7 w-7 rounded-lg bg-gradient-to-br ${x.c}`} />
                  <span className="text-sm">{x.k}</span>
                </div>
                <span className="text-xs text-amber-300 font-semibold">{x.v}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Achievements</p>
          <ul className="mt-3 space-y-2">
            {[
              { name: "Pehla Quiz", earned: correctQuizzes >= 1 },
              { name: "5 Quiz Wins", earned: correctQuizzes >= 5 },
              { name: "10 Friends", earned: false },
              { name: "Pehla Voice Room", earned: false },
              { name: "Level 5 par pohcha", earned: user.level >= 5 },
              { name: "PKR 1,000 kamai", earned: user.totalEarned >= 1000 },
            ].map((a) => (
              <li key={a.name} className={`flex items-center justify-between rounded-xl px-3 py-2 ${a.earned ? "bg-gradient-to-r from-emerald-500/10 to-cyan-400/5 border border-emerald-500/20" : "bg-white/[0.03] border border-white/[0.06] opacity-60"}`}>
                <span className="text-sm flex items-center gap-2">
                  <Trophy className={`h-3.5 w-3.5 ${a.earned ? "text-amber-300" : "text-white/30"}`} />
                  {a.name}
                </span>
                {a.earned ? <Badge variant="success">Mil gaya</Badge> : <Badge variant="default">Locked</Badge>}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard variant="strong" liquidBorder className="p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/30 blur-3xl" />
                <button onClick={() => setEditing(false)} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
                <h2 className="font-display text-xl font-semibold">Profile edit karein</h2>
                <p className="text-xs text-white/55 mt-1">Apni info update karein.</p>

                <div className="mt-5 space-y-3">
                  <Input
                    label="Poora naam"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  />
                  <Input
                    label="Username"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Gender"
                      value={form.gender}
                      onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "male" | "female" }))}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                    <Select
                      label="Sheher"
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      options={PK_CITIES.map((c) => ({ value: c, label: c }))}
                    />
                  </div>

                  <div className="flex items-stretch gap-2 pt-3">
                    <Button variant="glass" size="lg" className="flex-1" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button variant="neon" size="lg" className="flex-1" onClick={onSave}>
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2">
        <span className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center">{icon}</span>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">{label}</p>
      </div>
      <p className="mt-2 font-display text-lg font-semibold tabular-nums truncate">{value}</p>
    </GlassCard>
  );
}
