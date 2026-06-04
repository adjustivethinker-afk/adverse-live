"use client";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type Variant = "neon" | "glass" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

// `HTMLMotionProps<"button">.children` is `ReactNode | MotionValue<...>` which
// breaks strict mode at the call site. Force a normal `ReactNode` here.
type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-base",
  icon: "h-10 w-10",
};

const variants: Record<Variant, string> = {
  neon: "btn-neon",
  glass: "btn-ghost-glass",
  ghost: "bg-transparent text-white/80 hover:bg-white/5 rounded-full",
  outline:
    "rounded-full border border-white/12 bg-transparent text-white hover:bg-white/5",
  danger:
    "rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-[0_8px_30px_-8px_rgba(255,77,109,0.6)] hover:brightness-110",
  success:
    "rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-black font-semibold shadow-[0_8px_30px_-8px_rgba(0,210,106,0.6)] hover:brightness-110",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { className, variant = "neon", size = "md", loading, disabled, children, ...rest },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 select-none",
          "transition-all duration-300 ease-spring",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizes[size],
          variants[variant],
          className
        )}
        {...rest}
      >
        {loading && (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
