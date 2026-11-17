"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listBookmarks, removeBookmark } from "@/lib/api/collections";
import { useAuth } from "@/hooks/use-auth";
import { BookmarkItem } from "@/types/collection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bookmark,
  Trash2,
  Loader2,
  FileCode,
  Calendar,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function BookmarksPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: bookmarks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: () => listBookmarks(),
    enabled: isAuthenticated,
  });

  const handleRemove = async (pasteId: string) => {
    try {
      await removeBookmark(pasteId);
      toast.success("Bookmark removed");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to remove bookmark";
      toast.error(msg);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 animate-enter">
        <div className="p-3 rounded-full border border-white/10 bg-white/5 text-muted inline-flex">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to view Bookmarks</h2>
        <p className="text-sm text-muted">
          Save pastes to your bookmarks so you can quickly return to them at any time.
        </p>
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 text-foreground">
          <Bookmark className="h-5 w-5 text-muted" />
          <h1 className="text-2xl font-bold tracking-tight">Saved Bookmarks</h1>
        </div>
        <p className="text-sm text-muted">
          Quickly access reference scripts, code templates, and notes you have saved.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading bookmarks...</p>
        </div>
      ) : !bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-lg bg-white/[0.02] p-8 space-y-3">
          <Bookmark className="h-8 w-8 text-muted/60" />
          <h3 className="text-base font-medium text-foreground">No bookmarks saved yet</h3>
          <p className="text-xs text-muted max-w-sm">
            When browsing public pastes, click the Bookmark button to save them here for easy retrieval.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/explore">Browse Public Pastes</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          {bookmarks.map((bm: BookmarkItem) => (
            <div
              key={bm.pasteId}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
            >
              <div className="space-y-1">
                <Link
                  href={`/p/${bm.pasteId}`}
                  className="text-sm font-medium text-foreground hover:underline transition-colors flex items-center gap-1.5"
                >
                  {bm.title || `Paste ${bm.pasteId}`}
                  <ExternalLink className="h-3 w-3 text-muted" />
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/5">
                    <FileCode className="h-2.5 w-2.5 mr-1 text-muted" />
                    {bm.language || "text"}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Saved {new Date(bm.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(bm.pasteId)}
                className="text-muted hover:text-red-400 hover:bg-red-500/10 h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
