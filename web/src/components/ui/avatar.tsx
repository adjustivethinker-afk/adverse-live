import { cn, initials } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  name: string;
  size?: number;
  ring?: "none" | "neon" | "violet" | "live";
};

const ringMap: Record<NonNullable<Props["ring"]>, string> = {
  none: "",
  neon: "ring-2 ring-cyan-400/70 ring-offset-2 ring-offset-black",
  violet: "ring-2 ring-violet-500/70 ring-offset-2 ring-offset-black",
  live: "ring-2 ring-rose-500 ring-offset-2 ring-offset-black animate-pulse",
};

export function Avatar({ src, name, size = 40, ring = "none", className, ...rest }: Props) {
  const seed = encodeURIComponent(name);
  const fallback =
    src ?? `https://api.dicebear.com/9.x/glass/svg?seed=${seed}&backgroundType=gradientLinear`;
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.06] text-xs font-semibold",
        ringMap[ring],
        className
      )}
      {...rest}
    >
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallback} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
