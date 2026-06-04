"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MapPin,
  MessageSquare,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PK_CITIES } from "@/lib/pk";
import { fetchFriends, type AppUser } from "@/lib/api";
import { cn } from "@/lib/utils";

type Friend = AppUser & { online: boolean };

type FilterMode = "all" | "online" | "male" | "female";

function isOnline(lastActiveAt?: string | null): boolean {
  if (!lastActiveAt) return false;
  const t = new Date(lastActiveAt).getTime();
  if (!t) return false;
  return Date.now() - t < 5 * 60 * 1000;
}

export default function FriendsPage() {
  const [items, setItems] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [city, setCity] = useState<string>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const list = await fetchFriends(80);
        if (cancelled) return;
        setItems(
          list.map((u) => ({ ...u, online: isOnline(u.lastActiveAt) })),
        );
      } catch {
        if (!cancelled) setItems([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (
        q &&
        !`${p.fullName} ${p.username} ${p.city}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      if (city !== "All" && p.city !== city) return false;
      if (filter === "online" && !p.online) return false;
      if (filter === "male" && p.gender !== "male") return false;
      if (filter === "female" && p.gender !== "female") return false;
      return true;
    });
  }, [items, filter, city, q]);

  const onlineCount = items.filter((p) => p.online).length;

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="chip">
              <Users className="h-3 w-3 text-pink-300" /> {items.length} users
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Find your <span className="text-gradient-neon">people</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {onlineCount} online now · most active first.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3 w-full sm:w-auto">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or city…"
              className="bg-transparent py-2 text-xs placeholder:text-white/35 outline-none w-full sm:w-56"
            />
          </div>
        </div>
      </GlassCard>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        <FilterChip
          active={filter === "online"}
          onClick={() => setFilter("online")}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
        </FilterChip>
        <FilterChip
          active={filter === "male"}
          onClick={() => setFilter("male")}
        >
          Male
        </FilterChip>
        <FilterChip
          active={filter === "female"}
          onClick={() => setFilter("female")}
        >
          Female
        </FilterChip>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="ml-auto bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5 text-xs outline-none [&>option]:bg-[#0d0d18]"
        >
          <option value="All">All cities</option>
          {PK_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <GlassCard className="p-8 text-center text-white/55 text-sm">
          Loading…
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Users className="mx-auto h-10 w-10 text-white/40" />
          <p className="mt-3 font-display text-lg">No users found</p>
          <p className="text-sm text-white/55">
            Try changing your filters or search.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <PersonCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
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
          ? "bg-white/[0.08] border-violet-500/40 text-white"
          : "bg-white/[0.04] border-white/[0.08] text-white/65 hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}

function PersonCard({ p }: { p: Friend }) {
  return (
    <GlassCard className="p-4 h-full">
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

      <div className="mt-3 flex items-center gap-2">
        <Link href={`/chat?to=${p.id}`} className="flex-1">
          <Button size="sm" variant="glass" className="w-full">
            <MessageSquare className="h-3.5 w-3.5" /> Message
          </Button>
        </Link>
        <Link href={`/u?u=${encodeURIComponent(p.username)}`} className="flex-1">
          <Button size="sm" variant="ghost" className="w-full">
            <UserPlus className="h-3.5 w-3.5" /> Follow
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
