"use client";
import { motion } from "framer-motion";

export function FloatingOrbs() {
  const orbs = [
    { x: "8%", y: "20%", s: 280, c: "from-cyan-400/30", d: 0 },
    { x: "78%", y: "12%", s: 360, c: "from-violet-500/30", d: 1.4 },
    { x: "60%", y: "68%", s: 240, c: "from-fuchsia-500/25", d: 2.1 },
    { x: "12%", y: "75%", s: 200, c: "from-blue-500/25", d: 0.8 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: o.d, duration: 1.4 }}
          style={{ left: o.x, top: o.y, width: o.s, height: o.s }}
          className={`absolute rounded-full bg-gradient-to-br ${o.c} to-transparent blur-3xl animate-aurora`}
        />
      ))}
    </div>
  );
}
