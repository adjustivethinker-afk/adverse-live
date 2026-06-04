"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell
      title={<>Reset your <span className="text-gradient-neon">password</span></>}
      subtitle="We'll send you a magic link to set a new password."
      footer={
        <p className="text-center text-xs text-white/55">
          Remembered it? <Link href="/login" className="text-white hover:text-cyan-300">Sign in</Link>
        </p>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await new Promise((r) => setTimeout(r, 900));
          setLoading(false);
          toast.success("Check your inbox", { description: "We sent a recovery link." });
        }}
      >
        <Input label="Email" icon={<Mail />} type="email" placeholder="you@example.com" required />
        <Button type="submit" size="lg" variant="neon" className="w-full" loading={loading}>
          Send recovery link
        </Button>
      </form>
    </AuthShell>
  );
}
