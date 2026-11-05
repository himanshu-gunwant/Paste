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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-100">Active Login Sessions</h2>
          <p className="text-xs text-zinc-400">
            Devices that are currently signed into your account via session cookies.
          </p>
        </div>

        {sessions && sessions.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevokeAll}
            disabled={isRevokingAll}
            className="text-xs border-rose-900/60 text-rose-400 hover:bg-rose-950/20"
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
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading active sessions...</p>
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm">No active sessions found.</div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
          {sessions.map((s: SessionInfo) => {
            const isMobile = /mobile|iphone|android/i.test(s.userAgent || "");

            return (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 mt-0.5">
                    {isMobile ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">
                        {s.userAgent ? s.userAgent.slice(0, 60) : "Unknown Client"}
                      </span>
                      {s.isCurrent && (
                        <Badge variant="outline" className="text-[10px] bg-emerald-950/40 text-emerald-400 border-emerald-800">
                          Current Session
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
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
                    className="text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 h-8"
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
