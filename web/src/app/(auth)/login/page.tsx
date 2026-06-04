"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function ensureSlash(p: string): string {
  if (!p) return "/dashboard/";
  if (p.startsWith("http")) return p;
  if (!p.startsWith("/")) p = "/" + p;
  return p.endsWith("/") ? p : p + "/";
}

function LoginInner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const login = useAuth((s) => s.login);
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle);
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      window.location.replace(
        user.status === "PENDING_PROFILE" ? "/complete-profile/" : ensureSlash(next),
      );
    }
  }, [hydrated, user, next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter your email.");
    if (!password) return toast.error("Enter your password.");
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      toast.error("Sign in failed", { description: res.error });
      return;
    }
    window.location.href = res.needsProfile
      ? "/complete-profile/"
      : ensureSlash(next);
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    const res = await signInWithGoogle();
    setGoogleLoading(false);
    if (!res.ok) {
      if (res.error)
        toast.error("Google sign-in failed", { description: res.error });
      return;
    }
    window.location.href = res.needsProfile
      ? "/complete-profile/"
      : ensureSlash(next);
  };

  return (
    <AuthShell
      title={<>Welcome back</>}
      subtitle="Sign in to your account."
      footer={
        <p className="text-center text-xs text-white/55">
          New here?{" "}
          <Link
            href="/signup"
            className="text-white hover:text-cyan-300 transition"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={onGoogle}
          disabled={googleLoading || loading}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white text-gray-900 font-medium text-sm h-11 hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon className="h-[18px] w-[18px]" />
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-[0.18em] text-white/45">
            <span className="px-3 bg-graphite/60 backdrop-blur-md rounded-full">
              or
            </span>
          </div>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            label="Email"
            icon={<Mail />}
            id="email"
            type="email"
            placeholder="you@example.com"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            icon={<Lock />}
            id="password"
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="hover:text-white transition"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
          <div className="flex justify-end text-xs">
            <Link
              href="/forgot-password"
              className="text-white/85 hover:text-cyan-300 transition"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            size="lg"
            variant="neon"
            className="w-full"
            loading={loading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
