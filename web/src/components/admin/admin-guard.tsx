"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/lib/store";
import { isAdminEmail } from "@/lib/admin-config";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);
  const refresh = useAuth((s) => s.refresh);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      void refresh();
      return;
    }
    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }
    setChecked(true);
  }, [hydrated, user, router, refresh]);

  if (!hydrated || !checked || !user) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  const isAdmin = Boolean(user.isAdmin) || isAdminEmail(user.email);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] grid place-items-center p-6">
        <GlassCard
          variant="strong"
          liquidBorder
          className="p-8 text-center max-w-md"
        >
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Your account ({user.email}) is not authorised to view this
            section. If this is a mistake, ask the site owner to add your
            email to the admin allowlist.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link href="/dashboard">
              <Button variant="glass">
                <ArrowLeft className="h-4 w-4" /> Back to app
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
}
