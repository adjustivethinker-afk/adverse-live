"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, AtSign } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const login = useAuth((s) => s.login);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Username daalein.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(username.trim());
    setLoading(false);
    toast.success("Welcome back!", { description: "Apke dashboard par le ja rahe hain." });
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title={<>Welcome <span className="text-gradient-neon">back.</span></>}
      subtitle="Apne username se sign in karein."
      footer={
        <p className="text-center text-xs text-white/55">
          Naya account chahiye?{" "}
          <Link href="/signup" className="text-white hover:text-cyan-300 transition">Sign up karein</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Username"
          icon={<AtSign />}
          id="username"
          placeholder="aroush123"
          autoCapitalize="none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Password"
          icon={<Lock />}
          id="password"
          type={show ? "text" : "password"}
          placeholder="••••••••"
          required
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} className="hover:text-white transition">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-white/65">
            <input type="checkbox" className="accent-violet-500 h-4 w-4 rounded" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-white/85 hover:text-cyan-300 transition">
            Password bhool gaye?
          </Link>
        </div>
        <Button type="submit" size="lg" variant="neon" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
