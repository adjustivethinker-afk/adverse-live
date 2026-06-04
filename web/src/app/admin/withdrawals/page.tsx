"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpFromLine, Eye } from "lucide-react";

const ROWS = Array.from({ length: 10 }).map((_, i) => ({
  id: `W-12${450 + i}`,
  user: ["Aroush K.","Hassan R.","Sara M.","Bilal R.","Maya S.","Zoya M.","Imran A.","Reema A.","Faraz","Zain"][i],
  method: ["JazzCash","EasyPaisa","Bank","JazzCash","EasyPaisa","Bank","JazzCash","EasyPaisa","Bank","JazzCash"][i],
  amount: [2000, 1500, 6000, 800, 4500, 12000, 2200, 1800, 800, 2400][i],
  account: "+92 3xx xxxxxx" + i,
  status: ["processing","processing","completed","completed","processing","processing","completed","completed","processing","completed"][i] as "processing" | "completed" | "rejected",
  date: ["Today · 4m","Today · 11m","Today · 1h","Yest · 6h","Today · 22m","Today · 35m","Today · 50m","Yest · 8h","Today · 5m","Yest · 14h"][i],
}));

export default function AdminWithdrawalsPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="chip"><ArrowUpFromLine className="h-3 w-3" /> Withdrawal management</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Pending withdrawals · 8</h1>
            <p className="mt-1 text-sm text-white/60">Average payout time: 1.8 hrs · Auto-batched every 30 minutes</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-white/45">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ROWS.map((r) => (
                <tr key={r.id} className="border-t border-white/[0.05] hover:bg-white/[0.03] transition">
                  <td className="px-4 py-3 font-mono text-xs text-white/65">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.user} size={28} />
                      <span>{r.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{r.method}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/65">{r.account}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums">₨ {r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={r.status === "completed" ? "success" : r.status === "rejected" ? "danger" : "warning"}>{r.status}</Badge></td>
                  <td className="px-4 py-3 text-white/65">{r.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      <Button size="icon" variant="glass"><Eye className="h-3.5 w-3.5" /></Button>
                      {r.status === "processing" && (
                        <>
                          <Button size="sm" variant="success">Pay out</Button>
                          <Button size="sm" variant="ghost">Hold</Button>
                        </>
                      )}
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
