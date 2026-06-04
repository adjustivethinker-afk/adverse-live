"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AtSign,
  Gift,
  Loader2,
  MapPin,
  Phone,
  User,
  UserCircle2,
} from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/lib/store";
import { PK_CITIES, isValidPkPhone } from "@/lib/pk";

export default function CompleteProfilePage() {
  const completeProfile = useAuth((s) => s.completeProfile);
  const refresh = useAuth((s) => s.refresh);

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    gender: "male" as "male" | "female",
    city: "Karachi",
    phone: "",
    referralCode: "",
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await refresh();
        if (cancelled) return;
        const u = useAuth.getState().user;
        if (!u) {
          window.location.replace("/signup/");
          return;
        }
        if (u.status !== "PENDING_PROFILE") {
          window.location.replace("/dashboard/");
          return;
        }
        setForm((s) => ({
          ...s,
          fullName: u.fullName || s.fullName,
        }));
      } catch {
        if (!cancelled) {
          window.location.replace("/signup/");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fullName.trim().length < 2) return toast.error("Enter your full name.");
    if (!/^[a-z0-9_]{3,20}$/i.test(form.username))
      return toast.error("Username: 3-20 letters, numbers, or underscore.");
    if (!isValidPkPhone(form.phone))
      return toast.error("Enter a valid Pakistani number (03xx xxxxxxx).");

    setLoading(true);
    const res = await completeProfile({
      fullName: form.fullName,
      username: form.username,
      gender: form.gender,
      city: form.city,
      phone: form.phone,
      referralCode: form.referralCode || undefined,
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Couldn't save profile", { description: res.error });
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adverse:signup-name");
    }
    toast.success("All set!", {
      description: "Welcome bonus added to your wallet.",
    });
    window.location.href = "/welcome/";
  };

  if (checking) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <AuthShell
      title={<>One last step</>}
      subtitle={
        <span className="inline-flex items-center gap-1.5">
          <Gift className="h-4 w-4 text-amber-300" /> Finish your profile to claim
          your welcome bonus.
        </span>
      }
    >
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
          label="Username"
          icon={<AtSign />}
          id="username"
          placeholder="username"
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
            label="City"
            icon={<MapPin />}
            id="city"
            value={form.city}
            onChange={onChange("city")}
            options={PK_CITIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <Input
          label="Phone (Pakistan)"
          icon={<Phone />}
          id="phone"
          type="tel"
          placeholder="03xx xxxxxxx"
          value={form.phone}
          onChange={onChange("phone")}
          required
        />
        <Input
          label="Referral code (optional)"
          id="ref"
          placeholder="Invite code, if any"
          value={form.referralCode}
          onChange={onChange("referralCode")}
        />
        <Button
          type="submit"
          size="lg"
          variant="neon"
          className="w-full"
          loading={loading}
        >
          Finish & continue
        </Button>
      </form>
    </AuthShell>
  );
}
