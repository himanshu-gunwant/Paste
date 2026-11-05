"use client";

import { useQuery } from "@tanstack/react-query";
import { listAuditLogs } from "@/lib/api/admin";
import { AuditLogEntry } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";

export function AuditLogsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => listAuditLogs(100, 0),
  });

  const logs = data?.data || [];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading audit trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm border border-zinc-800 rounded-lg">
          No audit logs recorded.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden font-mono text-xs">
          {logs.map((log: AuditLogEntry) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-zinc-900/40 transition-colors gap-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-violet-900/60 text-violet-300 bg-violet-950/20 text-[10px]">
                  {log.action}
                </Badge>
                <span className="text-zinc-300 font-sans">
                  {log.actorName ? `@${log.actorName}` : log.actorType}
                </span>
                {log.targetType && (
                  <span className="text-zinc-500">
                    → {log.targetType}:{log.targetId}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-zinc-500 font-sans text-[11px] shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
