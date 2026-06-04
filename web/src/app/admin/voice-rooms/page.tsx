"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Mic, MicOff, ShieldX, Star } from "lucide-react";

const ROOMS = Array.from({ length: 8 }).map((_, i) => ({
  id: `R-${500 + i}`,
  title: ["Friday Night ✦ Pakistan Talks","Crypto Daily ✦ Market open","Music & Vibes 🎧","Startup Stories with Sara","Late Night Coding 🛠","Urdu Poetry","Gaming Squad","Health & Wellness"][i],
  host: ["Aroush K.","Imran A.","Hassan R.","Sara M.","Bilal R.","Maya S.","Zain","Reema"][i],
  speakers: [5,9,4,7,3,6,5,4][i],
  listeners: [2418,1820,920,612,488,740,1234,318][i],
  category: ["Talk","Crypto","Music","Business","Tech","Poetry","Gaming","Lifestyle"][i],
  status: ["live","live","live","ended","live","live","live","ended"][i] as "live" | "ended",
  flagged: [false,false,false,false,false,true,false,false][i],
}));

export default function AdminVoiceRoomsPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="chip"><Mic className="h-3 w-3" /> Voice room management</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">428 live · 8 flagged</h1>
            <p className="mt-1 text-sm text-white/60">Realtime moderation, recording, force-close and feature-room tools.</p>
          </div>
          <Button variant="neon"><Star className="h-4 w-4" /> Feature a room</Button>
        </div>
      </GlassCard>

      <GlassCard className="p-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-white/45">
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Speakers</th>
                <th className="px-4 py-3 font-medium">Listeners</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ROOMS.map((r) => (
                <tr key={r.id} className="border-t border-white/[0.05] hover:bg-white/[0.03] transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold flex items-center gap-2">{r.title} {r.flagged && <Badge variant="danger">Flagged</Badge>}</p>
                    <p className="text-[11px] text-white/55 font-mono">{r.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.host} size={28} ring="violet" />
                      <span>{r.host}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{r.category}</td>
                  <td className="px-4 py-3 tabular-nums">{r.speakers}</td>
                  <td className="px-4 py-3 tabular-nums">{r.listeners.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "live" ? "success" : "default"} pulse={r.status === "live"}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      <Button size="sm" variant="glass">Feature</Button>
                      <Button size="sm" variant="ghost"><MicOff className="h-3.5 w-3.5" /> Mute</Button>
                      <Button size="sm" variant="danger"><ShieldX className="h-3.5 w-3.5" /> Close</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
