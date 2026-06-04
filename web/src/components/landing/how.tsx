import { GlassCard } from "@/components/ui/glass-card";
import { UserPlus, Sparkles, Wallet } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "1. Create account",
    desc: "Sign up with your name, email and password in under 30 seconds.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "2. Daily quiz",
    desc: "Answer one easy question — earn the reward instantly to your wallet.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Wallet,
    title: "3. Withdraw daily",
    desc: "Invite friends, build your team and withdraw earnings every day.",
    color: "from-violet-500 to-fuchsia-500",
  },
];

export function HowSection() {
  return (
    <section id="how" className="relative py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <span className="chip">Just 3 steps</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">How it works</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <GlassCard
              key={s.title}
              className="relative h-full p-6 overflow-hidden"
            >
              <div
                className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.color} opacity-15 blur-3xl`}
              />
              <div className="relative">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}
                >
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
