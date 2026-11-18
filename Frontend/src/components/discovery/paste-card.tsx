"use client";

import Link from "next/link";
import { PasteSummary } from "@/types/paste";
import { Eye, User, Calendar } from "lucide-react";

interface PasteCardProps {
  paste: PasteSummary;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  } catch {
    return dateStr;
  }
}

export function PasteCard({ paste }: PasteCardProps) {
  const displayLang = paste.language || paste.detectedLanguage || "plaintext";
  const views = Number(paste.viewCount) || 0;

  return (
    <div className="group relative flex flex-col justify-between p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors focus-within:ring-1 focus-within:ring-white/30">
      <div className="space-y-2">
        {/* Header: Title and Language */}
        <div className="flex items-baseline justify-between gap-2 min-w-0">
          <Link
            href={`/p/${paste.id}`}
            className="font-medium text-foreground group-hover:text-white transition-colors truncate min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
          >
            <span>{paste.title || "Untitled Paste"}</span>
            <span className="inline-block ml-1 text-xs text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
          <span className="shrink-0 font-mono text-[11px] uppercase text-muted bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {displayLang}
          </span>
        </div>

        {/* Description snippet if available */}
        {paste.description ? (
          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {paste.description}
          </p>
        ) : (
          <p className="text-xs text-muted/70 font-mono italic">
            No description provided
          </p>
        )}
      </div>

      {/* Footer metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-white/5 text-xs text-muted font-mono">
        <div className="flex items-center gap-3">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 text-muted" />
            {paste.authorUsername ? (
              <Link
                href={`/u/${paste.authorUsername}`}
                className="text-muted hover:text-foreground hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{paste.authorUsername}
              </Link>
            ) : (
              <span className="italic text-muted/70">Anonymous</span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted" />
            <span>{formatRelativeTime(paste.createdAt)}</span>
          </div>
        </div>

        {/* View Count */}
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted" />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
