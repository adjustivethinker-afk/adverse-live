"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { ArrowUpFromLine, BanknoteIcon, Building2, Hash, Smartphone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const METHODS = [
  { id: "jazz", name: "JazzCash", desc: "Mobile wallet · 2 min", icon: Smartphone, color: "from-rose-500 to-pink-500" },
  { id: "easy", name: "EasyPaisa", desc: "Mobile wallet · 2 min", icon: Smartphone, color: "from-emerald-400 to-teal-500" },
  { id: "bank", name: "Bank Transfer", desc: "Any Pakistani bank · 1-2 hr", icon: Building2, color: "from-violet-500 to-fuchsia-500" },
];

export default function WithdrawPage() {
  const [method, setMethod] = useState("jazz");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="relative">
            <span className="chip"><ArrowUpFromLine className="h-3 w-3" /> Withdraw</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Cash out <span className="text-gradient-neon">instantly</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">Available balance: <span className="font-semibold text-white">₨ 42,810</span></p>
          </div>

          <p className="relative mt-5 text-[11px] uppercase tracking-[0.18em] text-white/55">Choose payout method</p>
          <div className="relative mt-3 grid sm:grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`relative rounded-2xl border p-3 text-left transition ${method === m.id ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"}`}
              >
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-2`}>
                  <m.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-[11px] text-white/55 mt-0.5">{m.desc}</p>
                {method === m.id && <Badge variant="neon" className="absolute top-2 right-2">Selected</Badge>}
              </button>
            ))}
          </div>

          <form
            className="relative mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              await new Promise((r) => setTimeout(r, 900));
              setLoading(false);
              toast.success("Withdrawal requested", { description: "Most payouts settle within 2 hours." });
            }}
          >
            <Input label="Amount (PKR)" icon={<BanknoteIcon />} type="number" placeholder="e.g. 2000" hint="Min withdraw ₨ 200 · Daily max ₨ 50,000" />
            <Input label="Account holder" icon={<User />} placeholder="Aroush Khan" />
            <Input label={method === "bank" ? "IBAN / Account number" : "Mobile number"} icon={<Hash />} placeholder={method === "bank" ? "PK00 ABCD 0123 4567 8900" : "+92 3xx xxxxxxx"} />

            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 text-sm space-y-1.5">
              <Row k="Amount" v="₨ 2,000" />
              <Row k="Fee" v="₨ 0" />
              <Row k="Receive" v="₨ 2,000" highlight />
              <Row k="ETA" v="Under 2 hrs" />
            </div>

            <Button size="lg" variant="neon" className="w-full" loading={loading}>
              Request withdrawal
            </Button>
          </form>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Recent withdrawals</p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {[
              { id: "W-12455", method: "JazzCash", amount: 2000, status: "completed", date: "Today · 4:33 PM" },
              { id: "W-12454", method: "EasyPaisa", amount: 1500, status: "completed", date: "May 30 · 10:01 AM" },
              { id: "W-12453", method: "Bank Transfer", amount: 6000, status: "processing", date: "May 28 · 9:42 AM" },
              { id: "W-12452", method: "JazzCash", amount: 800, status: "completed", date: "May 22 · 5:13 PM" },
            ].map((h) => (
              <li key={h.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center"><Smartphone className="h-3.5 w-3.5 text-emerald-300" /></span>
                  <div>
                    <p className="text-sm">{h.method} · {h.id}</p>
                    <p className="text-[11px] text-white/45">{h.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">₨ {h.amount.toLocaleString()}</p>
                  <Badge variant={h.status === "completed" ? "success" : "warning"}>{h.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{k}</span>
      <span className={highlight ? "text-emerald-300 font-semibold" : ""}>{v}</span>
    </div>
  );
}
