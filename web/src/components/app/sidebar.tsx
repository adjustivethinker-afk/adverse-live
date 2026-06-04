"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  Users,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trophy,
  Bell,
  Settings,
  Sparkles,
  Activity,
  Shield,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: string;
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/quiz", label: "Daily Quiz", icon: HelpCircle, badge: "Reward" },
      { href: "/chat", label: "Messages", icon: MessageSquare },
      { href: "/friends", label: "Friends", icon: UserPlus },
    ],
  },
  {
    group: "Earn",
    items: [
      { href: "/team", label: "My Team", icon: Users },
      { href: "/wallet", label: "Wallet", icon: Wallet },
      { href: "/deposit", label: "Deposit", icon: ArrowDownToLine },
      { href: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    ],
  },
  {
    group: "You",
    items: [
      { href: "/missions", label: "Missions", icon: Trophy },
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/profile", label: "Profile", icon: Activity },
      { href: "/security", label: "Security", icon: Shield },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col p-3">
      <div className="glass rounded-3xl p-3 h-[calc(100vh-1.5rem)] flex flex-col">
        <Link href="/" className="flex items-center gap-2 px-3 py-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neon-cta">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-bold tracking-tight">
              AdVerse <span className="text-gradient-neon">Live</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Premium
            </p>
          </div>
        </Link>

        <nav className="mt-3 flex-1 overflow-y-auto scrollbar-hide pr-1">
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
                {g.group}
              </p>
              <ul className="mt-2 grid gap-1">
                {g.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-white/[0.06] text-white ring-1 ring-violet-500/30"
                            : "text-white/65 hover:text-white hover:bg-white/[0.04]",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                              "bg-white/[0.06] text-white/70 border border-white/10",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <UpgradeCard />
      </div>
    </aside>
  );
}

function UpgradeCard() {
  return (
    <div className="mt-2 rounded-2xl glass-strong p-4 relative overflow-hidden">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
        Invite friends
      </p>
      <p className="mt-1 font-display text-lg font-semibold">3-Level Income</p>
      <p className="text-[11px] text-white/55">
        Earn commission on what your friends earn.
      </p>
      <Link
        href="/team"
        className="mt-3 btn-neon !h-9 !px-4 text-xs w-full"
      >
        Refer & Earn
      </Link>
    </div>
  );
}
