"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listRevisions, getRevision, diffRevisions } from "@/lib/api/revisions";
import { RevisionMetadata } from "@/types/paste";
import { DiffViewer } from "./diff-viewer";
import { RestoreDialog } from "./restore-dialog";
import { CodeEditor } from "@/components/editor/code-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  History,
  GitCompare,
  RotateCcw,
  Eye,
  Loader2,
  Calendar,
  HardDrive,
  FileCode,
} from "lucide-react";

interface RevisionTimelineProps {
  pasteId: string;
  shareToken?: string;
  managementToken?: string;
  canManage?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function RevisionTimeline({
  pasteId,
  shareToken,
  managementToken,
  canManage = false,
}: RevisionTimelineProps) {
  const [selectedRevisionNo, setSelectedRevisionNo] = useState<number | null>(null);
  const [diffFromNo, setDiffFromNo] = useState<number | null>(null);
  const [diffToNo, setDiffToNo] = useState<number | null>(null);
  const [restoreRevisionNo, setRestoreRevisionNo] = useState<number | null>(null);

  // Fetch revisions list
  const {
    data: revisionsData,
    isLoading: isLoadingList,
    refetch,
  } = useQuery({
    queryKey: ["revisions", pasteId, shareToken],
    queryFn: () => listRevisions(pasteId, { shareToken }),
  });

  const revisions = revisionsData?.data || [];
  const latestNo = revisionsData?.latestRevisionNo || (revisions[0]?.revisionNo ?? 1);

  // Fetch single snapshot when viewing snapshot
  const { data: snapshotData, isLoading: isLoadingSnapshot } = useQuery({
    queryKey: ["revision-snapshot", pasteId, selectedRevisionNo, shareToken],
    queryFn: () =>
      selectedRevisionNo
        ? getRevision(pasteId, selectedRevisionNo, { shareToken })
        : null,
    enabled: selectedRevisionNo !== null && diffFromNo === null,
  });

  // Fetch diff when comparing
  const { data: diffData, isLoading: isLoadingDiff } = useQuery({
    queryKey: ["revision-diff", pasteId, diffFromNo, diffToNo, shareToken],
    queryFn: () =>
      diffFromNo !== null && diffToNo !== null
        ? diffRevisions(pasteId, diffFromNo, diffToNo, { shareToken })
        : null,
    enabled: diffFromNo !== null && diffToNo !== null,
  });

  const handleSelectSnapshot = (no: number) => {
    setDiffFromNo(null);
    setDiffToNo(null);
    setSelectedRevisionNo(no);
  };

  const handleCompare = (from: number, to: number) => {
    setSelectedRevisionNo(null);
    setDiffFromNo(from);
    setDiffToNo(to);
  };

  if (isLoadingList) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
        <p className="text-sm text-muted">Loading revision history...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Timeline List on the left */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <History className="h-4 w-4 text-muted" />
            <span>Revisions ({revisions.length})</span>
          </div>
          <span className="text-xs text-muted font-mono">v{latestNo}</span>
        </div>

        {revisions.length === 0 ? (
          <p className="text-xs text-muted py-4">No revisions recorded.</p>
        ) : (
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {revisions.map((rev: RevisionMetadata, idx) => {
              const isCurrent = rev.revisionNo === latestNo;
              const isSelected = selectedRevisionNo === rev.revisionNo;
              const prevRev = revisions[idx + 1];

              return (
                <div
                  key={rev.revisionNo}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-white/[0.05] border-white/30"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        #{rev.revisionNo}
                      </span>
                      {isCurrent && (
                        <Badge variant="emerald" className="text-[10px]">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-muted border-white/10">
                      <FileCode className="h-2.5 w-2.5 mr-1" />
                      {rev.language || "text"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-muted font-mono mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted/60" />
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3 text-muted/60" />
                      {formatBytes(rev.contentSize)}
                    </span>
                  </div>

                  {/* Actions for this revision */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectSnapshot(rev.revisionNo)}
                      className="h-7 text-xs px-2 text-muted hover:text-foreground hover:bg-white/5"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>

                    {prevRev && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompare(prevRev.revisionNo, rev.revisionNo)}
                        className="h-7 text-xs px-2 text-muted hover:text-foreground hover:bg-white/5"
                      >
                        <GitCompare className="h-3 w-3 mr-1" />
                        Diff #{prevRev.revisionNo}
                      </Button>
                    )}

                    {canManage && !isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRestoreRevisionNo(rev.revisionNo)}
                        className="h-7 text-xs px-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 ml-auto"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area: Snapshot viewer or Diff viewer */}
      <div className="lg:col-span-8">
        {diffFromNo !== null && diffToNo !== null ? (
          <div>
            {isLoadingDiff ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border border-white/10 rounded-lg bg-[#0f0f0f]">
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
                <p className="text-xs text-muted">Computing diff...</p>
              </div>
            ) : diffData ? (
              <DiffViewer
                diffText={diffData.diff}
                fromRevision={diffFromNo}
                toRevision={diffToNo}
              />
            ) : (
              <div className="p-8 border border-white/10 rounded-lg bg-[#0f0f0f] text-center text-muted text-sm">
                No diff data available.
              </div>
            )}
          </div>
        ) : selectedRevisionNo !== null ? (
          <div>
            {isLoadingSnapshot ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 border border-white/10 rounded-lg bg-[#0f0f0f]">
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
                <p className="text-xs text-muted">Loading snapshot #{selectedRevisionNo}...</p>
              </div>
            ) : snapshotData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] rounded-t-lg border border-white/10">
                  <span className="font-medium text-sm text-foreground">
                    Snapshot of Revision #{snapshotData.revisionNo}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs border-white/10 text-muted">
                    {snapshotData.language || "plaintext"}
                  </Badge>
                </div>
                <div className="rounded-b-lg border-x border-b border-white/10 bg-[#0f0f0f] overflow-hidden">
                  <CodeEditor
                    value={snapshotData.content}
                    language={snapshotData.language || "plaintext"}
                    readOnly={true}
                    autoFocus={false}
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 border border-white/10 rounded-lg bg-[#0f0f0f] text-center text-muted text-sm">
                Select a revision to view snapshot.
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-white/[0.02] border-white/10 p-8 text-center rounded-xl">
            <CardContent className="pt-6 space-y-2">
              <History className="h-8 w-8 text-muted/50 mx-auto" />
              <h3 className="text-sm font-semibold text-foreground">Select a revision</h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Choose any snapshot from the revision timeline to preview the code at that point in time,
                or compare differences between versions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Restore confirmation dialog */}
      {restoreRevisionNo !== null && (
        <RestoreDialog
          pasteId={pasteId}
          revisionNo={restoreRevisionNo}
          open={restoreRevisionNo !== null}
          onOpenChange={(open) => !open && setRestoreRevisionNo(null)}
          managementToken={managementToken}
          onRestored={() => {
            refetch();
            setSelectedRevisionNo(null);
            setDiffFromNo(null);
            setDiffToNo(null);
          }}
        />
      )}
    </div>
  );
}
