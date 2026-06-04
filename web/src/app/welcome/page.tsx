"use client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Coins, Gift, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl">
        <GlassCard
          variant="strong"
          className="p-8 sm:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

          <div className="relative mx-auto h-24 w-24">
            <div className="h-full w-full rounded-3xl bg-neon-cta flex items-center justify-center">
              <Gift className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="relative mt-6 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome to <span className="text-gradient-neon">AdVerse Live</span>
          </h1>

          <p className="relative mt-2 text-sm text-white/60">
            Your account is ready. Here&apos;s a small gift to get you started!
          </p>

          <div className="relative mt-7">
            <div className="mx-auto inline-flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] px-6 py-4">
              <Coins className="h-5 w-5 text-amber-300" />
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Welcome bonus
                </p>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  + ₨ 10.00
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-3 gap-2 text-left">
            <Mini
              icon={<Sparkles className="h-3.5 w-3.5" />}
              label="Daily"
              value="Quiz reward"
            />
            <Mini
              icon={<Users className="h-3.5 w-3.5" />}
              label="Build"
              value="Your team"
            />
            <Mini
              icon={<Coins className="h-3.5 w-3.5" />}
              label="Earn"
              value="Halal income"
            />
          </div>

          <div className="relative mt-8 flex flex-col sm:flex-row items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              variant="neon"
              className="flex-1 w-full"
            >
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push("/quiz")}
              size="lg"
              variant="glass"
              className="flex-1 w-full"
            >
              Take today&apos;s quiz
            </Button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

function Mini({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
        {icon}
      </span>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
