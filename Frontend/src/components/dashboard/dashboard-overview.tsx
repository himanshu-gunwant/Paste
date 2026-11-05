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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Welcome back, {user?.displayName || user?.username}
          </h1>
          <p className="text-sm text-zinc-400">
            Here is what&apos;s happening across your developer pastes and collections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
            <Link href="/new">
              <Plus className="h-4 w-4" />
              New Paste
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300 gap-1.5">
            <Link href="/collections">
              <FolderPlus className="h-4 w-4" />
              Collections
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pastes */}
        <Card className="bg-zinc-950/70 border-zinc-800/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Pastes</CardTitle>
            <FileText className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <div className="text-2xl font-bold text-zinc-100">
                {analytics?.totals.pastes ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Views */}
        <Card className="bg-zinc-950/70 border-zinc-800/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <div className="text-2xl font-bold text-zinc-100">
                {Number(analytics?.totals.views || 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card className="bg-zinc-950/70 border-zinc-800/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <div className="text-2xl font-bold text-zinc-100">
                {Number(analytics?.totals.uniqueVisitors || 0).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="bg-zinc-950/70 border-zinc-800/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            ) : (
              <div className="text-2xl font-bold text-zinc-100">
                {formatBytes(analytics?.totals.storageUsed || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/my-pastes" className="group">
          <Card className="bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-violet-400">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">My Pastes</h4>
                <p className="text-xs text-zinc-500">Manage all your created pastes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link href="/settings/api-keys" className="group">
          <Card className="bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-violet-400">
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">API Keys</h4>
                <p className="text-xs text-zinc-500">Developer API token integration</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link href="/explore" className="group">
          <Card className="bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-violet-400">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">Explore</h4>
                <p className="text-xs text-zinc-500">Discover trending public pastes</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>
      </div>

      {/* Recent Pastes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-200">Recent Public Pastes</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
            <Link href="/my-pastes">View all</Link>
          </Button>
        </div>

        {isPastesLoading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recent pastes...</span>
          </div>
        ) : recentPastes.length === 0 ? (
          <div className="text-center py-12 border border-zinc-800/60 rounded-lg bg-zinc-950/40 p-6 text-xs text-zinc-500">
            No public pastes created yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
            {recentPastes.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors">
                <div className="space-y-1">
                  <Link
                    href={`/p/${p.id}`}
                    className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors"
                  >
                    {p.title || "Untitled Paste"}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">
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

                <Button asChild variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
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
