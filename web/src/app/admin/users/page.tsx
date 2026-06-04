"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Filter, MoreHorizontal, Search, Shield, UserPlus, UserX } from "lucide-react";
import { useState } from "react";

const USERS = Array.from({ length: 12 }).map((_, i) => ({
  id: `U-${1000 + i}`,
  name: ["Aroush K.","Hassan R.","Sara M.","Bilal R.","Maya S.","Zoya M.","Imran A.","Reema A.","Faraz","Zain","Kashaf","Naveed"][i],
  email: ["aroush","hassan","sara","bilal","maya","zoya","imran","reema","faraz","zain","kashaf","naveed"][i] + "@adverse.live",
  status: ["active","active","banned","active","active","flagged","active","active","banned","active","active","flagged"][i] as "active" | "banned" | "flagged",
  level: [12, 9, 4, 7, 6, 3, 11, 5, 2, 4, 6, 3][i],
  earned: [184902, 92140, 11200, 51200, 38420, 18420, 121800, 28640, 4200, 19400, 32100, 21800][i],
  joined: ["May 12","May 10","Apr 22","May 14","May 18","May 21","Apr 18","May 19","Apr 30","May 6","May 9","May 14"][i],
  vip: [true, false, false, true, false, false, true, false, false, false, false, false][i],
}));

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "banned" | "flagged">("all");
  const filtered = USERS.filter((u) => (status === "all" || u.status === status) && (q === "" || `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="chip"><Shield className="h-3 w-3" /> User management</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">120,480 users</h1>
            <p className="mt-1 text-sm text-white/60">Active 96.8% · Banned 1.4% · Flagged 1.8%</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
              <Search className="h-3.5 w-3.5 text-white/55" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="bg-transparent py-2 text-xs placeholder:text-white/35 outline-none w-48" />
            </div>
            <Button variant="glass"><Filter className="h-4 w-4" /> Filters</Button>
            <Button variant="neon"><UserPlus className="h-4 w-4" /> Add admin</Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["all","active","flagged","banned"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-3 py-1.5 text-xs transition capitalize ${status === s ? "bg-gradient-to-r from-rose-500/30 to-violet-500/20 ring-1 ring-rose-500/40 text-white" : "bg-white/[0.04] text-white/65 hover:bg-white/[0.08]"}`}>
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-white/45">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Earned</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-white/[0.05] hover:bg-white/[0.03] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size={32} ring={u.vip ? "violet" : "none"} />
                      <div>
                        <p className="font-semibold flex items-center gap-2">{u.name} {u.vip && <Badge variant="vip">VIP</Badge>}</p>
                        <p className="text-[11px] text-white/55">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/65">{u.id}</td>
                  <td className="px-4 py-3"><Badge variant={u.status === "active" ? "success" : u.status === "banned" ? "danger" : "warning"}>{u.status}</Badge></td>
                  <td className="px-4 py-3 tabular-nums">{u.level}</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-300">₨ {u.earned.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white/65">{u.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      {u.status === "banned" ? (
                        <Button size="sm" variant="success">Unban</Button>
                      ) : (
                        <Button size="sm" variant="ghost"><UserX className="h-3.5 w-3.5" /> Ban</Button>
                      )}
                      <Button size="icon" variant="glass"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
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
