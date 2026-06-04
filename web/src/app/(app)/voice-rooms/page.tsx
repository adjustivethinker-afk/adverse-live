"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Lock,
  Mic,
  Plus,
  Search,
  Users,
  X,
  Sparkles,
  ImagePlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

type Room = {
  id: string;
  title: string;
  description?: string;
  category: string;
  host: string;
  hostId: string;
  speakers: number;
  listeners: number;
  trending?: boolean;
  hasPassword?: boolean;
  cover: string;
  createdAt: number;
};

const SEED_ROOMS: Room[] = [
  { id: "r1", title: "Karachi Walay 🌃", description: "Karachi ke logon ki shaam ki mehfil", category: "Casual", host: "Imran A.", hostId: "imran", speakers: 5, listeners: 412, trending: true, cover: "from-violet-500 to-fuchsia-500", createdAt: Date.now() - 1200_000 },
  { id: "r2", title: "Islamabad Talks", description: "Halki phulki guftgu", category: "Casual", host: "Sara M.", hostId: "sara", speakers: 4, listeners: 281, cover: "from-cyan-400 to-blue-500", createdAt: Date.now() - 800_000 },
  { id: "r3", title: "Lahori Mehfil 🎧", description: "Music aur dosti", category: "Music", host: "Hassan R.", hostId: "hassan", speakers: 6, listeners: 720, trending: true, cover: "from-pink-500 to-rose-500", createdAt: Date.now() - 1800_000 },
  { id: "r4", title: "Urdu Shayari Mehfil", description: "Apna kalam padhein", category: "Poetry", host: "Maya S.", hostId: "maya", speakers: 3, listeners: 184, hasPassword: true, cover: "from-indigo-500 to-violet-500", createdAt: Date.now() - 600_000 },
  { id: "r5", title: "Late Night Stories", description: "Apni story share karein", category: "Casual", host: "Bilal R.", hostId: "bilal", speakers: 4, listeners: 196, cover: "from-amber-400 to-orange-500", createdAt: Date.now() - 300_000 },
  { id: "r6", title: "Cricket Talks 🏏", description: "Pakistan team par baat", category: "Sports", host: "Zain", hostId: "zain", speakers: 7, listeners: 884, trending: true, cover: "from-emerald-400 to-teal-500", createdAt: Date.now() - 2400_000 },
];

const CATS = ["Sab", "Casual", "Music", "Poetry", "Sports", "Education", "Religious"];

export default function VoiceRoomsPage() {
  const user = useAuth((s) => s.user);
  const [rooms, setRooms] = useState<Room[]>(SEED_ROOMS);
  const [cat, setCat] = useState("Sab");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  // Persist locally so a room created here survives a refresh.
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("adverse-rooms");
    if (saved) {
      try {
        const parsed: Room[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setRooms((rs) => mergeRooms(rs, parsed));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("adverse-rooms", JSON.stringify(rooms));
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (q && !`${r.title} ${r.host} ${r.category}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat === "Sab") return true;
      return r.category === cat;
    });
  }, [cat, q, rooms]);

  const createRoom = (data: { title: string; description: string; category: string; password: string }) => {
    if (!user) {
      toast.error("Pehle sign in karein.");
      return;
    }
    const id = "r_" + Math.random().toString(36).slice(2, 8);
    const covers = [
      "from-violet-500 to-fuchsia-500",
      "from-cyan-400 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-emerald-400 to-teal-500",
      "from-amber-400 to-orange-500",
      "from-indigo-500 to-violet-500",
    ];
    const room: Room = {
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      host: user.fullName,
      hostId: user.id,
      speakers: 1,
      listeners: 0,
      cover: covers[Math.floor(Math.random() * covers.length)],
      hasPassword: !!data.password,
      createdAt: Date.now(),
    };
    setRooms((r) => [room, ...r]);
    setCreating(false);
    toast.success("Room ban gaya. Apke dost shamil ho sakte hain.");
  };

  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="chip"><Mic className="h-3 w-3 text-rose-300" /> {rooms.length} active rooms</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Live <span className="text-gradient-neon">Voice Rooms</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Apna room banaiye, dost ko bulaiye, mic par baat karein. Sab kuch real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
              <Search className="h-3.5 w-3.5 text-white/55" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rooms…" className="bg-transparent py-2 text-xs placeholder:text-white/35 outline-none w-48" />
            </div>
            <Button variant="neon" size="md" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Naya Room
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${cat === c ? "bg-gradient-to-r from-violet-500/30 to-cyan-400/20 ring-1 ring-violet-500/40 text-white" : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Mic className="mx-auto h-10 w-10 text-white/40" />
          <p className="mt-3 font-display text-lg">Koi active room nahi mila</p>
          <p className="text-sm text-white/55">Apna pehla room banaiye aur dosto ko bulaiye!</p>
          <Button variant="neon" size="md" className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Room banaiye
          </Button>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.id} href={`/voice-rooms/${r.id}`}>
              <GlassCard hover className="group relative overflow-hidden p-5 h-full">
                <div className={`absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br ${r.cover} opacity-30 blur-3xl group-hover:opacity-50 transition-opacity`} />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping" />
                      <span className="relative h-2 w-2 rounded-full bg-rose-500" />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">Live · {r.listeners.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-1">
                    {r.trending && <Badge variant="warning"><Flame className="h-3 w-3" /> Trending</Badge>}
                    {r.hasPassword && <Badge variant="default"><Lock className="h-3 w-3" /> Locked</Badge>}
                  </div>
                </div>
                <h3 className="relative mt-3 font-display text-lg font-semibold tracking-tight leading-snug">{r.title}</h3>
                {r.description && <p className="relative mt-1 text-xs text-white/55">{r.description}</p>}
                <p className="relative mt-2 text-[11px] text-white/55">Host: <span className="text-white/85">{r.host}</span> · {r.category}</p>

                <div className="relative mt-4 flex items-center justify-between">
                  <div className="-space-x-2 flex">
                    {Array.from({ length: Math.min(r.speakers, 4) }).map((_, j) => (
                      <Avatar key={j} name={r.host + j} size={28} ring="violet" className="ring-offset-graphite" />
                    ))}
                    {r.speakers > 4 && <span className="ml-3 chip text-[10px]">+{r.speakers - 4}</span>}
                  </div>
                  <span className="chip text-[10px]"><Users className="h-3 w-3" /> {r.speakers} mic par</span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      <AnimatePresence>
        {creating && <CreateRoomDialog onClose={() => setCreating(false)} onCreate={createRoom} />}
      </AnimatePresence>
    </div>
  );
}

function mergeRooms(seed: Room[], saved: Room[]): Room[] {
  const ids = new Set(seed.map((s) => s.id));
  return [...saved.filter((s) => !ids.has(s.id)), ...seed];
}

function CreateRoomDialog({
  onClose, onCreate,
}: {
  onClose: () => void;
  onCreate: (d: { title: string; description: string; category: string; password: string }) => void;
}) {
  const [data, setData] = useState({ title: "", description: "", category: "Casual", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.title.trim().length < 3) return toast.error("Room ka naam (title) likhein — 3+ characters.");
    onCreate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <GlassCard variant="strong" liquidBorder className="p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />
          <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>

          <div className="relative">
            <span className="chip"><Sparkles className="h-3 w-3 text-amber-300" /> New room</span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Apna <span className="text-gradient-neon">voice room</span> banaiye
            </h2>
            <p className="mt-1 text-xs text-white/55">Title, description aur category daalein. Aap room admin honge.</p>

            <form className="mt-5 space-y-3" onSubmit={submit}>
              <Input
                label="Room ka naam (title)"
                placeholder="Misal: Karachi ke Walay"
                value={data.title}
                onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
                required
              />
              <Input
                label="Room kis ke baare mein hai? (optional)"
                placeholder="Chhota sa description likhein"
                value={data.description}
                onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Category"
                  value={data.category}
                  onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))}
                  options={[
                    { value: "Casual", label: "Casual" },
                    { value: "Music", label: "Music" },
                    { value: "Poetry", label: "Poetry / Shayari" },
                    { value: "Sports", label: "Sports" },
                    { value: "Education", label: "Education" },
                    { value: "Religious", label: "Religious" },
                  ]}
                />
                <Input
                  label="Password (optional)"
                  placeholder="Khaali chodein agar public hai"
                  value={data.password}
                  onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
                <Button type="button" variant="glass" size="lg" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="neon" size="lg" className="flex-1">
                  <ImagePlus className="h-4 w-4" /> Room banaiye
                </Button>
              </div>
            </form>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
