"use client";

import { useQuery } from "@tanstack/react-query";
import { getPasteStats } from "@/lib/api/analytics";
import { AnalyticsChart } from "./analytics-chart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Users, Loader2, BarChart2 } from "lucide-react";

interface PasteAnalyticsSheetProps {
  pasteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasteAnalyticsSheet({
  pasteId,
  open,
  onOpenChange,
}: PasteAnalyticsSheetProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["paste-stats", pasteId],
    queryFn: () => getPasteStats(pasteId),
    enabled: open,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 text-foreground">
            <BarChart2 className="h-4 w-4 text-muted" />
            <SheetTitle>Paste Metrics</SheetTitle>
          </div>
          <SheetDescription className="text-xs break-all">
            30-day traffic breakdown and unique visitor analytics for p/{pasteId}.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
              <p className="text-xs text-muted">Loading metrics...</p>
            </div>
          ) : !stats ? (
            <div className="text-center py-12 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
              No analytics data recorded for this paste.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Total Views</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-foreground">
                      {Number(stats.totals.views).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Users className="h-3.5 w-3.5" />
                      <span>Unique Visitors</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-foreground">
                      {Number(stats.totals.uniqueVisitors).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Chart */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted">Daily Trend (30 Days)</h4>
                <AnalyticsChart data={stats.daily} height={220} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
