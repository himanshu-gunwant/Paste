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
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="p-3 rounded-full bg-zinc-800 text-zinc-400 inline-flex">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Sign in to view Bookmarks</h2>
        <p className="text-sm text-zinc-400">
          Save pastes to your bookmarks so you can quickly return to them at any time.
        </p>
        <div className="pt-2">
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 text-zinc-100">
          <Bookmark className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">Saved Bookmarks</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Quickly access reference scripts, code templates, and notes you have saved.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading bookmarks...</p>
        </div>
      ) : !bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
          <Bookmark className="h-8 w-8 text-zinc-600" />
          <h3 className="text-base font-medium text-zinc-200">No bookmarks saved yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            When browsing public pastes, click the Bookmark button to save them here for easy retrieval.
          </p>
          <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300">
            <Link href="/explore">Browse Public Pastes</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
          {bookmarks.map((bm: BookmarkItem) => (
            <div
              key={bm.pasteId}
              className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
            >
              <div className="space-y-1">
                <Link
                  href={`/p/${bm.pasteId}`}
                  className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors flex items-center gap-1.5"
                >
                  {bm.title || `Paste ${bm.pasteId}`}
                  <ExternalLink className="h-3 w-3 text-zinc-500" />
                </Link>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">
                    <FileCode className="h-2.5 w-2.5 mr-1 text-violet-400" />
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
                className="text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 h-8"
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
