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
      <div className="flex items-center justify-center py-12 gap-2 text-xs text-muted">
        <Loader2 className="h-4 w-4 animate-spin text-muted" />
        <span>Loading system statistics...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{(stats.users ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted">Live Pastes</CardTitle>
          <FileText className="h-4 w-4 text-muted/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{(stats.livePastes ?? stats.activePastes ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted">API Keys</CardTitle>
          <Archive className="h-4 w-4 text-muted/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{(stats.apiKeys ?? stats.tombstones ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted">Open Reports</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-red-400">{(stats.openReports ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted">Active Users</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">{(stats.activeUsers ?? stats.activeBans ?? 0).toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
