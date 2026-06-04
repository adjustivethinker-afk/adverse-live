import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Variant = "default" | "neon" | "success" | "warning" | "danger" | "vip" | "host" | "mod";

const variants: Record<Variant, string> = {
  default: "bg-white/[0.06] text-white/85 border border-white/10",
  neon: "bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300 border border-cyan-400/30",
  success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  warning: "bg-amber-400/10 text-amber-300 border border-amber-400/30",
  danger: "bg-rose-500/10 text-rose-300 border border-rose-500/30",
  vip: "bg-gradient-to-br from-amber-400 to-pink-500 text-black border border-amber-300/50 shadow-[0_0_20px_rgba(251,191,36,0.4)]",
  host: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]",
  mod: "bg-gradient-to-br from-cyan-400 to-blue-500 text-white",
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  pulse?: boolean;
};

export function Badge({ variant = "default", pulse, className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...rest}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
