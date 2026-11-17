"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PasteView } from "@/types/paste";
import {
  Calendar,
  Clock,
  Eye,
  GitFork,
  HardDrive,
  Lock,
  Globe,
  Link as LinkIcon,
  User,
  FileCode,
} from "lucide-react";

interface PasteHeaderProps {
  paste: PasteView;
  lineCount?: number;
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

function formatExpiryTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (diffInSeconds <= 0) return "Expired";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `expires in ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `expires in ${hours}h`;
    const days = Math.floor(hours / 24);
    return `expires in ${days}d`;
  } catch {
    return "Expires soon";
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PasteHeader({ paste, lineCount }: PasteHeaderProps) {
  const displayLang = paste.language || paste.detectedLanguage || "plaintext";

  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-white/10 animate-enter delay-1">
      {/* Title & Visibility */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {paste.title || "Untitled Paste"}
          </h1>
          <div className="flex items-center gap-1.5">
            {paste.visibility === "public" && (
              <Badge variant="emerald" className="gap-1 text-xs">
                <Globe className="h-3 w-3" />
                Public
              </Badge>
            )}
            {paste.visibility === "unlisted" && (
              <Badge variant="amber" className="gap-1 text-xs">
                <LinkIcon className="h-3 w-3" />
                Unlisted
              </Badge>
            )}
            {paste.visibility === "private" && (
              <Badge variant="destructive" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
            {paste.burnAfterRead && (
              <Badge variant="destructive" className="gap-1 text-xs">
                Burn on read
              </Badge>
            )}
          </div>
        </div>

        {/* Language Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs uppercase bg-white/5 border-white/10 text-muted">
            <FileCode className="h-3 w-3 mr-1 text-muted" />
            {displayLang}
          </Badge>
        </div>
      </div>

      {/* Description if present */}
      {paste.description && (
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          {paste.description}
        </p>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        {/* Author */}
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted" />
          {paste.author?.username ? (
            <Link
              href={`/u/${paste.author.username}`}
              className="text-foreground hover:text-white transition-colors"
            >
              @{paste.author.username}
            </Link>
          ) : (
            <span className="text-muted italic">Anonymous</span>
          )}
        </div>

        {/* Created date */}
        <div className="flex items-center gap-1.5 font-mono" title={new Date(paste.createdAt).toLocaleString()}>
          <Calendar className="h-3.5 w-3.5 text-muted" />
          <span>{formatRelativeTime(paste.createdAt)}</span>
        </div>

        {/* Expiration date */}
        {paste.expiresAt && (
          <div className="flex items-center gap-1.5 text-amber-300 font-mono" title={new Date(paste.expiresAt).toLocaleString()}>
            <Clock className="h-3.5 w-3.5" />
            <span>{formatExpiryTime(paste.expiresAt)}</span>
          </div>
        )}

        {/* Forked of */}
        {paste.forkOfId && (
          <div className="flex items-center gap-1.5">
            <GitFork className="h-3.5 w-3.5 text-muted" />
            <span>Forked from</span>
            <Link
              href={`/p/${paste.forkOfId}`}
              className="text-foreground hover:underline font-mono"
            >
              p/{paste.forkOfId}
            </Link>
          </div>
        )}

        {/* Content size & lines */}
        <div className="flex items-center gap-1.5 text-muted font-mono">
          <HardDrive className="h-3.5 w-3.5 text-muted" />
          <span>{formatBytes(paste.contentSize)}</span>
          {typeof lineCount === "number" && (
            <span>· {lineCount} {lineCount === 1 ? "line" : "lines"}</span>
          )}
        </div>

        {/* View count if available */}
        {typeof paste.viewCount === "number" && (
          <div className="flex items-center gap-1.5 text-muted font-mono ml-auto">
            <Eye className="h-3.5 w-3.5 text-muted" />
            <span>
              {paste.viewCount.toLocaleString()} {paste.viewCount === 1 ? "view" : "views"}
              {paste.maxViews ? ` / ${paste.maxViews}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
