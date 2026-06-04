"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Crown,
  Gift,
  Hand,
  Heart,
  Lock,
  LockOpen,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  Send,
  Share2,
  ShieldCheck,
  Smile,
  UserMinus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Seat = {
  id: number;
  user?: { name: string; isHost?: boolean; isMod?: boolean };
  locked: boolean; // admin can lock so users cannot take this seat
  muted: boolean;
  vu: number;
};

type ChatMsg = { id: number; u: string; t: string; time: string };

const SEED_SEATS: Seat[] = [
  { id: 1, user: { name: "Aroush K.", isHost: true }, locked: false, muted: false, vu: 0.7 },
  { id: 2, user: { name: "Hassan R.", isMod: true }, locked: false, muted: false, vu: 0.4 },
  { id: 3, user: { name: "Sara M." }, locked: false, muted: false, vu: 0.85 },
  { id: 4, user: { name: "Bilal R." }, locked: false, muted: true, vu: 0.2 },
  { id: 5, locked: false, muted: false, vu: 0 },
  { id: 6, locked: true, muted: false, vu: 0 },
  { id: 7, locked: false, muted: false, vu: 0 },
  { id: 8, locked: false, muted: false, vu: 0 },
];

const REACTIONS = ["❤️", "🔥", "🎉", "👏", "💎", "✨"];

const INITIAL_CHAT: ChatMsg[] = [
  { id: 1, u: "Sara", t: "Yeh room kamaal ka hai 🔥", time: "2:14" },
  { id: 2, u: "Hassan", t: "Khush amdeed sab ko!", time: "2:14" },
  { id: 3, u: "Reema", t: "Abhi join kiya ✨", time: "2:15" },
];

export default function VoiceRoomLive() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const [seats, setSeats] = useState<Seat[]>(SEED_SEATS);
  const [chat, setChat] = useState<ChatMsg[]>(INITIAL_CHAT);
  const [text, setText] = useState("");
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; emoji: string }[]>([]);

  // Demo: assume current user is the host. In production, derive from room.hostId === user.id.
  const isHost = useMemo(() => true, []);

  const toggleLock = (id: number) => {
    if (!isHost) return toast.error("Sirf host seat lock kar sakta hai.");
    setSeats((s) => s.map((x) => (x.id === id ? { ...x, locked: !x.locked } : x)));
    toast.success("Seat status update ho gaya.");
  };

  const toggleMute = (id: number) => {
    setSeats((s) =>
      s.map((x) =>
        x.id === id
          ? {
              ...x,
              muted: !x.muted,
            }
          : x,
      ),
    );
  };

  const removeFromStage = (id: number) => {
    if (!isHost) return toast.error("Sirf host kisi ko stage se hata sakta hai.");
    setSeats((s) => s.map((x) => (x.id === id ? { ...x, user: undefined, muted: false, vu: 0 } : x)));
    toast.success("User ko stage se hata diya gaya.");
  };

  const takeSeat = (id: number) => {
    const seat = seats.find((s) => s.id === id);
    if (!seat) return;
    if (seat.locked) return toast.error("Yeh seat admin ne lock ki hui hai.");
    if (seat.user) return toast.error("Yeh seat already kisi user ne li hai.");
    if (mySeat != null)
      setSeats((s) => s.map((x) => (x.id === mySeat ? { ...x, user: undefined, vu: 0 } : x)));
    setSeats((s) =>
      s.map((x) => (x.id === id ? { ...x, user: { name: user?.fullName ?? "You" }, vu: 0.5 } : x)),
    );
    setMySeat(id);
    toast.success("Aap mic par aa gaye!");
  };

  const leaveSeat = () => {
    if (mySeat == null) return;
    setSeats((s) => s.map((x) => (x.id === mySeat ? { ...x, user: undefined, vu: 0 } : x)));
    setMySeat(null);
  };

  // Animate VU bars softly for active mics
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((s) =>
        s.map((x) =>
          x.user && !x.muted
            ? { ...x, vu: Math.max(0.1, Math.min(0.95, x.vu + (Math.random() - 0.5) * 0.4)) }
            : x,
        ),
      );
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const send = () => {
    if (!text.trim()) return;
    setChat((c) => [...c, { id: Date.now(), u: user?.fullName?.split(" ")[0] ?? "You", t: text, time: "now" }]);
    setText("");
  };

  const sendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatingHearts((h) => [...h, { id, emoji }]);
    setTimeout(() => setFloatingHearts((h) => h.filter((x) => x.id !== id)), 2000);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <GlassCard variant="strong" liquidBorder className="relative overflow-hidden p-5 sm:p-6">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />

        {/* Floating reactions */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ y: 0, opacity: 1, scale: 0.5, x: Math.random() * 200 - 100 }}
                animate={{ y: -300, opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-32 left-1/2 text-3xl"
              >
                {h.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-rose-500" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/65">
                Live · {seats.filter((s) => s.user).length} mic par
              </span>
              {isHost && <Badge variant="host" pulse>Host</Badge>}
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Karachi Walay 🌃
            </h1>
            <p className="mt-1 text-sm text-white/60">Karachi ke logon ki shaam ki mehfil</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="glass"><Share2 className="h-3.5 w-3.5" /> Invite</Button>
            <Button size="sm" variant="glass"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        {/* Stage seats grid */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
              Stage · {seats.filter((s) => s.user).length} / {seats.length}
            </p>
            {isHost && (
              <span className="chip text-[10px]"><ShieldCheck className="h-3 w-3 text-cyan-300" /> Host controls</span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {seats.map((seat) => (
              <SeatCard
                key={seat.id}
                seat={seat}
                isHost={isHost}
                isMine={mySeat === seat.id}
                onTake={() => takeSeat(seat.id)}
                onToggleLock={() => toggleLock(seat.id)}
                onToggleMute={() => toggleMute(seat.id)}
                onRemove={() => removeFromStage(seat.id)}
              />
            ))}
          </div>
        </div>

        {/* Listeners */}
        <div className="relative mt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Audience</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["Zain", "Kashaf", "Ali", "Hira", "Daniyal", "Mehak", "Faraz", "Reema", "Ahmed", "Saad"].map((n) => (
              <Avatar key={n} name={n} size={32} className="ring-1 ring-white/10" />
            ))}
            <span className="chip">+ 412 aur</span>
          </div>
        </div>

        {/* Reactions */}
        <div className="relative mt-6 flex items-center gap-2 overflow-hidden rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
          <p className="text-xs text-white/55 mr-1">React:</p>
          {REACTIONS.map((r) => (
            <button key={r} onClick={() => sendReaction(r)} className="text-xl hover:scale-125 transition">
              {r}
            </button>
          ))}
          <span className="ml-auto chip text-[10px]"><Heart className="h-3 w-3 text-rose-400" /> 12.4k</span>
        </div>

        {/* Controls */}
        <div className="relative mt-6 flex flex-wrap items-center gap-2">
          {mySeat != null ? (
            <>
              <Button onClick={() => toggleMute(mySeat)} variant={seats.find((s) => s.id === mySeat)?.muted ? "danger" : "neon"}>
                {seats.find((s) => s.id === mySeat)?.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {seats.find((s) => s.id === mySeat)?.muted ? "Unmute" : "Mute"}
              </Button>
              <Button variant="glass" onClick={leaveSeat}><Hand className="h-4 w-4" /> Stage chodein</Button>
            </>
          ) : (
            <Button variant="glass">
              <Hand className="h-4 w-4" /> Empty seat par tap karein mic ke liye
            </Button>
          )}
          <Button variant="glass"><Gift className="h-4 w-4" /> Tohfa bhejein</Button>
          <Button variant="glass"><Smile className="h-4 w-4" /></Button>
          <Button variant="danger" className="ml-auto" onClick={() => router.push("/voice-rooms")}>
            <PhoneOff className="h-4 w-4" /> Leave
          </Button>
        </div>
      </GlassCard>

      {/* Right column: chat + admin tools */}
      <div className="space-y-4">
        {isHost && (
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-cyan-300" /> Admin tools
              </p>
              <Badge variant="default">Host</Badge>
            </div>
            <p className="mt-2 text-xs text-white/55">
              Aap room owner hain. Seats ko lock/unlock karein, kisi user ko mute karein ya stage se hatayein.
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <li className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-2.5">
                <p className="text-white/55">Locked seats</p>
                <p className="font-display text-base font-semibold">{seats.filter((s) => s.locked).length}</p>
              </li>
              <li className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-2.5">
                <p className="text-white/55">Active mics</p>
                <p className="font-display text-base font-semibold">{seats.filter((s) => s.user && !s.muted).length}</p>
              </li>
            </ul>
          </GlassCard>
        )}

        <GlassCard className="p-5 flex-1 flex flex-col h-[520px]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Live chat</p>
            <span className="chip text-[10px]"><Users className="h-3 w-3" /> 412 yahan</span>
          </div>
          <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {chat.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-white/[0.04] p-2.5"
              >
                <Avatar name={m.u} size={28} />
                <div className="flex-1">
                  <p className="text-xs">
                    <span className="font-semibold">{m.u}</span>{" "}
                    <span className="text-white/40 ml-1">{m.time}</span>
                  </p>
                  <p className="text-sm text-white/85">{m.t}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-1 pl-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message likhein…"
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-white/35 outline-none"
            />
            <Button onClick={send} size="sm" variant="neon"><Send className="h-3.5 w-3.5" /></Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SeatCard({
  seat, isHost, isMine, onTake, onToggleLock, onToggleMute, onRemove,
}: {
  seat: Seat;
  isHost: boolean;
  isMine: boolean;
  onTake: () => void;
  onToggleLock: () => void;
  onToggleMute: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <button
        onClick={() => {
          if (!seat.user) onTake();
          else if (isHost && !seat.user.isHost) setOpen((o) => !o);
        }}
        className={[
          "relative h-16 w-16 rounded-2xl flex items-center justify-center border transition",
          seat.user
            ? "border-violet-500/50 bg-gradient-to-br from-violet-500/15 to-cyan-400/10"
            : seat.locked
            ? "border-rose-500/30 bg-rose-500/5"
            : "border-dashed border-white/15 bg-white/[0.03] hover:bg-white/[0.07]",
          isMine && "ring-2 ring-cyan-400/60 shadow-[0_0_0_4px_rgba(0,229,255,0.18)]",
        ].join(" ")}
      >
        {seat.user ? (
          <>
            <Avatar name={seat.user.name} size={56} ring={seat.user.isHost ? "violet" : "neon"} />
            {seat.user.isHost && (
              <Crown className="absolute -top-1.5 -right-1.5 h-4 w-4 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
            )}
            {seat.muted && (
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center">
                <MicOff className="h-3 w-3 text-white" />
              </span>
            )}
            {!seat.muted && (
              <div aria-hidden className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-3">
                {[0.7, 1, 0.5, 0.85, 0.4].map((m, i) => (
                  <span
                    key={i}
                    style={{ height: `${seat.vu * m * 100}%` }}
                    className="block w-0.5 rounded-full bg-gradient-to-t from-cyan-400 to-violet-500 transition-all"
                  />
                ))}
              </div>
            )}
          </>
        ) : seat.locked ? (
          <Lock className="h-5 w-5 text-rose-300" />
        ) : (
          <Mic className="h-5 w-5 text-white/40" />
        )}
      </button>
      <p className="text-[11px] font-medium text-center max-w-full truncate">
        {seat.user?.name ?? (seat.locked ? "Locked" : "Empty")}
      </p>
      {seat.user?.isHost && <Badge variant="host">Host</Badge>}
      {seat.user?.isMod && <Badge variant="mod">Mod</Badge>}

      {/* Host menu */}
      <AnimatePresence>
        {open && isHost && seat.user && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute z-30 top-full mt-1 left-1/2 -translate-x-1/2 glass-strong rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[140px]"
          >
            <button
              onClick={() => { onToggleMute(); setOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/[0.08]"
            >
              {seat.muted ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              {seat.muted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={() => { onRemove(); setOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
            >
              <UserMinus className="h-3.5 w-3.5" /> Remove
            </button>
          </motion.div>
        )}
        {open && isHost && !seat.user && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute z-30 top-full mt-1 left-1/2 -translate-x-1/2 glass-strong rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[140px]"
          >
            <button
              onClick={() => { onToggleLock(); setOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-white/[0.08]"
            >
              {seat.locked ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {seat.locked ? "Unlock seat" : "Lock seat"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isHost && !seat.user && (
        <button
          onClick={onToggleLock}
          className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider transition ${
            seat.locked ? "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25" : "bg-white/[0.06] text-white/55 hover:bg-white/[0.12]"
          }`}
        >
          {seat.locked ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          {seat.locked ? "Unlock" : "Lock"}
        </button>
      )}
    </div>
  );
}
