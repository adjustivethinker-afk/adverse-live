"use client";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "AdVerse Live kya hai?",
    a: "Ye Pakistan ke logon ke liye banaya gaya aik halal earning + voice rooms platform hai. Aap roz aik quiz hal karke reward kama sakte hain, dosto ko invite kar ke team income le sakte hain, aur live voice rooms mein baat kar sakte hain.",
  },
  {
    q: "Daily quiz kaise kaam karta hai?",
    a: "Har 24 ghante mein aap ko aik aasaan sawaal milta hai — Roman Urdu mein. Sahi jawab par reward foran wallet mein. Ghalat hua to agla mauqa 24 ghante baad milta hai.",
  },
  {
    q: "Kya ye app sirf Pakistanio ke liye hai?",
    a: "Ji haan. AdVerse Live sirf Pakistan ke users ke liye hai. Sign up ke waqt apna sheher aur Pakistan ka phone number daalna hota hai.",
  },
  {
    q: "Withdrawal kis kis tareeqe se hota hai?",
    a: "JazzCash, EasyPaisa, ya kisi bhi Pakistani bank account mein. Daily withdrawal allow hai aur 2 ghante ke andar process ho jaata hai.",
  },
  {
    q: "Kya is platform mein ads dekhne padte hain?",
    a: "Nahi. Ham ne ads watching feature bilkul nahi rakha. Sirf aik aasaan daily quiz, voice rooms, aur referrals — bas yehi seedhe rastey hain.",
  },
  {
    q: "Voice rooms mein admin kya kar sakta hai?",
    a: "Room banane wala admin hota hai — wo mic seats lock/unlock kar sakta hai, kisi user ko mute kar sakta hai, ya stage se utar sakta hai. Saari power room owner ke paas hai.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative py-20">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="chip">FAQ</span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-tight">
            <span className="text-gradient">Aap ke sawaalat</span>
          </h2>
        </motion.div>

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
          className={`h-4 w-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-white/65 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
