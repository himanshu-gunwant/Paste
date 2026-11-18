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
  Plus,
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
      {/* Tab Switcher & CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="account" className="gap-1.5 sm:gap-2 text-xs flex-1 sm:flex-initial">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>
                Account <span className="hidden xs:inline">Pastes</span> ({accountPastes.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="gap-1.5 sm:gap-2 text-xs flex-1 sm:flex-initial">
              <KeyRound className="h-3.5 w-3.5 shrink-0" />
              <span>
                <span className="hidden sm:inline">Local </span>Vault ({vault.length})
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button asChild size="sm" className="gap-1.5">
          <Link href="/new">
            <Plus className="h-4 w-4" />
            Create Paste
          </Link>
        </Button>
      </div>

      {/* Account Pastes Tab */}
      {tab === "account" && (
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
              <p className="text-sm text-muted">Loading your pastes...</p>
            </div>
          ) : accountPastes.length === 0 ? (
            <div className="text-center py-16 border border-white/10 rounded-lg bg-white/[0.02] p-8 space-y-3">
              <FileText className="h-8 w-8 text-muted/60 mx-auto" />
              <h3 className="text-base font-medium text-foreground">No public pastes created yet</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Any public pastes you create while signed in will appear here.
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/new">Create a Paste</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
              {accountPastes.map((p: PasteSummary) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/p/${p.id}`}
                      className="text-sm font-medium text-foreground hover:underline transition-colors flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{p.title || "Untitled Paste"}</span>
                      <ExternalLink className="h-3 w-3 text-muted shrink-0" />
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/5">
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
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/p/${p.id}/edit`}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccountPaste(p.id)}
                      className="h-8 text-xs text-muted hover:text-red-400 hover:bg-red-500/10"
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
          <p className="text-xs text-muted">
            These pastes were created anonymously on this browser. Their management tokens are saved locally in your browser storage so you can still edit or delete them.
          </p>

          {vault.length === 0 ? (
            <div className="text-center py-16 border border-white/10 rounded-lg bg-white/[0.02] p-8 space-y-3">
              <KeyRound className="h-8 w-8 text-muted/60 mx-auto" />
              <h3 className="text-base font-medium text-foreground">Local vault is empty</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                When you create a paste without signing in, it is preserved here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
              {vault.map((item: VaultPaste) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/p/${item.id}`}
                      className="text-sm font-medium text-foreground hover:underline transition-colors flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{item.title || `Paste ${item.id}`}</span>
                      <ExternalLink className="h-3 w-3 text-muted shrink-0" />
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 font-mono text-muted">
                        Token Saved
                      </Badge>
                      <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/p/${item.id}/edit?token=${encodeURIComponent(item.managementToken)}`}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVaultPaste(item)}
                      className="h-8 text-xs text-muted hover:text-red-400 hover:bg-red-500/10"
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
