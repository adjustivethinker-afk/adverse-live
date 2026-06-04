"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Filter,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getActiveUsers, lastSeenLabel, type Person } from "@/lib/people";
import { PK_CITIES } from "@/lib/pk";
import { cn } from "@/lib/utils";

type Filter = "all" | "online" | "male" | "female";

export default function FriendsPage() {
  const all = useMemo(() => getActiveUsers(), []);
  const [filter, setFilter] = useState<Filter>("all");
  const [city, setCity] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return all.filter((p) => {
      if (q && !`${p.fullName} ${p.username} ${p.city}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "All" && p.city !== city) return false;
      if (filter === "online" && !p.online) return false;
      if (filter === "male" && p.gender !== "male") return false;
      if (filter === "female" && p.gender !== "female") return false;
      return true;
    });
  }, [all, filter, city, q]);

  const onlineCount = all.filter((p) => p.online).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="chip"><Users className="h-3 w-3 text-pink-300" /> {all.length} active users</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Apne <span className="text-gradient-neon">log</span> dhoondhiye
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Pakistan bhar ke active users — sab se top par sab se zyada active.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
              <Search className="h-3.5 w-3.5 text-white/55" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Naam ya sheher search karein…"
                className="bg-transparent py-2 text-xs placeholder:text-white/35 outline-none w-56"
              />
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={<Sparkles className="h-4 w-4 text-amber-300" />} label="Total active" value={all.length.toString()} />
          <Stat icon={<TrendingUp className="h-4 w-4 text-emerald-300" />} label="Abhi online" value={onlineCount.toString()} />
          <Stat icon={<MapPin className="h-4 w-4 text-cyan-300" />} label="Sheher" value="44+" />
          <Stat icon={<UserPlus className="h-4 w-4 text-violet-300" />} label="Naye dost" value="120/hafte" />
        </div>
      </GlassCard>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Sab</FilterChip>
        <FilterChip active={filter === "online"} onClick={() => setFilter("online")}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
        </FilterChip>
        <FilterChip active={filter === "male"} onClick={() => setFilter("male")}>Male</FilterChip>
        <FilterChip active={filter === "female"} onClick={() => setFilter("female")}>Female</FilterChip>

        <span className="ml-auto inline-flex items-center gap-2 chip">
          <Filter className="h-3 w-3 text-white/55" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-xs outline-none [&>option]:bg-[#0d0d18]"
          >
            <option value="All">Saare sheher</option>
            {PK_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </span>
      </div>

      {/* Most active spotlight */}
      {filter === "all" && city === "All" && !q && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 inline-flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-amber-300" /> Sab se zyada active · is hafte
            </p>
            <Badge variant="warning">Top 5</Badge>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {all.slice(0, 5).map((p, i) => (
              <SpotlightCard key={p.id} p={p} rank={i + 1} />
            ))}
          </div>
        </GlassCard>
      )}

      {/* Grid of all users */}
      {filtered.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Users className="mx-auto h-10 w-10 text-white/40" />
          <p className="mt-3 font-display text-lg">Koi user nahi mila</p>
          <p className="text-sm text-white/55">Filters ya search badal kar dekhein.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <PersonCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center">{icon}</span>
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">{label}</p>
      </div>
      <p className="mt-1.5 font-display text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition border",
        active
          ? "bg-gradient-to-r from-violet-500/30 to-cyan-400/20 border-violet-500/40 text-white shadow-[0_0_0_3px_rgba(124,58,237,0.12)]"
          : "bg-white/[0.04] border-white/[0.08] text-white/65 hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}

function SpotlightCard({ p, rank }: { p: Person; rank: number }) {
  return (
    <Link href={`/profile/${p.id}`} className="block">
      <div className="group relative rounded-2xl bg-gradient-to-br from-amber-500/10 to-pink-500/10 border border-amber-300/20 p-3 hover:border-amber-300/40 transition">
        <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-xs font-bold text-black shadow-[0_0_18px_rgba(251,191,36,0.5)]">
          {rank}
        </div>
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar name={p.fullName} size={44} ring="violet" />
            {p.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0d18]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{p.fullName}</p>
            <p className="text-[11px] text-white/55 truncate">@{p.username}</p>
            <p className="text-[10px] text-white/45 truncate inline-flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" /> {p.city}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PersonCard({ p, index }: { p: Person; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
    >
      <GlassCard hover className="p-4 h-full">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar name={p.fullName} size={48} ring={p.online ? "violet" : "none"} />
            {p.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0d0d18]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold truncate">{p.fullName}</p>
              <Badge variant="default">L{p.level}</Badge>
            </div>
            <p className="text-[11px] text-white/55 truncate">@{p.username}</p>
            <p className="text-[11px] text-white/55 inline-flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {p.city}
            </p>
          </div>
        </div>

        {p.bio && <p className="mt-3 text-xs text-white/65 line-clamp-2 leading-relaxed">{p.bio}</p>}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[10px] text-white/45">{lastSeenLabel(p)}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link href="/chat" className="flex-1">
            <Button size="sm" variant="glass" className="w-full">
              <MessageSquare className="h-3.5 w-3.5" /> Message
            </Button>
          </Link>
          <Link href={`/profile/${p.id}`} className="flex-1">
            <Button size="sm" variant="ghost" className="w-full">
              Profile
            </Button>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
