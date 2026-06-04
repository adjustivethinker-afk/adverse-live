"use client";
import { cn } from "@/lib/utils";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

type Props = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  icon?: ReactNode;
  accent?: "cyan" | "violet" | "emerald" | "amber" | "rose";
  className?: string;
};

const accentMap = {
  cyan: "from-cyan-400/30 to-cyan-400/0 text-cyan-300",
  violet: "from-violet-500/30 to-violet-500/0 text-violet-300",
  emerald: "from-emerald-400/30 to-emerald-400/0 text-emerald-300",
  amber: "from-amber-400/30 to-amber-400/0 text-amber-300",
  rose: "from-rose-500/30 to-rose-500/0 text-rose-300",
};

export function StatCounter({ value, decimals = 0, prefix, suffix }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    `${prefix ?? ""}${v.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}${suffix ?? ""}`
  );
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value, mv]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  );
}

export function StatCard({ label, value, prefix, suffix, decimals, delta, icon, accent = "violet", className }: Props) {
  return (
    <div className={cn("relative glass rounded-2xl p-5 overflow-hidden", className)}>
      <div className={cn("absolute -top-12 -right-10 h-40 w-40 rounded-full blur-3xl bg-gradient-to-br opacity-60", accentMap[accent].split(" ").slice(0,2).join(" "))} />
      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{label}</p>
          <p className="mt-2 text-3xl font-display font-semibold tracking-tight">
            <StatCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          {typeof delta === "number" && (
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-[11px] font-medium",
                delta >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs yesterday
            </span>
          )}
        </div>
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center",
            "bg-white/[0.06] border border-white/10",
            accentMap[accent].split(" ").slice(2).join(" ")
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
