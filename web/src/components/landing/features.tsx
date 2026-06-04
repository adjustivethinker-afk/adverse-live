import { GlassCard } from "@/components/ui/glass-card";
import {
  HelpCircle,
  Users,
  Wallet,
  MessageCircle,
  UserPlus,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: HelpCircle,
    title: "Daily Quiz Reward",
    desc: "Solve one easy question daily. Earn a reward for every correct answer.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    icon: Users,
    title: "3-Level Referral Team",
    desc: "Invite friends and earn commissions across three referral levels.",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: MessageCircle,
    title: "Personal Chat",
    desc: "Simple, real-time messaging with friends across the platform.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    icon: UserPlus,
    title: "Find Friends",
    desc: "Discover active Pakistani users and start conversations.",
    accent: "from-pink-500 to-rose-500",
  },
  {
    icon: Wallet,
    title: "Clean Wallet",
    desc: "Balance, history, transactions — everything in one clear view.",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    icon: ArrowDownToLine,
    title: "Easy Deposit",
    desc: "JazzCash, EasyPaisa or bank — fast verification.",
    accent: "from-yellow-400 to-amber-500",
  },
  {
    icon: ArrowUpFromLine,
    title: "Daily Withdrawal",
    desc: "Withdraw daily — money in your account in about 2 hours.",
    accent: "from-sky-400 to-cyan-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure Account",
    desc: "Strong passwords, OTP and fraud protection built in.",
    accent: "from-cyan-400 to-blue-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="chip">Everything in one place</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">Built for you</span>
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-white/60">
            Simple, halal, and step-by-step for every Pakistani user.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <GlassCard
              key={f.title}
              className="group relative h-full p-5 overflow-hidden"
            >
              <div
                className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-20 blur-2xl`}
              />
              <div className="relative">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white`}
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-white/60 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
