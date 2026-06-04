"use client";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

export function PageStub({ title, subtitle, chip }: { title: string; subtitle?: string; chip?: string }) {
  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative">
          {chip && <span className="chip">{chip}</span>}
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
        </div>
      </GlassCard>
      <GlassCard className="p-10 text-center">
        <Badge variant="neon" pulse>Coming soon</Badge>
        <p className="mt-3 text-sm text-white/60">This section is in active development.</p>
      </GlassCard>
    </div>
  );
}
