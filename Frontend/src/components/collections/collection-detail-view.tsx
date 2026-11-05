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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-950/40 border border-violet-800/40 text-violet-400">
              <Folder className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              {collection.title}
            </h1>
            <div>
              {collection.visibility === "public" && (
                <Badge variant="secondary" className="gap-1 text-xs text-emerald-400">
                  <Globe className="h-3 w-3" /> Public
                </Badge>
              )}
              {collection.visibility === "unlisted" && (
                <Badge variant="outline" className="gap-1 text-xs text-amber-400 border-amber-900">
                  <LinkIcon className="h-3 w-3" /> Unlisted
                </Badge>
              )}
              {collection.visibility === "private" && (
                <Badge variant="outline" className="gap-1 text-xs text-rose-400 border-rose-900">
                  <Lock className="h-3 w-3" /> Private
                </Badge>
              )}
            </div>
          </div>

          {collection.description && (
            <p className="text-sm text-zinc-400 max-w-2xl pt-1 leading-relaxed">
              {collection.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
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
              className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Paste
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="border-zinc-800 text-zinc-300"
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
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Pastes in Collection
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16 border border-zinc-800/80 rounded-xl bg-zinc-950/40 p-8 space-y-3">
            <p className="text-sm text-zinc-400">No pastes have been added to this collection yet.</p>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddPasteOpen(true)}
                className="border-zinc-800 text-zinc-300"
              >
                Add Your First Paste
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
            {items.map((item: CollectionItem, idx: number) => {
              if (item.restricted || !item.paste) {
                return (
                  <div key={idx} className="flex items-center justify-between p-4 text-xs text-zinc-500 italic">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-zinc-600" />
                      [Private or deleted paste]
                    </span>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePaste(item.paste?.id || "")}
                        className="text-zinc-500 hover:text-rose-400 h-7"
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
                  className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Reorder Buttons (owner only) */}
                    {isOwner && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0 || isReordering}
                          className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === items.length - 1 || isReordering}
                          className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Link
                        href={`/p/${paste.id}`}
                        className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors flex items-center gap-1.5"
                      >
                        {paste.title || "Untitled Paste"}
                        <ExternalLink className="h-3 w-3 text-zinc-500" />
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Badge variant="outline" className="text-[10px] font-mono border-zinc-800">
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
                      className="text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 h-8"
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
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <form onSubmit={handleAddPaste}>
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Add Paste to Collection</DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs">
                Enter the paste ID or link to include it in this collection.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <Label htmlFor="paste-id-input" className="text-xs text-zinc-300">Paste ID</Label>
              <Input
                id="paste-id-input"
                value={pasteIdToAdd}
                onChange={(e) => setPasteIdToAdd(e.target.value)}
                placeholder="e.g. 7f9a1b2c or https://.../p/7f9a1b2c"
                className="bg-zinc-900 border-zinc-800 text-sm font-mono"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAddPasteOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isAddingPaste || !pasteIdToAdd.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isAddingPaste ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Collection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <form onSubmit={handleUpdateCollection}>
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Edit Collection</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Title</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Description</Label>
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUpdating}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Collection?</DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-2">
              Are you sure you want to delete &quot;{collection.title}&quot;? The pastes themselves will not be deleted, only the collection folder.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOpen(false)}
              className="text-zinc-400 hover:text-white"
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
