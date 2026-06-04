"use client";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mic,
  Users,
  Wallet,
  MessageCircle,
  UserPlus,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

const FEATURES = [
  { icon: HelpCircle, title: "Daily Quiz Reward", desc: "Roz aik aasan sawaal hal karein. Sahi jawab par reward apne wallet mein.", accent: "from-amber-400 to-orange-500" },
  { icon: Users, title: "3-Level Referral Team", desc: "Apne dosto ko invite karein. Unki team se bhi kamaiye, halal tareeke se.", accent: "from-violet-500 to-fuchsia-500" },
  { icon: Mic, title: "Live Voice Rooms", desc: "Apna room banaiye, dost ko bulaiye, mic par baat karein. Admin controls poore.", accent: "from-cyan-400 to-blue-500" },
  { icon: MessageCircle, title: "Personal Chat", desc: "WhatsApp jaisi simple chat — apne dost se sidha message karein.", accent: "from-emerald-400 to-teal-500" },
  { icon: UserPlus, title: "Naye Dost Banaiye", desc: "Pakistan bhar ke active users dekhiye, follow kijiye, baat shuru kijiye.", accent: "from-pink-500 to-rose-500" },
  { icon: Wallet, title: "Saaf Wallet", desc: "Balance, transactions, sab kuch ek jagah — saaf aur clear.", accent: "from-indigo-500 to-violet-500" },
  { icon: ArrowDownToLine, title: "Aasaan Deposit", desc: "JazzCash, EasyPaisa ya bank se deposit. Tezi se verify hota hai.", accent: "from-yellow-400 to-amber-500" },
  { icon: ArrowUpFromLine, title: "Daily Withdrawal", desc: "Daily withdraw — 2 ghante mein paise apke account mein.", accent: "from-sky-400 to-cyan-500" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="chip">Sab kuch ek hi jagah</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">Aap ke liye banaaya gaya</span>
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-white/60">
            Aasaan, halal, aur har Pakistani user ke liye step-by-step.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <GlassCard hover className="group relative h-full p-5 overflow-hidden">
                <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50`} />
                <div className="relative">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]`}>
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1.5 text-[13px] text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
