"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserAnalytics } from "@/lib/api/analytics";
import { getUserPublicPastes } from "@/lib/api/discovery";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  HardDrive,
  Eye,
  Users,
  Plus,
  FolderPlus,
  Key,
  Compass,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";

function formatBytes(bytesStr: string | number): string {
  const bytes = Number(bytesStr) || 0;
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DashboardOverview() {
  const { user } = useAuth();

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["user-analytics"],
    queryFn: () => getUserAnalytics(),
  });

  const { data: recentPastesData, isLoading: isPastesLoading } = useQuery({
    queryKey: ["user-recent-pastes", user?.username],
    queryFn: () => (user?.username ? getUserPublicPastes(user.username, { limit: 5 }) : null),
    enabled: Boolean(user?.username),
  });

  const recentPastes = recentPastesData?.data || [];

  return (
    <div className="space-y-8 animate-enter">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.displayName || user?.username}
          </h1>
          <p className="text-sm text-muted">
            Overview of your developer pastes, collections, and usage metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/new">
              <Plus className="h-4 w-4" />
              New Paste
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/collections">
              <FolderPlus className="h-4 w-4" />
              Collections
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Pastes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted">Total Pastes</CardTitle>
            <FileText className="h-4 w-4 text-muted/70" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {analytics?.totals.pastes ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted/70" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {Number(analytics?.totals.views || 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted/70" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {Number(analytics?.totals.uniqueVisitors || 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted/70" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {formatBytes(analytics?.totals.storageUsed || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link href="/my-pastes" className="group">
          <div className="border border-white/10 bg-white/[0.02] hover:bg-white/5 rounded-lg p-4 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-muted group-hover:text-foreground transition-colors">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">My Pastes</h4>
                <p className="text-xs text-muted">Manage all your created pastes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/settings/api-keys" className="group">
          <div className="border border-white/10 bg-white/[0.02] hover:bg-white/5 rounded-lg p-4 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-muted group-hover:text-foreground transition-colors">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">API Keys</h4>
                <p className="text-xs text-muted">Developer API token integration</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link href="/explore" className="group">
          <div className="border border-white/10 bg-white/[0.02] hover:bg-white/5 rounded-lg p-4 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-muted group-hover:text-foreground transition-colors">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Explore</h4>
                <p className="text-xs text-muted">Discover public developer pastes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Pastes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Recent Public Pastes</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted hover:text-foreground">
            <Link href="/my-pastes">View all</Link>
          </Button>
        </div>

        {isPastesLoading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-xs text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recent pastes...</span>
          </div>
        ) : recentPastes.length === 0 ? (
          <div className="text-center py-12 border border-white/10 rounded-lg bg-white/[0.02] p-6 text-xs text-muted">
            No public pastes created yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
            {recentPastes.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="space-y-1">
                  <Link
                    href={`/p/${p.id}`}
                    className="text-sm font-medium text-foreground hover:underline transition-colors"
                  >
                    {p.title || "Untitled Paste"}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/5">
                      {p.language || "text"}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <span>·</span>
                    <span>{Number(p.viewCount).toLocaleString()} views</span>
                  </div>
                </div>

                <Button asChild variant="ghost" size="sm" className="text-xs text-muted hover:text-foreground">
                  <Link href={`/p/${p.id}`}>Open</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
