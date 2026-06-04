"use client";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type Variant = "default" | "strong" | "soft" | "neon";

// See note in <Button>: `HTMLMotionProps<"div">.children` allows `MotionValue`
// which TypeScript strict mode rejects when we splat regular React children.
type Props = Omit<HTMLMotionProps<"div">, "children"> & {
  variant?: Variant;
  liquidBorder?: boolean;
  hover?: boolean;
  children?: ReactNode;
};

const variants: Record<Variant, string> = {
  default: "glass",
  strong: "glass-strong",
  soft: "glass-soft",
  neon: "glass ring-neon",
};

export const GlassCard = forwardRef<HTMLDivElement, Props>(
  ({ className, variant = "default", liquidBorder, hover, children, ...rest }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className={cn(
          "relative rounded-2xl overflow-hidden",
          variants[variant],
          liquidBorder && "liquid-border",
          className
        )}
        {...rest}
      >
        {children}
        <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
