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
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = useAuth((s) => s.login);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return toast.error("Username, email, ya phone daalein.");
    if (!password) return toast.error("Password daalein.");
    setLoading(true);
    const res = await login(identifier.trim(), password);
    setLoading(false);
    if (!res.ok) {
      toast.error("Login nahi hua", { description: res.error });
      return;
    }
    toast.success("Welcome back!", { description: "Apke dashboard par le ja rahe hain." });
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title={<>Welcome <span className="text-gradient-neon">back.</span></>}
      subtitle="Username, email, ya phone se sign in karein."
      footer={
        <p className="text-center text-xs text-white/55">
          Naya account chahiye?{" "}
          <Link href="/signup" className="text-white hover:text-cyan-300 transition">Sign up karein</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Username, email, ya phone"
          icon={<AtSign />}
          id="identifier"
          placeholder="aroush123  /  03xx xxxxxxx"
          autoCapitalize="none"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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
