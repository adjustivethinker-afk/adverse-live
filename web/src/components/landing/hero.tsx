"use client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { FloatingOrbs } from "@/components/fx/floating-orbs";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Mic, Sparkles, Users, Wallet } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <FloatingOrbs />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-5"
        >
          <span className="chip backdrop-blur-xl">
            <span className="text-[14px]">🇵🇰</span>
            <span>Pakistan ka apna earning platform</span>
            <Badge variant="neon" pulse>NEW</Badge>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] font-bold tracking-tight"
        >
          <span className="block text-gradient">Kamao. Bolo.</span>
          <span className="block text-gradient-neon">Apne logon se milo.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-5 max-w-xl text-base text-white/65 leading-relaxed"
        >
          Roz aik chhota sa quiz hal kijiye, dosti banaiye, voice rooms mein
          baat kijiye aur apni team se kamaiye — sab kuch <span className="text-white">ek hi app</span> mein.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/signup">
            <Button size="xl" variant="neon">
              Free account banayein <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="xl" variant="glass">
              Sign in
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/55"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live abhi · 1,200+ users online
          </span>
          <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-cyan-300" /> JazzCash · EasyPaisa · Bank</span>
        </motion.div>

        {/* 3 quick value cards (no charts, no fluff) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-14 grid gap-4 sm:grid-cols-3 text-left"
        >
          <ValueCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Daily Quiz Reward"
            desc="Aik aasan sawaal — sahi jawab par roz reward."
            color="from-amber-400 to-orange-500"
          />
          <ValueCard
            icon={<Users className="h-5 w-5" />}
            title="Team Income"
            desc="Apne dost invite karein aur 3 levels tak commission lein."
            color="from-violet-500 to-fuchsia-500"
          />
          <ValueCard
            icon={<Mic className="h-5 w-5" />}
            title="Voice Rooms"
            desc="Live audio rooms — baat karein, suno, dosti banaiye."
            color="from-cyan-400 to-blue-500"
          />
        </motion.div>
      </div>
    </section>
  );
}

function ValueCard({
  icon, title, desc, color,
}: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <GlassCard hover className="relative p-5 overflow-hidden h-full">
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-25 blur-2xl`} />
      <div className="relative">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]`}>
          {icon}
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-white/60 leading-relaxed">{desc}</p>
      </div>
    </GlassCard>
  );
}
