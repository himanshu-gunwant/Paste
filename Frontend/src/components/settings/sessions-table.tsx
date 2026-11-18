"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listSessions, revokeSession, revokeAllSessions } from "@/lib/api/auth";
import { SessionInfo } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  Loader2,
  Calendar,
  ShieldAlert,
} from "lucide-react";

export function SessionsTable() {
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const {
    data: sessions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-sessions"],
    queryFn: () => listSessions(),
  });

  const handleRevokeSingle = async (id: string) => {
    try {
      await revokeSession(id);
      toast.success("Session revoked");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to revoke session";
      toast.error(msg);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Are you sure you want to log out all other active sessions?")) return;
    try {
      setIsRevokingAll(true);
      const res = await revokeAllSessions();
      toast.success(`Revoked ${res.revoked} other sessions`);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to revoke sessions";
      toast.error(msg);
    } finally {
      setIsRevokingAll(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">Active Login Sessions</h2>
          <p className="text-xs text-muted">
            Devices that are currently signed into your account via session cookies.
          </p>
        </div>

        {sessions && sessions.length > 1 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevokeAll}
            disabled={isRevokingAll}
            className="text-xs"
          >
            {isRevokingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
            )}
            Revoke All Others
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading active sessions...</p>
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="text-center py-12 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
          No active sessions found.
        </div>
      ) : (
        <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          {sessions.map((s: SessionInfo) => {
            const isMobile = /mobile|iphone|android/i.test(s.userAgent || "");

            return (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-md bg-white/5 border border-white/10 text-muted mt-0.5 shrink-0">
                    {isMobile ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate max-w-md">
                        {s.userAgent ? s.userAgent.slice(0, 60) : "Unknown Client"}
                      </span>
                      {s.isCurrent && (
                        <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-muted shrink-0">
                          Current Session
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1 font-mono">
                        <Globe className="h-3 w-3" />
                        {s.ip || "Unknown IP"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Signed in {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <span>Last active {new Date(s.lastUsedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {!s.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSingle(s.id)}
                    className="text-muted hover:text-red-400 hover:bg-red-500/10 h-8 self-end sm:self-center shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
