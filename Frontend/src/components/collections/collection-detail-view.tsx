"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CollectionDetail, CollectionItem } from "@/types/collection";
import {
  addPasteToCollection,
  removePasteFromCollection,
  reorderCollection,
  deleteCollection,
  updateCollection,
} from "@/lib/api/collections";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Folder,
  Globe,
  Lock,
  Link as LinkIcon,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Loader2,
  FileCode,
  AlertCircle,
  ExternalLink,
  Edit2,
} from "lucide-react";

interface CollectionDetailViewProps {
  initialData: CollectionDetail;
  onRefresh: () => void;
}

export function CollectionDetailView({ initialData, onRefresh }: CollectionDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { collection, items } = initialData;

  const isOwner = Boolean(
    user?.username && collection.ownerUsername && user.username.toLowerCase() === collection.ownerUsername.toLowerCase()
  );

  // Dialog states
  const [addPasteOpen, setAddPasteOpen] = useState(false);
  const [pasteIdToAdd, setPasteIdToAdd] = useState("");
  const [isAddingPaste, setIsAddingPaste] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(collection.title);
  const [editDesc, setEditDesc] = useState(collection.description || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Reorder handling
  const [isReordering, setIsReordering] = useState(false);

  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      setIsReordering(true);
      const newItems = [...items];
      const temp = newItems[currentIndex];
      newItems[currentIndex] = newItems[targetIndex];
      newItems[targetIndex] = temp;

      const positions = newItems.map((item, idx) => ({
        pasteId: item.paste?.id || "",
        position: idx + 1,
      })).filter((p) => p.pasteId);

      await reorderCollection(collection.id, positions);
      onRefresh();
      toast.success("Order updated");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to reorder items";
      toast.error(msg);
    } finally {
      setIsReordering(false);
    }
  };

  const handleAddPaste = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = pasteIdToAdd.trim().replace(/^.*\/p\//, "");
    if (!cleanId) {
      toast.error("Please enter a valid paste ID or URL");
      return;
    }

    try {
      setIsAddingPaste(true);
      await addPasteToCollection(collection.id, cleanId);
      toast.success("Paste added to collection");
      setPasteIdToAdd("");
      setAddPasteOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to add paste";
      toast.error(msg);
    } finally {
      setIsAddingPaste(false);
    }
  };

  const handleRemovePaste = async (pasteId: string) => {
    try {
      await removePasteFromCollection(collection.id, pasteId);
      toast.success("Paste removed from collection");
      onRefresh();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to remove paste";
      toast.error(msg);
    }
  };

  const handleDeleteCollection = async () => {
    try {
      setIsDeleting(true);
      await deleteCollection(collection.id);
      toast.success("Collection deleted");
      router.push("/collections");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete collection";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateCollection(collection.id, {
        title: editTitle.trim(),
        description: editDesc.trim() || null,
      });
      toast.success("Collection updated");
      setEditOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to update collection";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collection Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 rounded-md bg-white/5 border border-white/10 text-muted">
              <Folder className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {collection.title}
            </h1>
            <div>
              {collection.visibility === "public" && (
                <Badge variant="secondary" className="gap-1 text-xs border-white/10 bg-white/5 text-muted">
                  <Globe className="h-3 w-3" /> Public
                </Badge>
              )}
              {collection.visibility === "unlisted" && (
                <Badge variant="outline" className="gap-1 text-xs border-white/10 bg-white/5 text-muted">
                  <LinkIcon className="h-3 w-3" /> Unlisted
                </Badge>
              )}
              {collection.visibility === "private" && (
                <Badge variant="outline" className="gap-1 text-xs border-white/10 bg-white/5 text-muted">
                  <Lock className="h-3 w-3" /> Private
                </Badge>
              )}
            </div>
          </div>

          {collection.description && (
            <p className="text-sm text-muted max-w-2xl pt-1 leading-relaxed">
              {collection.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted pt-1">
            <span>Curated by @{collection.ownerUsername}</span>
            <span>·</span>
            <span>{items.length} {items.length === 1 ? "paste" : "pastes"}</span>
          </div>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setAddPasteOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Paste
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Pastes in Collection
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16 border border-white/10 rounded-lg bg-white/[0.02] p-8 space-y-3">
            <p className="text-sm text-muted">No pastes have been added to this collection yet.</p>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddPasteOpen(true)}
              >
                Add Your First Paste
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
            {items.map((item: CollectionItem, idx: number) => {
              if (item.restricted || !item.paste) {
                return (
                  <div key={idx} className="flex items-center justify-between p-4 text-xs text-muted italic">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted/60" />
                      [Private or deleted paste]
                    </span>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePaste(item.paste?.id || "")}
                        className="text-muted hover:text-red-400 h-7"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                );
              }

              const paste = item.paste;

              return (
                <div
                  key={paste.id}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Reorder Buttons (owner only) */}
                    {isOwner && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0 || isReordering}
                          className="p-1 text-muted hover:text-foreground disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === items.length - 1 || isReordering}
                          className="p-1 text-muted hover:text-foreground disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Link
                        href={`/p/${paste.id}`}
                        className="text-sm font-medium text-foreground hover:underline transition-colors flex items-center gap-1.5"
                      >
                        {paste.title || "Untitled Paste"}
                        <ExternalLink className="h-3 w-3 text-muted" />
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-white/5">
                          <FileCode className="h-2.5 w-2.5 mr-1" />
                          {paste.language || "text"}
                        </Badge>
                        {paste.author?.username && (
                          <span>by @{paste.author.username}</span>
                        )}
                        <span>· added {new Date(item.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePaste(paste.id)}
                      className="text-muted hover:text-red-400 hover:bg-red-500/10 h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Paste Dialog */}
      <Dialog open={addPasteOpen} onOpenChange={setAddPasteOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddPaste}>
            <DialogHeader>
              <DialogTitle>Add Paste to Collection</DialogTitle>
              <DialogDescription>
                Enter the paste ID or link to include it in this collection.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <Label htmlFor="paste-id-input" className="text-xs text-muted">Paste ID</Label>
              <Input
                id="paste-id-input"
                value={pasteIdToAdd}
                onChange={(e) => setPasteIdToAdd(e.target.value)}
                placeholder="e.g. 7f9a1b2c or https://.../p/7f9a1b2c"
                className="text-sm font-mono"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAddPasteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isAddingPaste || !pasteIdToAdd.trim()}
              >
                {isAddingPaste ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUpdateCollection}>
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted">Title</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted">Description</Label>
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Collection?</DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Are you sure you want to delete &quot;{collection.title}&quot;? The pastes themselves will not be deleted, only the collection folder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteCollection}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
