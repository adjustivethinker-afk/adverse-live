"use client";
import { GlassCard } from "@/components/ui/glass-card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "What is AdVerse Live?",
    a: "A halal earning + chat app made for Pakistani users. Solve a daily quiz to earn rewards, invite friends for 3-level team income, and meet new people.",
  },
  {
    q: "How does the daily quiz work?",
    a: "Every 24 hours you get one easy question (in Roman Urdu). Answer correctly to receive an instant reward in your wallet. Wrong answers reset the cooldown for another day.",
  },
  {
    q: "Is the app only for Pakistanis?",
    a: "Yes. AdVerse Live is built exclusively for Pakistani users. You'll be asked for your Pakistani phone number and city during signup.",
  },
  {
    q: "What withdrawal methods are supported?",
    a: "JazzCash, EasyPaisa, or any Pakistani bank account. Daily withdrawals are allowed and processed within roughly 2 hours.",
  },
  {
    q: "Are there any ads to watch?",
    a: "No. There is no ad-watching feature. Just the daily quiz, chat, and referrals — that's it.",
  },
  {
    q: "How safe is my data?",
    a: "Authentication and sessions are handled by our backend API. Your phone number is only used for account verification and sessions are protected.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="chip">FAQ</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">Frequently asked</span>
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.q} {...faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <GlassCard className="p-0 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-white/60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-white/65 leading-relaxed">
          {a}
        </div>
      )}
    </GlassCard>
  );
}
