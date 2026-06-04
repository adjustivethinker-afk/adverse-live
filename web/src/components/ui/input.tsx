"use client";
import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, icon, trailing, label, hint, error, id, ...rest }, ref) => {
    return (
      <label htmlFor={id} className="block w-full">
        {label && (
          <span className="mb-2 block text-xs font-medium text-white/70 tracking-wide">
            {label}
          </span>
        )}
        <span
          className={cn(
            "group relative flex items-center gap-3 rounded-2xl px-4",
            "bg-white/[0.04] border border-white/10",
            "backdrop-blur-xl transition-all duration-300",
            "focus-within:bg-white/[0.06] focus-within:border-violet-500/50 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.18)]",
            error && "border-rose-500/60 focus-within:border-rose-500/80 focus-within:shadow-[0_0_0_4px_rgba(255,77,109,0.18)]",
            className
          )}
        >
          {icon && <span className="text-white/60 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>}
          <input
            ref={ref}
            id={id}
            className={cn(
              "h-12 flex-1 bg-transparent outline-none text-sm placeholder:text-white/35",
              "tracking-tight"
            )}
            {...rest}
          />
          {trailing && <span className="text-white/60">{trailing}</span>}
        </span>
        {(hint || error) && (
          <span
            className={cn(
              "mt-1.5 block text-[11px]",
              error ? "text-rose-400" : "text-white/50"
            )}
          >
            {error || hint}
          </span>
        )}
      </label>
    );
  }
);
Input.displayName = "Input";
