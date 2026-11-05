"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCollection } from "@/lib/api/collections";
import { Visibility } from "@/types/paste";
import { toast } from "sonner";
import { FolderPlus, Loader2, Globe, Link as LinkIcon, Lock } from "lucide-react";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateCollectionDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a collection title");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCollection({
        title: title.trim(),
        description: description.trim() || undefined,
        slug: slug.trim() || undefined,
        visibility,
      });

      toast.success("Collection created successfully");
      setTitle("");
      setDescription("");
      setSlug("");
      onOpenChange(false);
      onCreated();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create collection";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-violet-400">
              <FolderPlus className="h-5 w-5" />
              <DialogTitle className="text-zinc-100">Create New Collection</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-400 text-xs">
              Organize related snippets and scripts into a curated folder.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="col-title" className="text-xs text-zinc-300">
                Title <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="col-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dotfiles, Next.js Utilities, SQL Scripts"
                required
                className="bg-zinc-900 border-zinc-800 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="col-desc" className="text-xs text-zinc-300">
                Description
              </Label>
              <Textarea
                id="col-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this collection"
                rows={2}
                className="bg-zinc-900 border-zinc-800 text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="col-slug" className="text-xs text-zinc-300">
                Custom Slug
              </Label>
              <Input
                id="col-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="optional-custom-slug"
                className="bg-zinc-900 border-zinc-800 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Visibility</Label>
              <Select value={visibility} onValueChange={(val) => setVisibility(val as Visibility)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                  <SelectItem value="public">
                    <span className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-emerald-400" />
                      Public (Visible on your profile & explore)
                    </span>
                  </SelectItem>
                  <SelectItem value="unlisted">
                    <span className="flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-amber-400" />
                      Unlisted (Only accessible via direct link)
                    </span>
                  </SelectItem>
                  <SelectItem value="private">
                    <span className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-rose-400" />
                      Private (Only accessible by you)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !title.trim()}
              className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
