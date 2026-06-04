"use client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Phone, User, Gift, MapPin, AtSign, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PK_CITIES, isValidPkPhone } from "@/lib/pk";
import { useAuth } from "@/lib/store";

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signup = useAuth((s) => s.signup);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    gender: "male" as "male" | "female",
    city: "Karachi",
    phone: "",
    password: "",
    referralCode: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fullName.trim().length < 2) return toast.error("Apna poora naam likhein.");
    if (!/^[a-z0-9_]{3,20}$/i.test(form.username)) return toast.error("Username 3-20 characters, sirf letters/numbers/underscore.");
    if (!isValidPkPhone(form.phone)) return toast.error("Valid Pakistani number daalein (03xx xxxxxxx).");
    if (form.password.length < 6) return toast.error("Password kam az kam 6 characters ka hona chahiye.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signup(form);
    setLoading(false);
    toast.success("Mubarak! Account ban gaya.", { description: "PKR 10 ka welcome bonus apke wallet mein add ho gaya." });
    router.push("/welcome");
  };

  return (
    <AuthShell
      title={<>Welcome to <span className="text-gradient-neon">AdVerse Live</span></>}
      subtitle={
        <span className="inline-flex items-center gap-2">
          <Gift className="h-4 w-4 text-amber-300" /> Free PKR 10 ka welcome bonus, ab hi.
        </span>
      }
      footer={
        <p className="text-center text-xs text-white/55">
          Pehle se account hai?{" "}
          <Link href="/login" className="text-white hover:text-cyan-300 transition">Sign in</Link>
        </p>
      }
    >
      <form className="space-y-3.5" onSubmit={onSubmit}>
        <Input
          label="Poora naam"
          icon={<User />}
          id="fullName"
          placeholder="Aroush Khan"
          value={form.fullName}
          onChange={onChange("fullName")}
          required
        />
        <Input
          label="Username"
          icon={<AtSign />}
          id="username"
          placeholder="aroush123"
          value={form.username}
          onChange={onChange("username")}
          autoCapitalize="none"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Gender"
            icon={<UserCircle2 />}
            id="gender"
            value={form.gender}
            onChange={onChange("gender")}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <Select
            label="Sheher"
            icon={<MapPin />}
            id="city"
            value={form.city}
            onChange={onChange("city")}
            options={PK_CITIES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <Input
          label="Phone number (Pakistan)"
          icon={<Phone />}
          id="phone"
          type="tel"
          placeholder="03xx xxxxxxx"
          value={form.phone}
          onChange={onChange("phone")}
          required
        />

        <Input
          label="Password"
          icon={<Lock />}
          id="password"
          type={show ? "text" : "password"}
          placeholder="6+ characters"
          value={form.password}
          onChange={onChange("password")}
          required
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} className="hover:text-white transition">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Input
          label="Referral code (optional)"
          id="ref"
          placeholder="Agar kisi ne invite kiya hai"
          value={form.referralCode}
          onChange={onChange("referralCode")}
        />

        <label className="flex items-start gap-2 text-xs text-white/60 pt-1">
          <input type="checkbox" required className="mt-0.5 accent-violet-500 h-4 w-4 rounded" />
          Main <Link href="#" className="text-white hover:text-cyan-300">Terms</Link> aur{" "}
          <Link href="#" className="text-white hover:text-cyan-300">Privacy Policy</Link> se ittefaq karta/karti hoon.
        </label>

        <Button type="submit" size="lg" variant="neon" className="w-full" loading={loading}>
          Account banaiye & PKR 10 lijiye
        </Button>

        <p className="text-center text-[11px] text-white/45 pt-1">
          🇵🇰 Sirf Pakistan ke users ke liye.
        </p>
      </form>
    </AuthShell>
  );
}
