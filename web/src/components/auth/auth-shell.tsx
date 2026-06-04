"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FloatingOrbs } from "@/components/fx/floating-orbs";
import { Particles } from "@/components/fx/particles";

export function AuthShell({
  title,
  subtitle,
  children,
  side,
  footer,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  side?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6">
      <FloatingOrbs />
      <Particles count={20} />

      <div className="relative w-full max-w-6xl">
        <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-neon-cta shadow-neon">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            AdVerse <span className="text-gradient-neon">Live</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard variant="strong" liquidBorder className="grid lg:grid-cols-[1fr_1fr]">
            <div className="p-6 sm:p-10">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-white/60">{subtitle}</p>
              )}
              <div className="mt-7">{children}</div>
              {footer && <div className="mt-6">{footer}</div>}
            </div>
            <div className="hidden lg:block relative overflow-hidden border-l border-white/[0.06]">
              {side ?? <DefaultSide />}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}

function DefaultSide() {
  return (
    <div className="relative h-full p-10 flex flex-col justify-end">
      <div className="absolute inset-0 bg-aurora-1" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">A premium experience</p>
        <p className="mt-3 font-display text-3xl font-semibold tracking-tight leading-tight">
          “The cleanest fintech-meets-creator experience I've used.”
        </p>
        <p className="mt-3 text-sm text-white/60">— TechRadar Premium · 9.4 / 10</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Welcome bonus</p>
            <p className="mt-1 font-display text-2xl font-semibold">₨ 10</p>
          </div>
          <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Avg payout</p>
            <p className="mt-1 font-display text-2xl font-semibold">&lt; 2 hrs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
