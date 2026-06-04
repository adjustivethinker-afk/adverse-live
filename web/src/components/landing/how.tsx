"use client";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { UserPlus, Sparkles, Wallet } from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "1. Account banayein", desc: "Apna naam, username, sheher daal kar 30 second mein register karein.", color: "from-cyan-400 to-blue-500" },
  { icon: Sparkles, title: "2. Roz aik quiz", desc: "Ek aasaan sawaal — sahi jawab par reward foran wallet mein.", color: "from-amber-400 to-orange-500" },
  { icon: Wallet, title: "3. Daily withdraw", desc: "Apne dost invite karein, voice room mein baat karein, daily kamai withdraw karein.", color: "from-violet-500 to-fuchsia-500" },
];

export function HowSection() {
  return (
    <section id="how" className="relative py-20">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="chip">Sirf 3 qadam</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">Shuru kaise karein?</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard hover className="relative h-full p-6 overflow-hidden">
                <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-3xl`} />
                <div className="relative">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]`}>
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
