"use client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowLeft, Calendar, MapPin, MessageSquare, Sparkles, UserPlus } from "lucide-react";
import { findPerson, lastSeenLabel } from "@/lib/people";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PersonProfile() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const p = findPerson(params.id);

  if (!p) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="font-display text-xl">User nahi mila</p>
        <Button variant="glass" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Wapas
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Wapas
      </button>

      <GlassCard variant="strong" liquidBorder className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-fuchsia-500/15 to-cyan-400/20" />
        <div className="absolute inset-0 bg-aurora-1 opacity-70" />

        <div className="relative h-32" />
        <div className="relative px-5 sm:px-8 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-3xl ring-4 ring-graphite p-1 bg-graphite relative">
                <Avatar name={p.fullName} size={96} ring="violet" />
                {p.online && (
                  <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0d18]" />
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2 flex-wrap">
                  {p.fullName}
                  <Badge variant="default">L{p.level}</Badge>
                </h1>
                <p className="mt-1 text-sm text-white/60 flex items-center gap-3 flex-wrap">
                  <span>@{p.username}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{lastSeenLabel(p)}</span>
                </p>
                {p.bio && <p className="mt-2 max-w-xl text-sm text-white/75">{p.bio}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/chat">
                <Button variant="neon"><MessageSquare className="h-4 w-4" /> Message</Button>
              </Link>
              <Button variant="glass"><UserPlus className="h-4 w-4" /> Follow</Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Activity score" value={p.activityScore + " / 100"} />
            <Stat label="Level" value={p.level.toString()} />
            <Stat label="Sheher" value={p.city} />
            <Stat label="Status" value={p.online ? "Online" : "Offline"} />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-300" /> {p.fullName.split(" ")[0]} ke baare mein
        </p>
        <p className="mt-3 text-sm text-white/75 leading-relaxed">
          {p.bio ?? `${p.fullName} AdVerse Live ka active member hai. Apni dosti ka pehla qadam bharein — message bhejein!`}
        </p>
      </GlassCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-1 font-display text-base font-semibold tabular-nums truncate">{value}</p>
    </div>
  );
}
