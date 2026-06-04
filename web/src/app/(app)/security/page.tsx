"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Bell, ChevronRight, Fingerprint, Key, Laptop, Lock, Monitor, ShieldCheck, Smartphone } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <span className="chip"><ShieldCheck className="h-3 w-3 text-emerald-300" /> Security center</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Your account, fortified.</h1>
            <p className="mt-1 text-sm text-white/60">Score: <span className="text-emerald-300 font-semibold">82 / 100 · Strong</span></p>
          </div>
          <div className="text-right">
            <div className="h-16 w-16 rounded-full border-4 border-emerald-500/40 flex items-center justify-center">
              <span className="font-display text-xl font-semibold text-emerald-300">82</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Authentication</p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            <Row icon={<Lock className="h-4 w-4 text-cyan-300" />} title="Password" desc="Last changed 12 days ago" status="ok" cta="Change" />
            <Row icon={<Fingerprint className="h-4 w-4 text-violet-300" />} title="Biometric login" desc="Use Face ID / Touch ID on supported devices" status="ok" cta="Manage" />
            <Row icon={<Key className="h-4 w-4 text-amber-300" />} title="Two-factor authentication" desc="Authenticator app · Active" status="ok" cta="Reconfigure" />
            <Row icon={<Smartphone className="h-4 w-4 text-emerald-300" />} title="Phone verification" desc="+92 3xx xxxxxxx · Verified" status="ok" cta="Update" />
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Active sessions</p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {[
              { icon: <Smartphone className="h-4 w-4 text-cyan-300" />, t: "iPhone 17 Pro · Karachi, PK", d: "Current device · 2m ago", current: true },
              { icon: <Laptop className="h-4 w-4 text-violet-300" />, t: "MacBook Pro · Karachi, PK", d: "Active · 1h ago" },
              { icon: <Monitor className="h-4 w-4 text-emerald-300" />, t: "Chrome · Lahore, PK", d: "Last seen 2 days ago" },
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <span className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold flex items-center gap-2">{s.t} {s.current && <Badge variant="success">Current</Badge>}</p>
                  <p className="text-[11px] text-white/55">{s.d}</p>
                </div>
                {!s.current && <Button size="sm" variant="ghost">Revoke</Button>}
              </li>
            ))}
          </ul>
          <Button size="md" variant="glass" className="mt-4 w-full justify-center">Sign out of all devices</Button>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Audit log</p>
        <ul className="mt-3 divide-y divide-white/[0.05]">
          {[
            { t: "Sign-in from new device · iPhone 17 Pro · Karachi", d: "Today · 6:42 PM", ip: "203.135.xx.x" },
            { t: "2FA enabled", d: "Today · 6:21 PM", ip: "203.135.xx.x" },
            { t: "Password changed", d: "12 days ago", ip: "175.110.xx.x" },
            { t: "Email verified", d: "May 12 · 2026", ip: "203.135.xx.x" },
          ].map((row, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5">
              <span className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center"><Bell className="h-3.5 w-3.5 text-white/65" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{row.t}</p>
                <p className="text-[11px] text-white/45">{row.d} · IP {row.ip}</p>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function Row({ icon, title, desc, status, cta }: { icon: React.ReactNode; title: string; desc: string; status: "ok" | "warn"; cta: string }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold flex items-center gap-2">{title} {status === "ok" ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Recommended</Badge>}</p>
        <p className="text-[11px] text-white/55">{desc}</p>
      </div>
      <Button size="sm" variant="glass">{cta} <ChevronRight className="h-3.5 w-3.5" /></Button>
    </li>
  );
}
