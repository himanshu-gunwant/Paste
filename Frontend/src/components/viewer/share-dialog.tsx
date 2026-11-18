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
import { Label } from "@/components/ui/label";
import { createShareToken } from "@/lib/api/pastes";
import { toast } from "sonner";
import { Share2, Copy, Check, Loader2, Link2 } from "lucide-react";

interface ShareDialogProps {
  pasteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPrivate?: boolean;
}

export function ShareDialog({ pasteId, open, onOpenChange, isPrivate }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await createShareToken(pasteId, {
        maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/p/${pasteId}?share_token=${res.token}`;
      setShareUrl(url);
      toast.success("Share token created");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create share token";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const url = shareUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/p/${pasteId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#141414]">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-foreground mb-2">
            <Share2 className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-foreground">Share Paste</DialogTitle>
          <DialogDescription className="text-xs text-muted">
            {isPrivate
              ? "This paste is PRIVATE. Generate a share token to grant access to anyone with the link."
              : "Share this paste with collaborators or embed it in other sites."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Quick link copy for public/unlisted */}
          {!isPrivate && (
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/90">Public Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/p/${pasteId}`}
                  className="font-mono text-xs bg-white/[0.03] border-white/10 select-all text-foreground"
                />
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 shrink-0 border-white/10 bg-white/5 hover:bg-white/10 text-foreground">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Secure share token generator */}
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted" />
              <span className="text-xs font-semibold text-foreground">
                {isPrivate ? "Generate Access Token" : "Create Scoped Share Link"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="share-max-uses" className="text-[11px] text-muted">Max Uses (optional)</Label>
                <Input
                  id="share-max-uses"
                  type="number"
                  placeholder="e.g. 5"
                  value={maxUses}
                  min={1}
                  max={10000}
                  className="h-8 text-xs bg-white/[0.03] border-white/10"
                  onChange={(e) => setMaxUses(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="share-expiry" className="text-[11px] text-muted">Expires At (optional)</Label>
                <Input
                  id="share-expiry"
                  type="datetime-local"
                  value={expiresAt}
                  className="h-8 text-xs bg-white/[0.03] border-white/10"
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full text-xs gap-1.5 h-8 border-white/10 bg-white/5 hover:bg-white/10 text-foreground"
            >
              {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>Generate Share Token</span>
            </Button>

            {shareUrl && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <Label className="text-[11px] text-emerald-400">Authorized Share URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    className="font-mono text-[11px] bg-white/[0.03] border-white/10 text-foreground select-all h-8"
                  />
                  <Button size="sm" onClick={handleCopy} className="gap-1 h-8 px-2.5 text-xs shrink-0 bg-foreground text-background hover:bg-white font-medium">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs text-muted hover:text-foreground">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
