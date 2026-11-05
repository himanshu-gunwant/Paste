"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserPublicPastes } from "@/lib/api/discovery";
import { deletePaste } from "@/lib/api/pastes";
import { useAuth } from "@/hooks/use-auth";
import { usePasteVault, VaultPaste } from "@/hooks/use-paste-vault";
import { PasteSummary } from "@/types/paste";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Loader2,
  Calendar,
  Eye,
  KeyRound,
  FilePlus,
} from "lucide-react";

export function MyPastesTable() {
  const { user } = useAuth();
  const { vault, removePaste } = usePasteVault();
  const [tab, setTab] = useState<"account" | "vault">("account");

  const {
    data: pastesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-public-pastes", user?.username],
    queryFn: () => (user?.username ? getUserPublicPastes(user.username, { limit: 100 }) : null),
    enabled: Boolean(user?.username),
  });

  const accountPastes = pastesData?.data || [];

  const handleDeleteAccountPaste = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paste? This cannot be undone.")) return;
    try {
      await deletePaste(id);
      toast.success("Paste deleted successfully");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete paste";
      toast.error(msg);
    }
  };

  const handleDeleteVaultPaste = async (item: VaultPaste) => {
    if (!confirm("Delete this paste from both database and local vault?")) return;
    try {
      await deletePaste(item.id, item.managementToken);
      removePaste(item.id);
      toast.success("Anonymous paste deleted");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete paste";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="account" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Account Pastes ({accountPastes.length})
            </TabsTrigger>
            <TabsTrigger value="vault" className="gap-2 text-xs">
              <KeyRound className="h-3.5 w-3.5 text-amber-400" />
              Local Vault / Anonymous ({vault.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
          <Link href="/new">
            <FilePlus className="h-4 w-4" />
            Create Paste
          </Link>
        </Button>
      </div>

      {/* Account Pastes Tab */}
      {tab === "account" && (
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-sm text-zinc-400">Loading your pastes...</p>
            </div>
          ) : accountPastes.length === 0 ? (
            <div className="text-center py-16 border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
              <FileText className="h-8 w-8 text-zinc-600 mx-auto" />
              <h3 className="text-base font-medium text-zinc-200">No public pastes created yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Any public pastes you create while signed in will appear here.
              </p>
              <Button asChild size="sm" className="mt-2 bg-violet-600 hover:bg-violet-700 text-white">
                <Link href="/new">Create a Paste</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              {accountPastes.map((p: PasteSummary) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/p/${p.id}`}
                      className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors flex items-center gap-1.5"
                    >
                      {p.title || "Untitled Paste"}
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">
                        {p.language || "text"}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {Number(p.viewCount).toLocaleString()} views
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs border-zinc-800 text-zinc-300">
                      <Link href={`/p/${p.id}/edit`}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccountPaste(p.id)}
                      className="h-8 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Local Vault Tab */}
      {tab === "vault" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-400">
            These pastes were created anonymously on this browser. Their management tokens are saved locally in your browser storage so you can still edit or delete them.
          </p>

          {vault.length === 0 ? (
            <div className="text-center py-16 border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
              <KeyRound className="h-8 w-8 text-zinc-600 mx-auto" />
              <h3 className="text-base font-medium text-zinc-200">Local vault is empty</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                When you create a paste without signing in, it is preserved here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              {vault.map((item: VaultPaste) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/p/${item.id}`}
                      className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors flex items-center gap-1.5"
                    >
                      {item.title || `Paste ${item.id}`}
                      <ExternalLink className="h-3 w-3 text-zinc-500" />
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-900/60 font-mono">
                        Token Saved
                      </Badge>
                      <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs border-zinc-800 text-zinc-300">
                      <Link href={`/p/${item.id}/edit?token=${encodeURIComponent(item.managementToken)}`}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVaultPaste(item)}
                      className="h-8 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
