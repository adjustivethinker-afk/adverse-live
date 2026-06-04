"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-3 py-2 transition-all",
          scrolled
            ? "glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
            : "glass"
        )}
      >
        <Link href="/" className="flex items-center gap-2 pl-2">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-neon-cta shadow-neon">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            AdVerse <span className="text-gradient-neon">Live</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button size="sm" variant="glass">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" variant="neon">
              Start Earning
            </Button>
          </Link>
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="md:hidden rounded-full p-2 text-white/80 hover:bg-white/[0.08]"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-auto max-w-6xl glass rounded-3xl p-4"
          >
            <div className="grid gap-2">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
                >
                  {n.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" className="contents">
                  <Button variant="glass" size="md" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" className="contents">
                  <Button variant="neon" size="md" className="w-full">
                    Start Earning
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
