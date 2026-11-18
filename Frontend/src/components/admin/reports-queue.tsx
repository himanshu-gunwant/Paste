"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listReports, resolveReport } from "@/lib/api/admin";
import { AbuseReportView } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertTriangle,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
  XCircle,
} from "lucide-react";

export function ReportsQueue() {
  const [statusFilter, setStatusFilter] = useState<"OPEN" | "REVIEWED" | "RESOLVED" | "DISMISSED">("OPEN");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: reports,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-reports", statusFilter],
    queryFn: () => listReports(statusFilter),
  });

  const handleResolve = async (id: string, action: "delete_paste" | "dismiss") => {
    try {
      setIsProcessing(true);
      await resolveReport(id, { action, note: `Handled via admin dashboard (${action})` });
      toast.success(action === "delete_paste" ? "Paste deleted and report resolved" : "Report dismissed");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to resolve report";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={(val) => setStatusFilter(val as typeof statusFilter)} className="w-full sm:w-auto">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="OPEN" className="gap-1.5 text-xs flex-1 sm:flex-initial">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            Open
          </TabsTrigger>
          <TabsTrigger value="REVIEWED" className="text-xs flex-1 sm:flex-initial">Reviewed</TabsTrigger>
          <TabsTrigger value="RESOLVED" className="text-xs flex-1 sm:flex-initial">Resolved</TabsTrigger>
          <TabsTrigger value="DISMISSED" className="text-xs flex-1 sm:flex-initial">Dismissed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading abuse reports...</p>
        </div>
      ) : !reports || reports.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
          No reports found with status: {statusFilter}.
        </div>
      ) : (
        <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          {reports.map((r: AbuseReportView) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
            >
              <div className="space-y-1.5 max-w-2xl min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">
                    {r.reason}
                  </Badge>
                  <Link
                    href={`/p/${r.pasteId}`}
                    target="_blank"
                    className="text-xs font-mono text-foreground hover:underline flex items-center gap-1"
                  >
                    p/{r.pasteId}
                    <ExternalLink className="h-3 w-3 text-muted" />
                  </Link>
                  <span className="text-xs text-muted">
                    reported by {r.reporterUsername ? `@${r.reporterUsername}` : "Anonymous"}
                  </span>
                </div>

                {r.details && (
                  <p className="text-xs text-foreground bg-white/[0.03] p-2.5 rounded border border-white/10">
                    &quot;{r.details}&quot;
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <Calendar className="h-3 w-3" />
                  <span>Reported on {new Date(r.createdAt).toLocaleString()}</span>
                  {r.resolutionNote && (
                    <span className="text-muted/70">· Resolution: {r.resolutionNote}</span>
                  )}
                </div>
              </div>

              {r.status === "OPEN" && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolve(r.id, "dismiss")}
                    disabled={isProcessing}
                    className="h-8 text-xs text-muted hover:text-foreground"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleResolve(r.id, "delete_paste")}
                    disabled={isProcessing}
                    className="h-8 text-xs gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Paste
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
