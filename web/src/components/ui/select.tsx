"use client";
import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, icon, label, hint, error, id, options, ...rest }, ref) => {
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
            className,
          )}
        >
          {icon && <span className="text-white/60 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>}
          <select
            ref={ref}
            id={id}
            className={cn(
              "h-12 flex-1 bg-transparent outline-none text-sm placeholder:text-white/35 appearance-none pr-7 tracking-tight",
              "[&>option]:bg-[#0d0d18] [&>option]:text-white",
            )}
            {...rest}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
        </span>
        {(hint || error) && (
          <span
            className={cn(
              "mt-1.5 block text-[11px]",
              error ? "text-rose-400" : "text-white/50",
            )}
          >
            {error || hint}
          </span>
        )}
      </label>
    );
  },
);
Select.displayName = "Select";
