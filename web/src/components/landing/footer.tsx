"use client";
import Link from "next/link";
import { Sparkles, Twitter, Instagram, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export function LandingFooter() {
  return (
    <footer className="relative pb-12 pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <GlassCard variant="strong" liquidBorder className="p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neon-cta shadow-neon">
                  <Sparkles className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-xl font-bold tracking-tight">
                  AdVerse <span className="text-gradient-neon">Live</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-white/60 leading-relaxed">
                Pakistan ka apna earning + voice rooms platform. Halal, simple, aur har user
                ke liye easy. 🇵🇰
              </p>
              <div className="mt-5 flex items-center gap-2">
                {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="h-9 w-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/[0.1] transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <Col title="Product" links={["Daily Quiz","Voice Rooms","Friends","Wallet"]} />
            <Col title="Help" links={["How it works","Support","Contact","FAQ"]} />
            <Col title="Legal" links={["Terms","Privacy","Refund","Community Rules"]} />
          </div>

          <div className="relative mt-10 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/45">© 2026 AdVerse Live. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Link href="/signup">
                <Button size="sm" variant="neon">Start Earning</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" variant="glass">Sign in</Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-white/75 hover:text-white transition">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
