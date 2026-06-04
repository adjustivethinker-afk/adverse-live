"use client";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Coins, Gift, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Particles } from "@/components/fx/particles";
import { FloatingOrbs } from "@/components/fx/floating-orbs";

export default function WelcomePage() {
  const fired = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const fire = (particleRatio: number, opts: confetti.Options) =>
      confetti({
        ...opts,
        origin: { y: 0.65 },
        particleCount: Math.floor(220 * particleRatio),
        colors: ["#00E5FF", "#4F46E5", "#8B5CF6", "#FFFFFF", "#FFC700"],
      });
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center p-6">
      <FloatingOrbs />
      <Particles count={26} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl"
      >
        <GlassCard variant="strong" liquidBorder className="p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-500/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/30 blur-3xl" />

          <motion.div
            initial={{ rotate: -8, y: 20, opacity: 0 }}
            animate={{ rotate: 0, y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
            className="relative mx-auto h-28 w-28"
          >
            <div className="absolute inset-0 rounded-3xl bg-neon-cta blur-2xl opacity-70" />
            <div className="relative h-full w-full rounded-3xl bg-neon-cta flex items-center justify-center shadow-neon">
              <Gift className="h-12 w-12 text-white" />
            </div>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-[2rem] border border-dashed border-white/20"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mt-6 font-display text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            Welcome to <span className="text-gradient-neon">AdVerse Live</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="relative mt-2 text-sm text-white/60"
          >
            Apka account taiyar hai. Yeh chhota sa tohfa shuruwat ke liye!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 220, damping: 16 }}
            className="relative mt-7"
          >
            <div className="mx-auto inline-flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] px-6 py-4">
              <Coins className="h-5 w-5 text-amber-300" />
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Welcome bonus</p>
                <p className="font-display text-2xl font-semibold tracking-tight">+ ₨ 10.00</p>
              </div>
              <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="relative mt-8 grid grid-cols-3 gap-2 text-left"
          >
            <Mini icon={<Sparkles className="h-3.5 w-3.5" />} label="Roz" value="Quiz reward" />
            <Mini icon={<Users className="h-3.5 w-3.5" />} label="Banaiye" value="Apni team" />
            <Mini icon={<Coins className="h-3.5 w-3.5" />} label="Karein" value="Live baat" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="relative mt-8 flex flex-col sm:flex-row items-center gap-2"
          >
            <Button onClick={() => router.push("/dashboard")} size="lg" variant="neon" className="flex-1 w-full">
              Dashboard par jayein <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => router.push("/quiz")} size="lg" variant="glass" className="flex-1 w-full">
              Aaj ka quiz hal karein
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </main>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">{icon}</span>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
