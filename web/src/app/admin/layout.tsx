"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, Users, HelpCircle, ArrowDownToLine, ArrowUpFromLine,
  BarChart3, FileText, AlertTriangle, MessageSquare, Bell, Settings, Sparkles,
  Search, LogOut, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";
import { useAuth } from "@/lib/store";
import { AdminGuard } from "@/components/admin/admin-guard";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: string;
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { href: "/admin", label: "Super Dashboard", icon: ShieldCheck },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/realtime", label: "Realtime", icon: Activity, badge: "Live" },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/rewards", label: "Quiz Rewards", icon: HelpCircle },
      { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
      { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
      { href: "/admin/referrals", label: "Referrals", icon: Users },
    ],
  },
  {
    group: "Trust",
    items: [
      { href: "/admin/fraud", label: "Fraud Monitor", icon: AlertTriangle },
      { href: "/admin/moderation", label: "Moderation", icon: MessageSquare },
      { href: "/admin/reports", label: "Reports", icon: FileText },
      { href: "/admin/logs", label: "System Logs", icon: FileText },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col p-3">
        <div className="glass rounded-3xl p-3 h-[calc(100vh-1.5rem)] flex flex-col">
          <Link href="/admin" className="flex items-center gap-2 px-3 py-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-[0_0_24px_rgba(255,77,109,0.5)]">
              <ShieldCheck className="h-4 w-4 text-white" />
            </span>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">Admin Panel</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Super</p>
            </div>
          </Link>

          <nav className="mt-3 flex-1 overflow-y-auto scrollbar-hide pr-1">
            {NAV.map((g) => (
              <div key={g.group} className="mb-5">
                <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-white/40">{g.group}</p>
                <ul className="mt-2 grid gap-1">
                  {g.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/admin" &&
                        pathname.startsWith(item.href + "/")) ||
                      (item.href === "/admin" && pathname === "/admin");
                    return (
                      <li key={item.href} className="relative">
                        <Link
                          href={item.href}
                          className={cn(
                            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                            active
                              ? "bg-white/[0.06] text-white ring-1 ring-rose-500/30"
                              : "text-white/65 hover:text-white hover:bg-white/[0.04]",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                item.badge === "Live"
                                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                                  : "bg-amber-400/15 text-amber-300 border border-amber-400/30",
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

          <div className="mt-2 rounded-2xl glass-strong p-3 flex items-center gap-3">
            <Avatar name={user?.fullName ?? "Admin"} size={36} ring="violet" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.fullName ?? "Admin"}
              </p>
              <p className="text-[10px] text-white/55 truncate">
                {user?.email ?? "admin"}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="text-white/55 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 px-3 pt-3">
          <div className="glass rounded-2xl flex items-center gap-3 px-3 py-2">
            <div className="hidden md:flex flex-1 items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-3">
              <Search className="h-4 w-4 text-white/55" />
              <input
                placeholder="Search users, transactions, IPs…"
                className="flex-1 bg-transparent py-2 text-sm placeholder:text-white/35 outline-none"
              />
            </div>
            <Badge variant="success" pulse>Online</Badge>
            <Link
              href="/dashboard"
              className="btn-ghost-glass !h-9 !px-3 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> User view
            </Link>
          </div>
        </header>
        <main className="flex-1 px-3 pb-6 pt-3">{children}</main>
      </div>
    </div>
  );
}
