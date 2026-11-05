"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listIpBans, createIpBan, deleteIpBan } from "@/lib/api/admin";
import { IpBanView } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldAlert, Trash2, Plus, Loader2, Calendar } from "lucide-react";

export function IpBansManager() {
  const [createOpen, setCreateOpen] = useState(false);
  const [ip, setIp] = useState("");
  const [reason, setReason] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: bans,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-ip-bans"],
    queryFn: () => listIpBans(),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim() || !reason.trim()) {
      toast.error("Please provide both IP and reason");
      return;
    }

    try {
      setIsSubmitting(true);
      const days = parseInt(expiresInDays);
      let expiresAt: string | undefined = undefined;
      if (!isNaN(days) && days > 0) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        expiresAt = d.toISOString();
      }

      await createIpBan({
        ip: ip.trim(),
        reason: reason.trim(),
        expiresAt,
      });

      toast.success("IP Ban applied successfully");
      setIp("");
      setReason("");
      setCreateOpen(false);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create IP ban";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIpBan(id);
      toast.success("IP ban removed");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete IP ban";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <p className="text-xs text-zinc-400">
          Blacklist abusive IP addresses from anonymous paste creation and account registration.
        </p>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Ban IP
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading IP bans...</p>
        </div>
      ) : !bans || bans.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm border border-zinc-800 rounded-lg">
          No IP bans currently active.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden text-xs">
          {bans.map((b: IpBanView) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-zinc-200">
                    Hash: {b.ipHash.slice(0, 16)}...
                  </span>
                  <span className="text-zinc-400">({b.reason})</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Banned {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                  {b.expiresAt && (
                    <span>· Expires {new Date(b.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(b.id)}
                className="text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create IP Ban Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="h-5 w-5" />
                <DialogTitle className="text-zinc-100">Add IP Ban</DialogTitle>
              </div>
              <DialogDescription className="text-zinc-400 text-xs">
                Enter an IPv4 or IPv6 address to prevent malicious requests.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="ban-ip" className="text-xs text-zinc-300">IP Address</Label>
                <Input
                  id="ban-ip"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="e.g. 192.168.1.1"
                  required
                  className="bg-zinc-900 border-zinc-800 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ban-reason" className="text-xs text-zinc-300">Reason</Label>
                <Input
                  id="ban-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Automated spam bot, DDoS attack"
                  required
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ban-days" className="text-xs text-zinc-300">Duration (Days)</Label>
                <Input
                  id="ban-days"
                  type="number"
                  min={1}
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                  placeholder="7"
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCreateOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isSubmitting || !ip.trim() || !reason.trim()}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Ban"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
