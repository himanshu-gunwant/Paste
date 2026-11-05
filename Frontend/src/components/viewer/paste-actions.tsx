"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "./share-dialog";
import { ReportDialog } from "./report-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { EmbedConfiguratorDialog } from "./embed-configurator-dialog";
import { PasteAnalyticsSheet } from "@/components/analytics/paste-analytics-sheet";
import { forkPaste, getDownloadPasteUrl, getRawPasteUrl } from "@/lib/api/pastes";
import { addBookmark, removeBookmark } from "@/lib/api/collections";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Copy,
  Check,
  FileCode,
  Download,
  GitFork,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  Flag,
  History,
  Loader2,
  Code2,
  BarChart2,
} from "lucide-react";

interface PasteActionsProps {
  pasteId: string;
  content?: string;
  isOwner?: boolean;
  canManage?: boolean;
  managementToken?: string;
  shareToken?: string;
  isPrivate?: boolean;
  hasRevisions?: boolean;
}

export function PasteActions({
  pasteId,
  content = "",
  canManage = false,
  managementToken,
  shareToken,
  isPrivate = false,
}: PasteActionsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isForking, setIsForking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Dialog states
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Content copied to clipboard");
  };

  const handleFork = async () => {
    try {
      setIsForking(true);
      const res = await forkPaste(pasteId, { shareToken });
      toast.success("Paste forked!");
      router.push(`/p/${res.paste.id}`);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to fork paste";
      toast.error(msg);
    } finally {
      setIsForking(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to bookmark pastes");
      return;
    }
    try {
      setIsBookmarking(true);
      if (isBookmarked) {
        await removeBookmark(pasteId);
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await addBookmark(pasteId);
        setIsBookmarked(true);
        toast.success("Paste bookmarked");
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Bookmark action failed";
      toast.error(msg);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Copy */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>

        {/* Raw */}
        <a
          href={getRawPasteUrl(pasteId, shareToken)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Raw</span>
          </Button>
        </a>

        {/* Download */}
        <a href={getDownloadPasteUrl(pasteId, shareToken)} download>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </a>

        {/* Fork */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFork}
          disabled={isForking}
          className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted"
        >
          {isForking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GitFork className="h-3.5 w-3.5" />}
          <span>Fork</span>
        </Button>

        {/* Share */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </Button>

        {/* Bookmark */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBookmarkToggle}
          disabled={isBookmarking}
          className={`h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted ${
            isBookmarked ? "text-amber-400 border-amber-500/30" : ""
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
          <span>{isBookmarked ? "Saved" : "Bookmark"}</span>
        </Button>

        {/* Revisions link */}
        <Link href={`/p/${pasteId}/revisions`}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <History className="h-3.5 w-3.5" />
            <span>History</span>
          </Button>
        </Link>

        {/* Embed code dialog */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEmbedOpen(true)}
          className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <Code2 className="h-3.5 w-3.5 text-violet-400" />
          <span>Embed</span>
        </Button>

        {/* Analytics stats if owner/canManage */}
        {canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnalyticsOpen(true)}
            className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Stats</span>
          </Button>
        )}

        {/* Manage: Edit & Delete if owner or has managementToken */}
        {canManage && (
          <>
            <Link href={`/p/${pasteId}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-muted text-purple-300"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="h-8 text-xs gap-1.5 border-border bg-subtle hover:bg-red-500/10 text-red-400 hover:text-red-300 border-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </>
        )}

        {/* Report */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReportOpen(true)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
          title="Report abuse"
        >
          <Flag className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ShareDialog
        pasteId={pasteId}
        open={shareOpen}
        onOpenChange={setShareOpen}
        isPrivate={isPrivate}
      />

      <ReportDialog
        pasteId={pasteId}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />

      <DeleteConfirmDialog
        pasteId={pasteId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        managementToken={managementToken}
      />

      <EmbedConfiguratorDialog
        pasteId={pasteId}
        open={embedOpen}
        onOpenChange={setEmbedOpen}
      />

      <PasteAnalyticsSheet
        pasteId={pasteId}
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
      />
    </>
  );
}
