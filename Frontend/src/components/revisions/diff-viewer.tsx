"use client";

import { useMemo } from "react";
import { GitCompare } from "lucide-react";

interface DiffViewerProps {
  diffText: string;
  fromRevision: number;
  toRevision: number;
  className?: string;
}

export function DiffViewer({
  diffText,
  fromRevision,
  toRevision,
  className = "",
}: DiffViewerProps) {
  const lines = useMemo(() => {
    if (!diffText) return [];
    return diffText.split("\n");
  }, [diffText]);

  return (
    <div className={`rounded-lg border border-white/10 bg-[#0f0f0f] overflow-hidden font-mono text-xs min-w-0 ${className}`}>
      {/* Diff Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-white/[0.02] border-b border-white/10">
        <div className="flex items-center gap-2 text-foreground font-sans font-medium text-xs sm:text-sm">
          <GitCompare className="h-4 w-4 text-muted shrink-0" />
          <span className="truncate">Comparing #{fromRevision} → #{toRevision}</span>
        </div>
        <span className="text-muted text-[11px] sm:text-xs font-mono shrink-0">Unified Diff</span>
      </div>

      {/* Diff Content */}
      <div className="overflow-x-auto p-2 max-h-[600px] divide-y divide-white/[0.03]">
        {lines.length === 0 ? (
          <div className="py-8 text-center text-muted font-sans">
            No changes detected between revisions.
          </div>
        ) : (
          lines.map((line, idx) => {
            const isAdd = line.startsWith("+") && !line.startsWith("+++");
            const isDel = line.startsWith("-") && !line.startsWith("---");
            const isHeader = line.startsWith("@@");
            const isMeta = line.startsWith("---") || line.startsWith("+++");

            let rowBg = "bg-transparent text-foreground/90";
            if (isAdd) {
              rowBg = "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15";
            } else if (isDel) {
              rowBg = "bg-red-500/10 text-red-300 hover:bg-red-500/15";
            } else if (isHeader) {
              rowBg = "bg-white/[0.04] text-foreground font-semibold";
            } else if (isMeta) {
              rowBg = "bg-white/[0.02] text-muted";
            }

            return (
              <div
                key={idx}
                className={`flex items-start px-3 py-0.5 rounded-sm transition-colors whitespace-pre font-mono ${rowBg}`}
              >
                <span className="w-8 shrink-0 select-none text-muted/60 text-right pr-3">
                  {idx + 1}
                </span>
                <span className="w-4 shrink-0 select-none font-bold">
                  {isAdd ? "+" : isDel ? "-" : " "}
                </span>
                <span className="flex-1 break-all">{line.slice(isAdd || isDel ? 1 : 0)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
