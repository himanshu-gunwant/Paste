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
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to view Collections</h2>
        <p className="text-sm text-muted">
          Collections allow you to group, organize, and share your developer pastes.
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Folder className="h-5 w-5 text-muted" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Collections</h1>
            <p className="text-xs text-muted">
              Curate and group your snippets into reusable workspaces.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5"
        >
          <FolderPlus className="h-4 w-4" />
          New Collection
        </Button>
      </div>

      {/* Grid of collections */}
      {isCollectionsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading collections...</p>
        </div>
      ) : !collections || collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-lg bg-white/[0.02] p-8 space-y-3">
          <Folder className="h-8 w-8 text-muted/60" />
          <h3 className="text-base font-medium text-foreground">No collections yet</h3>
          <p className="text-xs text-muted max-w-sm">
            Create your first collection to keep related configuration files, notes, and code snippets organized.
          </p>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="mt-2 gap-1.5"
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
