"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, ShieldAlert, Archive, Loader2 } from "lucide-react";

export function AdminStatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-xs text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
        <span>Loading system statistics...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="bg-zinc-950/70 border-zinc-800/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400">Total Users</CardTitle>
          <Users className="h-4 w-4 text-violet-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-100">{(stats.users ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/70 border-zinc-800/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400">Live Pastes</CardTitle>
          <FileText className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-100">{(stats.livePastes ?? stats.activePastes ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/70 border-zinc-800/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400">API Keys</CardTitle>
          <Archive className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-100">{(stats.apiKeys ?? stats.tombstones ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/70 border-zinc-800/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400">Open Reports</CardTitle>
          <AlertTriangle className="h-4 w-4 text-rose-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-300">{(stats.openReports ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-950/70 border-zinc-800/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-zinc-400">Active Users</CardTitle>
          <ShieldAlert className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-100">{(stats.activeUsers ?? stats.activeBans ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
