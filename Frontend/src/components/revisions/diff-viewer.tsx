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
    <div className={`rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs ${className}`}>
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300 font-sans font-medium">
          <GitCompare className="h-4 w-4 text-violet-400" />
          <span>Comparing Revision #{fromRevision} → Revision #{toRevision}</span>
        </div>
        <span className="text-zinc-500 text-xs">Unified Diff</span>
      </div>

      {/* Diff Content */}
      <div className="overflow-x-auto p-2 max-h-[600px] divide-y divide-zinc-900/50">
        {lines.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 font-sans">
            No changes detected between revisions.
          </div>
        ) : (
          lines.map((line, idx) => {
            const isAdd = line.startsWith("+") && !line.startsWith("+++");
            const isDel = line.startsWith("-") && !line.startsWith("---");
            const isHeader = line.startsWith("@@");
            const isMeta = line.startsWith("---") || line.startsWith("+++");

            let rowBg = "bg-transparent text-zinc-300";
            if (isAdd) {
              rowBg = "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60";
            } else if (isDel) {
              rowBg = "bg-rose-950/40 text-rose-300 hover:bg-rose-950/60";
            } else if (isHeader) {
              rowBg = "bg-zinc-900 text-cyan-400 font-semibold";
            } else if (isMeta) {
              rowBg = "bg-zinc-900/80 text-zinc-500";
            }

            return (
              <div
                key={idx}
                className={`flex items-start px-3 py-0.5 rounded-sm transition-colors whitespace-pre font-mono ${rowBg}`}
              >
                <span className="w-8 shrink-0 select-none text-zinc-600 text-right pr-3">
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
