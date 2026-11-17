"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deletePaste } from "@/lib/api/pastes";
import { usePasteVault } from "@/hooks/use-paste-vault";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  pasteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managementToken?: string;
}

export function DeleteConfirmDialog({
  pasteId,
  open,
  onOpenChange,
  managementToken,
}: DeleteConfirmDialogProps) {
  const router = useRouter();
  const { removePaste } = usePasteVault();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePaste(pasteId, managementToken);
      removePaste(pasteId);
      toast.success("Paste deleted successfully");
      onOpenChange(false);
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete paste";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#141414]">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
            <Trash2 className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-foreground">Delete Paste</DialogTitle>
          <DialogDescription className="text-xs text-muted">
            Are you sure you want to delete this paste? The content will be immediately tombstoned and scheduled
            for physical purge. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2.5 rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <span>Any shared links or embeds for this paste will immediately stop working.</span>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-xs border-white/10 text-muted hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs gap-1.5"
          >
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Permanently Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
