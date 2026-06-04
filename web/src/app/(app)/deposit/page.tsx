"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine, BanknoteIcon, Building2, Hash, Receipt, Smartphone, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const METHODS = [
  { id: "jazz", name: "JazzCash", desc: "+92 3xx-xxxxxxx · Aroush K.", icon: Smartphone, color: "from-rose-500 to-pink-500" },
  { id: "easy", name: "EasyPaisa", desc: "+92 3xx-xxxxxxx · Aroush K.", icon: Smartphone, color: "from-emerald-400 to-teal-500" },
  { id: "bank", name: "Bank Transfer", desc: "Meezan Bank · 0123-XX-7820", icon: Building2, color: "from-violet-500 to-fuchsia-500" },
];

const HISTORY = [
  { id: "D-78211", method: "JazzCash", amount: 5000, status: "approved", date: "Yesterday · 11:14 PM" },
  { id: "D-78210", method: "EasyPaisa", amount: 2500, status: "pending", date: "Yesterday · 8:11 PM" },
  { id: "D-78209", method: "Bank Transfer", amount: 12000, status: "approved", date: "May 31 · 4:32 PM" },
  { id: "D-78208", method: "JazzCash", amount: 1500, status: "rejected", date: "May 28 · 2:14 PM" },
];

export default function DepositPage() {
  const [method, setMethod] = useState("jazz");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <GlassCard variant="strong" liquidBorder className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="relative">
          <span className="chip"><ArrowDownToLine className="h-3 w-3" /> Deposit</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Add funds to your wallet</h1>
          <p className="mt-1 text-sm text-white/60">Manual verification by our team. Average review time: 4 minutes.</p>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard className="p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Choose a payment method</p>
          <div className="mt-3 grid sm:grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`relative rounded-2xl border p-3 text-left transition ${method === m.id ? "border-violet-500/50 bg-violet-500/10" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"}`}
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
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              await new Promise((r) => setTimeout(r, 800));
              setLoading(false);
              toast.success("Deposit submitted", { description: "We're verifying your transaction." });
            }}
          >
            <Input label="Amount (PKR)" icon={<BanknoteIcon />} type="number" placeholder="e.g. 1500" hint="Minimum: ₨ 500 · Maximum: ₨ 200,000" />
            <Input label="Transaction ID / TXN" icon={<Hash />} placeholder="EP12345678 / JC8723..." />
            <div>
              <p className="mb-2 block text-xs font-medium text-white/70 tracking-wide">Receipt screenshot</p>
              <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center hover:bg-white/[0.05] transition">
                <Upload className="mx-auto h-5 w-5 text-white/55" />
                <p className="mt-2 text-sm">Drag and drop or click to upload</p>
                <p className="text-[11px] text-white/45">PNG, JPG up to 5 MB</p>
                <input type="file" className="hidden" />
              </label>
            </div>
            <Input label="Note (optional)" icon={<Receipt />} placeholder="Any reference notes" />
            <Button size="lg" variant="neon" className="w-full" loading={loading}>
              Submit deposit request
            </Button>
          </form>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Deposit history</p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {HISTORY.map((h) => (
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
                  <Badge variant={h.status === "approved" ? "success" : h.status === "pending" ? "warning" : "danger"}>{h.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
