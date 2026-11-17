"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMe } from "@/lib/api/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
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
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export function DangerZone() {
  const router = useRouter();
  const { logout } = useAuth();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      await deleteMe(password.trim() || undefined);
      toast.success("Your account has been deleted");
      await logout();
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete account";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl pt-6 border-t border-white/10">
      <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-5 space-y-4">
        <div className="flex items-center gap-2.5 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-base font-semibold">Danger Zone</h3>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Once you delete your account, there is no going back. All of your public and private pastes, collections, bookmarks, and API keys will be immediately purged.
        </p>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleDelete}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <DialogTitle>Permanently Delete Account</DialogTitle>
              </div>
              <DialogDescription className="text-xs leading-relaxed pt-2">
                This action is irreversible. Enter your account password to confirm permanent deletion.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <Label htmlFor="del-pwd" className="text-xs text-muted">Account Password</Label>
              <Input
                id="del-pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Confirm your password"
                className="text-sm"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Forever"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
