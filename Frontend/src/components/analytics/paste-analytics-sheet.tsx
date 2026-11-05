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
      <SheetContent className="sm:max-w-lg bg-zinc-950 border-zinc-800 overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 text-violet-400">
            <BarChart2 className="h-5 w-5" />
            <SheetTitle className="text-zinc-100">Paste Metrics</SheetTitle>
          </div>
          <SheetDescription className="text-zinc-400 text-xs">
            30-day traffic breakdown and unique visitor analytics for p/{pasteId}.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-xs text-zinc-400">Loading metrics...</p>
            </div>
          ) : !stats ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No analytics data recorded for this paste.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Eye className="h-3.5 w-3.5 text-violet-400" />
                      <span>Total Views</span>
                    </div>
                    <div className="text-xl font-bold text-zinc-100">
                      {Number(stats.totals.views).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Users className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Unique Visitors</span>
                    </div>
                    <div className="text-xl font-bold text-zinc-100">
                      {Number(stats.totals.uniqueVisitors).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Chart */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300">Daily Trend (30 Days)</h4>
                <AnalyticsChart data={stats.daily} height={220} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
