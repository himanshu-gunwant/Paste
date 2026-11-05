"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
  getMyApiUsage,
} from "@/lib/api/analytics";
import { ApiKeyView } from "@/types/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Activity,
  Calendar,
} from "lucide-react";

export function ApiKeysManager() {
  const [createOpen, setCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<string>("30");
  const [isCreating, setIsCreating] = useState(false);

  // One-time revelation modal
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Queries
  const {
    data: apiKeys,
    isLoading: isLoadingKeys,
    refetch: refetchKeys,
  } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => listApiKeys(),
  });

  const { data: usageData } = useQuery({
    queryKey: ["api-usage"],
    queryFn: () => getMyApiUsage(),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast.error("Please provide a name for this API key");
      return;
    }

    try {
      setIsCreating(true);
      const days = parseInt(expiresInDays);
      let expiresAt: string | undefined = undefined;
      if (!isNaN(days) && days > 0) {
        const exp = new Date();
        exp.setDate(exp.getDate() + days);
        expiresAt = exp.toISOString();
      }

      const res = await createApiKey({
        name: keyName.trim(),
        expiresAt,
      });

      setRevealedKey(res.apiKey);
      setKeyName("");
      setCreateOpen(false);
      refetchKeys();
      toast.success("API Key generated");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to generate API key";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Applications using it will lose access immediately.")) return;
    try {
      await revokeApiKey(id);
      toast.success("API key revoked");
      refetchKeys();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to revoke API key";
      toast.error(msg);
    }
  };

  const handleCopyKey = () => {
    if (!revealedKey) return;
    navigator.clipboard.writeText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("API key copied to clipboard");
  };

  const totalRequests = usageData?.data?.reduce((acc, cur) => acc + cur.requestCount, 0) || 0;
  const dailyLimit = usageData?.quota?.dailyLimit || 1000;
  const usagePercentage = Math.min(100, Math.round((totalRequests / dailyLimit) * 100));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-100">Personal API Keys</h2>
          <p className="text-xs text-zinc-400">
            Use API keys to authenticate command-line tools, bots, and CI/CD pipelines.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Generate New Key
        </Button>
      </div>

      {/* Usage Quota Card */}
      {usageData && (
        <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-zinc-300 font-medium">
              <Activity className="h-3.5 w-3.5 text-violet-400" />
              API Daily Quota
            </span>
            <span className="font-mono text-zinc-400">
              {totalRequests.toLocaleString()} / {dailyLimit.toLocaleString()} requests
            </span>
          </div>

          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercentage > 90
                  ? "bg-rose-500"
                  : usagePercentage > 75
                  ? "bg-amber-500"
                  : "bg-violet-500"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Keys List */}
      {isLoadingKeys ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading API keys...</p>
        </div>
      ) : !apiKeys || apiKeys.length === 0 ? (
        <div className="text-center py-16 border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
          <Key className="h-8 w-8 text-zinc-600 mx-auto" />
          <h3 className="text-base font-medium text-zinc-200">No API keys created</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Generate an API key to create and manage pastes directly from the terminal or your own scripts.
          </p>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            Generate Key
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
          {apiKeys.map((k: ApiKeyView) => (
            <div
              key={k.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-200">{k.name}</span>
                  <Badge variant="outline" className="font-mono text-[10px] bg-zinc-900 text-zinc-400 border-zinc-800">
                    {k.prefix}...
                  </Badge>
                  {k.revokedAt && (
                    <Badge variant="destructive" className="text-[10px]">
                      Revoked
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {new Date(k.createdAt).toLocaleDateString()}
                  </span>
                  {k.lastUsedAt && (
                    <span>· Last used {new Date(k.lastUsedAt).toLocaleDateString()}</span>
                  )}
                  {k.expiresAt && (
                    <span>· Expires {new Date(k.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {!k.revokedAt && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevoke(k.id)}
                  className="text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 h-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Key Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-violet-400">
                <Key className="h-5 w-5" />
                <DialogTitle className="text-zinc-100">Create API Key</DialogTitle>
              </div>
              <DialogDescription className="text-zinc-400 text-xs">
                Enter a descriptive name to identify where this token is being used.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="key-name" className="text-xs text-zinc-300">Key Name</Label>
                <Input
                  id="key-name"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. CLI tool, GitHub Action, Backup Bot"
                  required
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="key-exp" className="text-xs text-zinc-300">Expiration (Days)</Label>
                <Input
                  id="key-exp"
                  type="number"
                  min={1}
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                  placeholder="30"
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
                size="sm"
                disabled={isCreating || !keyName.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Key"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* One-Time Key Reveal Modal */}
      <Dialog open={Boolean(revealedKey)} onOpenChange={(open) => !open && setRevealedKey(null)}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-zinc-100">Save Your API Key</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-2">
              Please copy your API key now. For security purposes, <strong>you will not be able to view it again</strong> once this dialog is closed.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={revealedKey || ""}
                className="font-mono text-xs bg-zinc-900 border-zinc-800 select-all"
              />
              <Button
                size="sm"
                onClick={handleCopyKey}
                className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              size="sm"
              onClick={() => setRevealedKey(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
            >
              I have safely copied my key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
