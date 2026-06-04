"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Image, MessageCircle, Megaphone, Send, Share2, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";

const TRENDING = ["#KarachiWalay", "#DailyQuiz", "#StreakClub", "#TopReferrers", "#VoiceRooms"];

const POSTS = [
  { u: "Aroush K.", text: "7-din ka streak mukammal! Diamond chest aa raha hai 💎", likes: 184, comments: 21, time: "2h", img: false },
  { u: "Hassan R.", text: "Aaj raat 9 baje voice room banaa raha hoon — 'Lahori Mehfil 2.0'. Sab aaiye!", likes: 92, comments: 14, time: "3h", img: false },
  { u: "Sara M.", text: "Pro tip: roz ek hi waqt par quiz solve karein, habit ban jaati hai.", likes: 240, comments: 38, time: "5h", img: false },
];

const ANNOUNCEMENTS = [
  { t: "Weekly chest har Sunday", d: "Roz keys kamaiye, har Sunday 9 PM par chest unlock." },
  { t: "Withdrawal speeds behtar", d: "Ab average payout 2 ghante ke andar hota hai." },
];

export default function CommunityPage() {
  const [text, setText] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <GlassCard className="p-4">
          <div className="flex items-start gap-3">
            <Avatar name="You" size={40} ring="violet" />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share something with the community…"
                rows={2}
                className="w-full bg-transparent text-sm placeholder:text-white/40 outline-none resize-none"
              />
              <div className="mt-2 flex items-center gap-2">
                <button className="rounded-full bg-white/[0.04] border border-white/[0.08] p-2 hover:bg-white/[0.07]"><Image className="h-4 w-4" /></button>
                <button className="rounded-full bg-white/[0.04] border border-white/[0.08] p-2 hover:bg-white/[0.07]"><Smile className="h-4 w-4" /></button>
                <Button size="sm" variant="neon" className="ml-auto" disabled={!text}>
                  <Send className="h-3.5 w-3.5" /> Post
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {POSTS.map((p, i) => (
          <GlassCard key={i} hover className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={p.u} size={40} ring="violet" />
              <div className="flex-1">
                <p className="text-sm font-semibold flex items-center gap-2">{p.u} <Badge>L{i+1}</Badge></p>
                <p className="text-[11px] text-white/45">{p.time} ago · Public</p>
              </div>
              <Button size="sm" variant="ghost">Follow</Button>
            </div>
            <p className="mt-3 text-sm text-white/85 leading-relaxed">{p.text}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/65">
              <button className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 hover:bg-white/[0.07]">
                <Heart className="h-3.5 w-3.5" /> {p.likes}
              </button>
              <button className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 hover:bg-white/[0.07]">
                <MessageCircle className="h-3.5 w-3.5" /> {p.comments}
              </button>
              <button className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 hover:bg-white/[0.07] ml-auto">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Trending</p>
            <TrendingUp className="h-3.5 w-3.5 text-cyan-300" />
          </div>
          <ul className="mt-3 grid gap-1.5">
            {TRENDING.map((t) => (
              <li key={t}>
                <a href="#" className="block rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm hover:bg-white/[0.07]">{t}</a>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Announcements</p>
            <Megaphone className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <ul className="mt-3 space-y-2.5">
            {ANNOUNCEMENTS.map((a) => (
              <li key={a.t} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3">
                <p className="text-sm font-semibold">{a.t}</p>
                <p className="text-[11px] text-white/55 mt-0.5">{a.d}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
