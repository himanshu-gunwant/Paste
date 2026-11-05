"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listOwnCollections } from "@/lib/api/collections";
import { useAuth } from "@/hooks/use-auth";
import { CollectionCard } from "@/components/collections/collection-card";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";
import { Button } from "@/components/ui/button";
import { Folder, FolderPlus, Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function CollectionsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: collections,
    isLoading: isCollectionsLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-collections"],
    queryFn: () => listOwnCollections(),
    enabled: isAuthenticated,
  });

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
        <h2 className="text-xl font-bold text-zinc-100">Sign in to view Collections</h2>
        <p className="text-sm text-zinc-400">
          Collections allow you to group, organize and share your pastes.
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <Folder className="h-6 w-6 text-violet-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">My Collections</h1>
            <p className="text-xs text-zinc-400">
              Curate and group your snippets into reusable workspaces.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <FolderPlus className="h-4 w-4" />
          New Collection
        </Button>
      </div>

      {/* Grid of collections */}
      {isCollectionsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading collections...</p>
        </div>
      ) : !collections || collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
          <Folder className="h-8 w-8 text-zinc-600" />
          <h3 className="text-base font-medium text-zinc-200">No collections yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Create your first collection to keep related configuration files, notes, and code snippets organized.
          </p>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="mt-2 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <FolderPlus className="h-4 w-4" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateCollectionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => refetch()}
      />
    </div>
  );
}
