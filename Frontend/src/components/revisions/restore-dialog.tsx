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
import { restoreRevision } from "@/lib/api/revisions";
import { toast } from "sonner";
import { RotateCcw, Loader2, AlertTriangle } from "lucide-react";

interface RestoreDialogProps {
  pasteId: string;
  revisionNo: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managementToken?: string;
  onRestored: () => void;
}

export function RestoreDialog({
  pasteId,
  revisionNo,
  open,
  onOpenChange,
  managementToken,
  onRestored,
}: RestoreDialogProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await restoreRevision(pasteId, revisionNo, managementToken);
      toast.success(`Successfully restored to Revision #${revisionNo}`);
      onOpenChange(false);
      onRestored();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to restore revision";
      toast.error(msg);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-zinc-100">Restore Revision #{revisionNo}?</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400 text-xs leading-relaxed pt-2">
            Restoring this revision will copy its contents and metadata to create a brand new latest revision.
            Your current revision history will remain intact.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
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
            type="button"
            size="sm"
            onClick={handleRestore}
            disabled={isRestoring}
            className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Confirm Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
