"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listAdminPastes, purgePaste } from "@/lib/api/admin";
import { AdminPasteView } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  Loader2,
  Calendar,
  HardDrive,
  FileCode,
  ExternalLink,
} from "lucide-react";

export function AdminPastesTable() {
  const [query, setQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const {
    data: pastes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-pastes", query, showDeleted],
    queryFn: () =>
      listAdminPastes({
        q: query.trim() || undefined,
        deleted: showDeleted,
      }),
  });

  const handlePurge = async (id: string) => {
    if (!confirm("HARD PURGE: This will permanently delete this paste and all its revisions from the database and storage. Proceed?")) return;
    try {
      setIsPurging(true);
      await purgePaste(id);
      toast.success(`Paste ${id} permanently purged`);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to purge paste";
      toast.error(msg);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pastes by title or author..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-foreground"
            />
            Show Deleted / Tombstones
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading pastes...</p>
        </div>
      ) : !pastes || pastes.length === 0 ? (
        <div className="text-center py-12 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
          No pastes found matching query.
        </div>
      ) : (
        <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          {pastes.map((p: AdminPasteView) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/p/${p.id}`}
                    className="text-sm font-semibold text-foreground hover:underline transition-colors flex items-center gap-1.5 truncate"
                  >
                    <span className="truncate">{p.title || `Paste ${p.id}`}</span>
                    <ExternalLink className="h-3 w-3 text-muted shrink-0" />
                  </Link>

                  <Badge variant="outline" className="font-mono text-[10px] border-white/10 bg-white/5">
                    <FileCode className="h-2.5 w-2.5 mr-1" />
                    {p.language || "text"}
                  </Badge>

                  <Badge variant="secondary" className="text-[10px] uppercase border-white/10 bg-white/5 text-muted">
                    {p.visibility}
                  </Badge>

                  {p.deletedAt && (
                    <Badge variant="destructive" className="text-[10px]">
                      Deleted
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span>Author: {p.authorUsername ? `@${p.authorUsername}` : "Anonymous"}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {p.contentSize} bytes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handlePurge(p.id)}
                  disabled={isPurging}
                  className="h-8 text-xs gap-1.5"
                  title="Permanently remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hard Purge
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
