"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Users,
  FileText,
  AlertTriangle,
  ScrollText,
  Shield,
  Loader2,
  Lock,
  LayoutDashboard,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 inline-flex">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Access Restricted</h2>
        <p className="text-sm text-zinc-400">
          This administration area requires elevated administrator privileges.
        </p>
        <div className="pt-2">
          <Button asChild variant="outline" size="sm" className="border-zinc-800">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/pastes", label: "Pastes", icon: FileText },
    { href: "/admin/reports", label: "Abuse Reports", icon: AlertTriangle },
    { href: "/admin/audit", label: "Audit Logs", icon: ScrollText },
    { href: "/admin/bans", label: "IP Bans", icon: ShieldAlert },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-950/50 border border-violet-800/50 text-violet-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Admin Workspace</h1>
            <p className="text-xs text-zinc-400">
              System telemetry, user moderation, paste purges, and security policies.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-zinc-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={`gap-1.5 text-xs h-8 ${
                  isActive ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Child Content */}
      {children}
    </div>
  );
}
