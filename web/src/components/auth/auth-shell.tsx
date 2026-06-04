import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

/**
 * Centered, single-column auth card. Used for /login, /signup,
 * /complete-profile, /forgot-password, /otp, /two-factor.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  side?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-5"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neon-cta">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            AdVerse <span className="text-gradient-neon">Live</span>
          </span>
        </Link>

        <GlassCard variant="strong" className="p-6 sm:p-8">
          <h1 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-white/60 text-center">
              {subtitle}
            </p>
          )}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-5">{footer}</div>}
        </GlassCard>
      </div>
    </main>
  );
}
