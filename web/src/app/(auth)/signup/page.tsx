"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/ui/google-icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const signup = useAuth((s) => s.signup);
  const signInWithGoogle = useAuth((s) => s.signInWithGoogle);
  const user = useAuth((s) => s.user);
  const hydrated = useAuth((s) => s.hydrated);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      window.location.replace(user.status === "PENDING_PROFILE" ? "/complete-profile/" : "/dashboard/");
    }
  }, [hydrated, user]);

  const onChange =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fullName.trim().length < 2) return toast.error("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return toast.error("Enter a valid email.");
    if (form.password.length < 8)
      return toast.error("Password must be at least 8 characters.");

    setLoading(true);
    const res = await signup({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Sign up failed", { description: res.error });
      return;
    }
    sessionStorage.setItem(
      "adverse:signup-name",
      form.fullName.trim(),
    );
    window.location.href = "/complete-profile/";
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
      : "/dashboard/";
  };

  return (
    <AuthShell
      title={
        <>
          Create your <span className="text-gradient-neon">account</span>
        </>
      }
      subtitle="It only takes a minute."
      footer={
        <p className="text-center text-xs text-white/55">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-cyan-300 transition"
          >
            Sign in
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
            label="Full name"
            icon={<User />}
            id="fullName"
            placeholder="Your name"
            value={form.fullName}
            onChange={onChange("fullName")}
            required
          />
          <Input
            label="Email"
            icon={<Mail />}
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange("email")}
            autoCapitalize="none"
            required
          />
          <Input
            label="Password"
            icon={<Lock />}
            id="password"
            type={show ? "text" : "password"}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={onChange("password")}
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
          <Button
            type="submit"
            size="lg"
            variant="neon"
            className="w-full"
            loading={loading}
          >
            Create account
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
