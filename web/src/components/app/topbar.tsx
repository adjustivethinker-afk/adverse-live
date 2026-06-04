"use client";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/store";

export function Topbar() {
  const user = useAuth((s) => s.user);
  const name = user?.fullName ?? "User";
  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;

  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <div className="glass rounded-2xl flex items-center gap-3 px-3 py-2">
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-neon-cta shadow-neon">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
        </Link>
        <button className="lg:hidden h-9 w-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden md:flex flex-1 items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
          <Search className="h-4 w-4 text-white/55" />
          <input
            placeholder="Search dost, rooms, transactions…"
            className="flex-1 bg-transparent py-2 text-sm placeholder:text-white/35 outline-none"
          />
          <kbd className="text-[10px] text-white/40 rounded bg-white/[0.06] px-1.5 py-0.5">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="btn-ghost-glass !h-9 !px-3 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="tabular-nums">{xp} XP</span>
          </button>
          <Link href="/notifications" className="relative h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.09]">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[9px] font-semibold flex items-center justify-center">3</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 pl-1 pr-3 py-1 hover:bg-white/[0.09]">
            <Avatar name={name} size={28} ring="violet" />
            <div className="text-xs leading-tight hidden sm:block">
              <p className="font-semibold truncate max-w-[120px]">{name}</p>
              <p className="text-white/50 text-[10px] flex items-center gap-1">
                <Badge variant="vip">PK</Badge> Lvl {level}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
