"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, Eye, Shield, ShieldOff, ShieldX } from "lucide-react";

const ALERTS = [
  { u: "Faraz A.", reason: "5 referrals from same device fingerprint", level: "high", risk: 92 },
  { u: "Reema K.", reason: "Account creation from same IP cluster (8x)", level: "high", risk: 88 },
  { u: "Naveed", reason: "Repeated failed deposits with edited TXN IDs", level: "med", risk: 64 },
  { u: "Saad", reason: "Voice room reactions exceed human-rate threshold", level: "med", risk: 58 },
  { u: "Mehak", reason: "Login from rotating IPs (5 countries)", level: "low", risk: 41 },
] as const;

export default function FraudPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-rose-500/30 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="chip"><AlertTriangle className="h-3 w-3 text-rose-300" /> Fraud monitor</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">3 active alerts · 14 monitored</h1>
            <p className="mt-1 text-sm text-white/60">Anti-fraud engine analyzes device, IP, behavioral, and rate signals.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="danger" pulse>2 high</Badge>
            <Badge variant="warning" pulse>2 med</Badge>
            <Badge variant="default">1 low</Badge>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Top alerts</p>
        <ul className="mt-3 space-y-2">
          {ALERTS.map((a) => (
            <li key={a.u} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
              <Avatar name={a.u} size={36} ring={a.level === "high" ? "live" : "none"} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold flex items-center gap-2">{a.u} <Badge variant={a.level === "high" ? "danger" : a.level === "med" ? "warning" : "default"}>{a.level}</Badge></p>
                <p className="text-[11px] text-white/65">{a.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Risk</p>
                  <p className="font-display text-lg font-semibold tabular-nums">{a.risk}</p>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="glass"><Eye className="h-3.5 w-3.5" /> Investigate</Button>
                  <Button size="sm" variant="danger"><ShieldX className="h-3.5 w-3.5" /> Suspend</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
