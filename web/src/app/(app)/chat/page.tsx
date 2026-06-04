"use client";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveUsers, lastSeenLabel, type Person } from "@/lib/people";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  at: number;
  read?: boolean;
};

type Thread = {
  personId: string;
  messages: Message[];
};

const SEED_THREADS: Record<string, Message[]> = {
  p2: [
    { id: "1", from: "them", text: "Salam Aroush! Kal Lahore aana ho raha hai?", at: Date.now() - 1000 * 60 * 60 * 5 },
    { id: "2", from: "me", text: "Wa alaikum salam Hassan! Haan, Insha'Allah Friday ko.", at: Date.now() - 1000 * 60 * 60 * 4, read: true },
    { id: "3", from: "them", text: "Mast! Phir room banayenge — 'Lahori Mehfil 2.0' 🎧", at: Date.now() - 1000 * 60 * 60 * 4 },
  ],
  p3: [
    { id: "1", from: "them", text: "Aapne aaj ka quiz solve kiya?", at: Date.now() - 1000 * 60 * 30 },
    { id: "2", from: "me", text: "Haan! Sahi aaya, +30 reward mil gaya 🎉", at: Date.now() - 1000 * 60 * 28, read: true },
  ],
  p1: [
    { id: "1", from: "them", text: "Karachi Walay room mein milte hain shaam ko 🌃", at: Date.now() - 1000 * 60 * 90 },
  ],
  p6: [
    { id: "1", from: "them", text: "Cricket Talks room kal 9 baje shuru.", at: Date.now() - 1000 * 60 * 60 * 26 },
    { id: "2", from: "me", text: "Pakka jaldi join karunga. PSL highlights bhi rakh lena 🏏", at: Date.now() - 1000 * 60 * 60 * 25, read: true },
  ],
};

export default function ChatPage() {
  const me = useAuth((s) => s.user);
  const all = useMemo(() => getActiveUsers(), []);

  // Show only those with whom you have an active conversation OR top active users.
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED_THREADS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const conversationList = useMemo(() => {
    const knownIds = new Set(Object.keys(threads));
    const known = all.filter((p) => knownIds.has(p.id));
    const suggestions = all.filter((p) => !knownIds.has(p.id)).slice(0, 6);
    const filterFn = (p: Person) =>
      !search ||
      `${p.fullName} ${p.username} ${p.city}`.toLowerCase().includes(search.toLowerCase());
    return {
      conversations: known.filter(filterFn),
      suggestions: suggestions.filter(filterFn),
    };
  }, [threads, all, search]);

  const sendMessage = (text: string) => {
    if (!activeId || !text.trim()) return;
    const msg: Message = { id: String(Date.now()), from: "me", text: text.trim(), at: Date.now(), read: false };
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), msg] }));

    // Simulate other person typing + replying
    setTimeout(() => {
      const replies = [
        "Acha 😄",
        "Sahi baat hai!",
        "Insha'Allah kal milte hain.",
        "Haan bilkul.",
        "Voice room mein aao na?",
        "Quiz mein aaj ka jawab kya tha?",
      ];
      const reply: Message = {
        id: String(Date.now() + 1),
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        at: Date.now(),
      };
      setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), reply] }));
    }, 1100 + Math.random() * 1200);
  };

  const activePerson = activeId ? all.find((p) => p.id === activeId) : null;

  return (
    <div className="grid gap-3 lg:grid-cols-[340px_1fr] h-[calc(100vh-7rem)]">
      {/* Sidebar — conversations */}
      <GlassCard className={cn("flex flex-col h-full overflow-hidden", activeId && "hidden lg:flex")}>
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold tracking-tight inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-300" /> Messages
            </p>
            <Badge variant="default">{Object.keys(threads).length}</Badge>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
            <Search className="h-3.5 w-3.5 text-white/55" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 bg-transparent py-2 text-xs placeholder:text-white/35 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {conversationList.conversations.length > 0 && (
            <ul className="p-2">
              {conversationList.conversations.map((p) => (
                <ConvoRow
                  key={p.id}
                  p={p}
                  active={activeId === p.id}
                  msgs={threads[p.id] ?? []}
                  onClick={() => setActiveId(p.id)}
                />
              ))}
            </ul>
          )}

          {conversationList.suggestions.length > 0 && (
            <div className="px-2">
              <p className="px-2 mt-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                Naye dost ban sakte hain
              </p>
              <ul>
                {conversationList.suggestions.map((p) => (
                  <ConvoRow
                    key={p.id}
                    p={p}
                    active={activeId === p.id}
                    msgs={[]}
                    onClick={() => setActiveId(p.id)}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Active conversation */}
      <GlassCard className={cn("flex flex-col h-full overflow-hidden", !activeId && "hidden lg:flex")}>
        {!activePerson ? (
          <EmptyState />
        ) : (
          <ConversationView
            person={activePerson}
            messages={threads[activePerson.id] ?? []}
            onBack={() => setActiveId(null)}
            onSend={sendMessage}
            myName={me?.fullName?.split(" ")[0] ?? "You"}
          />
        )}
      </GlassCard>
    </div>
  );
}

function ConvoRow({
  p, active, msgs, onClick,
}: {
  p: Person;
  active: boolean;
  msgs: Message[];
  onClick: () => void;
}) {
  const last = msgs[msgs.length - 1];
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition",
          active
            ? "bg-gradient-to-r from-violet-500/20 to-cyan-400/10 ring-1 ring-violet-500/30"
            : "hover:bg-white/[0.05]",
        )}
      >
        <div className="relative shrink-0">
          <Avatar name={p.fullName} size={42} />
          {p.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0d18]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium truncate">{p.fullName}</p>
            {last && (
              <span className="text-[10px] text-white/40 shrink-0 tabular-nums">{relTime(last.at)}</span>
            )}
          </div>
          <p className="text-xs text-white/55 truncate">
            {last ? (last.from === "me" ? "Aap: " : "") + last.text : `Salam bhejein · ${p.city}`}
          </p>
        </div>
      </button>
    </li>
  );
}

function ConversationView({
  person, messages, onBack, onSend, myName,
}: {
  person: Person;
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => void;
  myName: string;
}) {
  const [text, setText] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
        <button onClick={onBack} className="lg:hidden h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="relative">
          <Avatar name={person.fullName} size={40} ring="violet" />
          {person.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0d18]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{person.fullName}</p>
          <p className="text-[11px] text-white/55 truncate">{lastSeenLabel(person)} · {person.city}</p>
        </div>
        <button className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.1]">
          <Phone className="h-4 w-4 text-white/70" />
        </button>
        <button className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/[0.1]">
          <Video className="h-4 w-4 text-white/70" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.05),transparent_50%)]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)]">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <p className="mt-4 font-display text-lg">Salam {person.fullName.split(" ")[0]}!</p>
            <p className="text-sm text-white/55 max-w-xs">
              Pehla message bhej kar baat shuru karein. Sab kuch encrypted aur secure hai.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Bubble key={m.id} m={m} prev={messages[i - 1]} myName={myName} themName={person.fullName.split(" ")[0]} />
          ))}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3 py-1.5">
          <button className="h-9 w-9 rounded-lg hover:bg-white/[0.08] flex items-center justify-center">
            <Smile className="h-4 w-4 text-white/65" />
          </button>
          <button className="h-9 w-9 rounded-lg hover:bg-white/[0.08] flex items-center justify-center">
            <Paperclip className="h-4 w-4 text-white/65" />
          </button>
          <button className="h-9 w-9 rounded-lg hover:bg-white/[0.08] flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-white/65" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Apna message likhein…"
            rows={1}
            className="flex-1 max-h-32 resize-none bg-transparent py-2.5 text-sm placeholder:text-white/35 outline-none"
          />
          {text.trim() ? (
            <Button onClick={submit} size="sm" variant="neon" className="!h-10 !w-10 !p-0 rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <button className="h-10 w-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
              <Mic className="h-4 w-4 text-white/65" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Bubble({ m, prev, myName, themName }: { m: Message; prev?: Message; myName: string; themName: string }) {
  const isMe = m.from === "me";
  const showHeader = !prev || prev.from !== m.from;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-[0_4px_12px_-6px_rgba(0,0,0,0.5)]",
          isMe
            ? "bg-gradient-to-br from-violet-500/90 to-fuchsia-500/90 text-white rounded-br-sm"
            : "bg-white/[0.06] border border-white/[0.06] text-white/90 rounded-bl-sm",
        )}
      >
        {showHeader && !isMe && <p className="text-[10px] font-semibold text-cyan-300 mb-0.5">{themName}</p>}
        <p className="whitespace-pre-wrap">{m.text}</p>
        <div className="mt-0.5 flex items-center justify-end gap-1">
          <span className={cn("text-[10px]", isMe ? "text-white/70" : "text-white/40")}>{shortTime(m.at)}</span>
          {isMe && (m.read ? (
            <CheckCheck className="h-3 w-3 text-cyan-200" />
          ) : (
            <Check className="h-3 w-3 text-white/60" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(124,58,237,0.7)]">
        <MessageSquare className="h-9 w-9 text-white" />
      </div>
      <p className="mt-5 font-display text-2xl font-semibold tracking-tight">Apni guftgu shuru karein</p>
      <p className="mt-1.5 max-w-sm text-sm text-white/55">
        Bayein side se kisi dost ko select karein aur apna pehla message bhejein.
        Sab kuch real-time, simple aur secure.
      </p>
    </div>
  );
}

function relTime(t: number) {
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function shortTime(t: number) {
  const d = new Date(t);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
