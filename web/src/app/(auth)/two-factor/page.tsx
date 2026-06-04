"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function TwoFactorPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <AuthShell
      title={<>Two-factor <span className="text-gradient-neon">authentication</span></>}
      subtitle="Enter the 6-digit code from your authenticator app."
      footer={
        <p className="text-center text-xs text-white/55">
          Lost your device? <Link href="#" className="text-white hover:text-cyan-300">Use backup code</Link>
        </p>
      }
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await new Promise((r) => setTimeout(r, 700));
          setLoading(false);
          toast.success("Authenticated");
          router.push("/dashboard");
        }}
        className="space-y-4"
      >
        <Input
          label="One-time code"
          icon={<ShieldCheck />}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          required
        />
        <Button type="submit" size="lg" variant="neon" className="w-full" loading={loading}>
          Verify
        </Button>
      </form>
    </AuthShell>
  );
}
