"use client";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store";
import { fetchFriends, type AppUser } from "@/lib/api";
import { cn } from "@/lib/utils";

type Friend = AppUser & { online: boolean };

function isOnline(lastActiveAt?: string | null): boolean {
  if (!lastActiveAt) return false;
  const t = new Date(lastActiveAt).getTime();
  return Boolean(t) && Date.now() - t < 5 * 60 * 1000;
}

export default function ChatPage() {
  return (
    <div className="space-y-4 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Chat</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                Messages are migrating to the new backend.
              </h1>
            </div>
            <Badge variant="success">Live API</Badge>
          </div>
          <p className="mt-3 text-sm text-white/65">
            The user directory is powered by the new PHP/MySQL API. Chat message storage will be added in the next migration phase.
          </p>
        </GlassCard>

        <Suspense fallback={<p className="text-sm text-white/60">Loading friends...</p>}>
          <FriendDirectory />
        </Suspense>
      </div>
    </div>
  );
}

function FriendDirectory() {
  const me = useAuth((s) => s.user);
  const searchParams = useSearchParams();
  const initialTo = searchParams.get("to");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(initialTo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await fetchFriends(80);
        if (cancelled) return;
        setFriends(
          list.map((user) => ({
            ...user,
            online: isOnline(user.lastActiveAt),
          })),
        );
      } catch {
        if (!cancelled) setFriends([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return friends;
    const searchLower = search.toLowerCase();
    return friends.filter(
      (friend) =>
        friend.fullName.toLowerCase().includes(searchLower) ||
        friend.username.toLowerCase().includes(searchLower) ||
        friend.city.toLowerCase().includes(searchLower),
    );
  }, [friends, search]);

  if (!me) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr] h-[calc(100vh-9rem)]">
      <GlassCard className="flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Friends</p>
              <p className="mt-1 text-sm text-white/70">Browse users you can message.</p>
            </div>
            <Badge variant="default">{friends.length}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users…"
              className="w-full bg-transparent text-xs placeholder:text-white/35 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {loading ? (
            <p className="text-sm text-white/60">Loading users…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-white/55">No users found.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((friend) => (
                <li key={friend.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(friend.id)}
                    className={cn(
                      "w-full rounded-2xl p-3 text-left transition",
                      activeId === friend.id
                        ? "bg-white/[0.08] ring-1 ring-violet-500/30"
                        : "hover:bg-white/[0.05]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={friend.fullName} size={40} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{friend.fullName}</p>
                        <p className="text-[11px] text-white/55 truncate">
                          @{friend.username} · {friend.city}
                        </p>
                      </div>
                      <span className={cn(
                        "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em]",
                        friend.online ? "bg-emerald-400/10 text-emerald-200" : "bg-white/[0.04] text-white/55",
                      )}>
                        {friend.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>

      <GlassCard className="hidden lg:flex flex-col items-center justify-center p-8 border-white/[0.06] text-center">
        <MessageSquare className="mx-auto h-16 w-16 text-cyan-300" />
        <p className="mt-6 text-xl font-semibold">Chat is being rebuilt</p>
        <p className="mt-3 text-sm text-white/60 max-w-md">
          The messaging experience is now connected to the new PHP/MySQL backend. This page will show conversations once the chat API is enabled.
        </p>
        <Button className="mt-6" variant="neon">
          Feature coming soon
        </Button>
      </GlassCard>
    </div>
  );
}
