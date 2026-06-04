"use client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Bell, Globe, Mail, Moon, Phone, User } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard className="p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Profile</p>
        <div className="mt-4 grid gap-3">
          <Input label="Display name" icon={<User />} defaultValue="Aroush K." />
          <Input label="Email" icon={<Mail />} type="email" defaultValue="aroush@adverse.live" />
          <Input label="Phone" icon={<Phone />} type="tel" defaultValue="+92 3xx xxxxxxx" />
          <Input label="Country" icon={<Globe />} defaultValue="Pakistan" />
          <Button variant="neon" size="md" className="self-start mt-1">Save changes</Button>
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Preferences</p>
        <div className="mt-4 space-y-3">
          <Toggle title="Push notifications" desc="Realtime alerts on this device" on={pushOn} setOn={setPushOn} icon={<Bell className="h-4 w-4" />} />
          <Toggle title="Email notifications" desc="Reward, security, marketing" on={emailOn} setOn={setEmailOn} icon={<Mail className="h-4 w-4" />} />
          <Toggle title="Dark mode" desc="Follow system or always dark" on icon={<Moon className="h-4 w-4" />} />
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Language & region</p>
        <div className="mt-4 grid gap-3">
          <Select label="Language" options={["English","Urdu","Hindi","Arabic"]} />
          <Select label="Currency" options={["PKR","USD","EUR","INR","SAR"]} />
          <Select label="Timezone" options={["Asia/Karachi","Asia/Dubai","UTC","Europe/London"]} />
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Danger zone</p>
        <p className="mt-2 text-sm text-white/60">Permanently delete your account and all associated data.</p>
        <Button variant="danger" size="md" className="mt-4">Delete account</Button>
      </GlassCard>
    </div>
  );
}

function Toggle({ title, desc, on, setOn, icon }: { title: string; desc: string; on?: boolean; setOn?: (v: boolean) => void; icon: React.ReactNode }) {
  const [val, setVal] = useState(!!on);
  const value = setOn ? on : val;
  const set = setOn ?? setVal;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
      <span className="h-9 w-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-white/55">{desc}</p>
      </div>
      <button
        onClick={() => set(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-gradient-to-r from-cyan-400 to-violet-500" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-white/70 tracking-wide">{label}</span>
      <select className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 text-sm outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.18)]">
        {options.map((o) => <option key={o} className="bg-graphite">{o}</option>)}
      </select>
    </label>
  );
}
