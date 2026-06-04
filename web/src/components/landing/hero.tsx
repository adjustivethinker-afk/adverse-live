import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BadgeCheck,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <div className="flex justify-center mb-5">
          <span className="chip">
            <span className="text-[14px]">🇵🇰</span>
            <span>Pakistan&apos;s own earning platform</span>
            <Badge variant="neon">NEW</Badge>
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] font-bold tracking-tight">
          <span className="block text-gradient">Earn. Connect.</span>
          <span className="block text-gradient-neon">Grow with friends.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-white/65 leading-relaxed">
          Solve a quick daily quiz, invite friends, and earn halal income
          from your team — all in <span className="text-white">one app</span>.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="xl" variant="neon">
              Create free account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="xl" variant="glass">
              Sign in
            </Button>
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-white/55">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Pakistan-only · Halal earnings
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-cyan-300" />
            JazzCash · EasyPaisa · Bank
          </span>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3 text-left">
          <ValueCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Daily Quiz Reward"
            desc="One easy question — earn a reward for every correct answer."
            color="from-amber-400 to-orange-500"
          />
          <ValueCard
            icon={<Users className="h-5 w-5" />}
            title="Team Income"
            desc="Invite friends and earn commissions across 3 levels."
            color="from-violet-500 to-fuchsia-500"
          />
          <ValueCard
            icon={<MessageCircle className="h-5 w-5" />}
            title="Personal Chat"
            desc="Simple, real-time messaging with your friends."
            color="from-emerald-400 to-teal-500"
          />
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <GlassCard className="relative p-5 overflow-hidden h-full">
      <div
        className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`}
      />
      <div className="relative">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white`}
        >
          {icon}
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-white/60 leading-relaxed">{desc}</p>
      </div>
    </GlassCard>
  );
}
