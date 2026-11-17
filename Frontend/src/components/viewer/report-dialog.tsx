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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAbuseReport } from "@/lib/api/pastes";
import { toast } from "sonner";
import { Flag, Loader2 } from "lucide-react";

interface ReportDialogProps {
  pasteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDialog({ pasteId, open, onOpenChange }: ReportDialogProps) {
  const [reason, setReason] = useState<"SPAM" | "MALWARE" | "HARASSMENT" | "COPYRIGHT" | "OTHER">("SPAM");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createAbuseReport({
        pasteId,
        reason,
        details: details.trim() || undefined,
      });
      toast.success("Abuse report submitted. Our moderation team will review it.");
      onOpenChange(false);
      setDetails("");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to submit report";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#141414]">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
            <Flag className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-foreground">Report Paste</DialogTitle>
          <DialogDescription className="text-xs text-muted">
            Report terms of service violations, malware, spam, harassment, or copyright infringement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-reason" className="text-xs text-foreground/90">Reason</Label>
            <Select value={reason} onValueChange={(val) => setReason(val as typeof reason)}>
              <SelectTrigger id="report-reason" className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPAM">Spam or Unsolicited Ads</SelectItem>
                <SelectItem value="MALWARE">Malware, Phishing, or Exploit Code</SelectItem>
                <SelectItem value="HARASSMENT">Harassment or Doxxing</SelectItem>
                <SelectItem value="COPYRIGHT">Copyright Infringement</SelectItem>
                <SelectItem value="OTHER">Other Terms Violation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-details" className="text-xs text-foreground/90">Details (optional)</Label>
            <Textarea
              id="report-details"
              placeholder="Provide additional context or links to assist review..."
              value={details}
              maxLength={4000}
              className="resize-none h-20 text-xs"
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-white/10 text-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Submit Report</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
