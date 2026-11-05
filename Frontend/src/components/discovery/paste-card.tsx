"use client";

import Link from "next/link";
import { PasteSummary } from "@/types/paste";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Calendar, FileCode } from "lucide-react";

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
    <div className="group relative flex flex-col justify-between p-4 rounded-lg border border-zinc-800/80 bg-zinc-950/70 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all">
      <div className="space-y-2.5">
        {/* Header: Title and Language */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/p/${paste.id}`}
            className="text-base font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors line-clamp-1"
          >
            {paste.title || "Untitled Paste"}
          </Link>
          <Badge
            variant="outline"
            className="shrink-0 font-mono text-[11px] uppercase bg-zinc-900/90 border-zinc-700 text-zinc-300"
          >
            <FileCode className="h-3 w-3 mr-1 text-violet-400" />
            {displayLang}
          </Badge>
        </div>

        {/* Description snippet if available */}
        {paste.description ? (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {paste.description}
          </p>
        ) : (
          <p className="text-xs text-zinc-600 font-mono italic">
            No description provided
          </p>
        )}
      </div>

      {/* Footer metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-3 border-t border-zinc-900 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {paste.authorUsername ? (
              <Link
                href={`/u/${paste.authorUsername}`}
                className="text-zinc-400 hover:text-zinc-200 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{paste.authorUsername}
              </Link>
            ) : (
              <span className="italic text-zinc-500">Anonymous</span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatRelativeTime(paste.createdAt)}</span>
          </div>
        </div>

        {/* View Count */}
        <div className="flex items-center gap-1 text-zinc-400">
          <Eye className="h-3.5 w-3.5" />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
