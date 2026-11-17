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
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 animate-enter">
        <div className="p-3 rounded-full border border-white/10 bg-white/5 text-muted inline-flex">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to view Analytics</h2>
        <p className="text-sm text-muted">
          Track traffic trends, total views, and unique visitors across all your public pastes.
        </p>
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-8 animate-enter">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 text-foreground">
          <BarChart3 className="h-5 w-5 text-muted" />
          <h1 className="text-2xl font-bold tracking-tight">Account Analytics</h1>
        </div>
        <p className="text-sm text-muted">
          Aggregated 30-day view statistics and audience engagement across your developer pastes.
        </p>
      </div>

      {isAnalyticsLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading analytics metrics...</p>
        </div>
      ) : !analytics ? (
        <div className="text-center py-16 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
          No analytics data recorded for your account yet.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted">Total Pastes</CardTitle>
                <FileText className="h-4 w-4 text-muted/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {analytics.totals.pastes}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted">30-Day Views</CardTitle>
                <Eye className="h-4 w-4 text-muted/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {Number(analytics.totals.views).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {Number(analytics.totals.uniqueVisitors).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-muted/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {formatBytes(analytics.totals.storageUsed)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 30-Day Chart */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted">Traffic Over Time (30 Days)</h3>
            <AnalyticsChart data={analytics.daily} height={320} />
          </div>
        </div>
      )}
    </div>
  );
}
