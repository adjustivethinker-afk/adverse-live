"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function Particles({ count = 26 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2.5 + 0.5,
        d: Math.random() * 6,
        dur: 6 + Math.random() * 8,
      })),
    [count]
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-20, -120], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: "easeOut" }}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
          }}
          className="absolute rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      ))}
    </div>
  );
}
