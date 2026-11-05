"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserAnalytics } from "@/lib/api/analytics";
import { useAuth } from "@/hooks/use-auth";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  HardDrive,
  Eye,
  Users,
  Loader2,
  Lock,
} from "lucide-react";

function formatBytes(bytesStr: string | number): string {
  const bytes = Number(bytesStr) || 0;
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
  } = useQuery({
    queryKey: ["account-analytics"],
    queryFn: () => getUserAnalytics(),
    enabled: isAuthenticated,
  });

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="p-3 rounded-full bg-zinc-800 text-zinc-400 inline-flex">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Sign in to view Analytics</h2>
        <p className="text-sm text-zinc-400">
          Track traffic trends, total views, and unique visitors across all your public pastes.
        </p>
        <div className="pt-2">
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 text-zinc-100">
          <BarChart3 className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">Account Analytics</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Aggregated 30-day view statistics and audience engagement across your developer pastes.
        </p>
      </div>

      {isAnalyticsLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading analytics metrics...</p>
        </div>
      ) : !analytics ? (
        <div className="text-center py-16 text-zinc-500 text-sm">
          No analytics data recorded for your account yet.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-950/70 border-zinc-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400">Total Pastes</CardTitle>
                <FileText className="h-4 w-4 text-violet-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">
                  {analytics.totals.pastes}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/70 border-zinc-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400">30-Day Views</CardTitle>
                <Eye className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">
                  {Number(analytics.totals.views).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/70 border-zinc-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">
                  {Number(analytics.totals.uniqueVisitors).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-950/70 border-zinc-800/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-zinc-400">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">
                  {formatBytes(analytics.totals.storageUsed)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 30-Day Chart */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200">Traffic Over Time (30 Days)</h3>
            <AnalyticsChart data={analytics.daily} height={320} />
          </div>
        </div>
      )}
    </div>
  );
}
