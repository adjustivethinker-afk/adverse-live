"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function OtpPage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [count, setCount] = useState(45);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const setAt = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.replace(/\D/, "").slice(-1);
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Verified!", { description: "Welcome to AdVerse Live." });
    router.push("/welcome");
  };

  const filled = code.every(Boolean);

  return (
    <AuthShell
      title={<>Verify your <span className="text-gradient-neon">device</span></>}
      subtitle="We sent a 6-digit code to your email and phone."
      footer={
        <p className="text-center text-xs text-white/55">
          Wrong account? <Link href="/login" className="text-white hover:text-cyan-300">Go back</Link>
        </p>
      }
    >
      <div className="flex justify-between gap-2">
        {code.map((v, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={v}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-12 sm:w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center font-display text-2xl font-semibold tracking-widest outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.18)] transition"
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-white/55">
        <span>Didn't receive it?</span>
        <button
          disabled={count > 0}
          onClick={() => setCount(45)}
          className="text-white disabled:text-white/40 hover:text-cyan-300 transition"
        >
          {count > 0 ? `Resend in ${count}s` : "Resend code"}
        </button>
      </div>

      <Button onClick={verify} disabled={!filled} size="lg" variant="neon" className="mt-6 w-full" loading={loading}>
        Verify and continue
      </Button>
    </AuthShell>
  );
}
