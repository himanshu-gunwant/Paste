"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminUsers, suspendUser, unsuspendUser } from "@/lib/api/admin";
import { AdminUserView } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Search,
  UserX,
  UserCheck,
  Loader2,
  Calendar,
  HardDrive,
  Shield,
} from "lucide-react";

export function AdminUsersTable() {
  const [query, setQuery] = useState("");
  const [suspendUserTarget, setSuspendUserTarget] = useState<AdminUserView | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => listAdminUsers(query.trim() || undefined),
  });

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendUserTarget || !suspendReason.trim()) {
      toast.error("Please provide a suspension reason");
      return;
    }

    try {
      setIsSubmitting(true);
      await suspendUser(suspendUserTarget.id, { reason: suspendReason.trim() });
      toast.success(`User @${suspendUserTarget.username} suspended`);
      setSuspendUserTarget(null);
      setSuspendReason("");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to suspend user";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsuspend = async (user: AdminUserView) => {
    try {
      await unsuspendUser(user.id);
      toast.success(`User @${user.username} unsuspended`);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to unsuspend user";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by username or email..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading user registry...</p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm border border-zinc-800 rounded-lg">
          No users found matching query.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
          {users.map((u: AdminUserView) => (
            <div
              key={u.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">@{u.username}</span>
                  <span className="text-xs text-zinc-500">({u.email})</span>

                  {u.role === "ADMIN" && (
                    <Badge variant="secondary" className="gap-1 text-[10px] text-violet-300">
                      <Shield className="h-2.5 w-2.5" /> Admin
                    </Badge>
                  )}

                  {u.status === "SUSPENDED" ? (
                    <Badge variant="destructive" className="text-[10px]">
                      Suspended
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-900">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {u.storageUsed || "0 B"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {u.status === "SUSPENDED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnsuspend(u)}
                    className="h-8 text-xs gap-1 border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/20"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Unsuspend
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSuspendUserTarget(u)}
                    className="h-8 text-xs gap-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suspend User Dialog */}
      <Dialog open={Boolean(suspendUserTarget)} onOpenChange={(open) => !open && setSuspendUserTarget(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <form onSubmit={handleSuspend}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-400">
                <UserX className="h-5 w-5" />
                <DialogTitle className="text-zinc-100">
                  Suspend @{suspendUserTarget?.username}
                </DialogTitle>
              </div>
              <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-1">
                The user will be immediately logged out and forbidden from creating or modifying pastes.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <Label htmlFor="suspend-reason" className="text-xs text-zinc-300">
                Reason for Suspension
              </Label>
              <Input
                id="suspend-reason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g. Terms of Service violation, Spam distribution"
                required
                className="bg-zinc-900 border-zinc-800 text-sm"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSuspendUserTarget(null)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isSubmitting || !suspendReason.trim()}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Suspension"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
