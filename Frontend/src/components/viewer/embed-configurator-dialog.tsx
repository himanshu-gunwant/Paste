"use client";

import { useState, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Code2, Copy, Check } from "lucide-react";

interface EmbedConfiguratorDialogProps {
  pasteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedConfiguratorDialog({
  pasteId,
  open,
  onOpenChange,
}: EmbedConfiguratorDialogProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlightLines, setHighlightLines] = useState("");
  const [copied, setCopied] = useState(false);
  const lineNumbersId = useId();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://paste.himanshugunwant.com";
  const params = new URLSearchParams();
  if (theme !== "dark") params.set("theme", theme);
  if (!showLineNumbers) params.set("lines", "false");
  if (highlightLines.trim()) params.set("highlight", highlightLines.trim());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const embedUrl = `${baseUrl}/embed/${pasteId}${queryString}`;
  const embedSnippet = `<iframe src="${embedUrl}" width="100%" height="350" frameborder="0" loading="lazy"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Embed HTML copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#141414] border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2 text-foreground">
            <Code2 className="h-5 w-5 text-muted" />
            <DialogTitle className="text-foreground">Embed Paste</DialogTitle>
          </div>
          <DialogDescription className="text-muted text-xs">
            Embed this paste into your blog, documentation, or developer portal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground/90">Theme</Label>
              <Select value={theme} onValueChange={(val) => setTheme(val as "dark" | "light")}>
                <SelectTrigger className="bg-white/[0.03] border-white/10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-white/10 text-foreground">
                  <SelectItem value="dark">Dark Theme</SelectItem>
                  <SelectItem value="light">Light Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="embed-hl" className="text-xs text-foreground/90">Highlight Lines</Label>
              <Input
                id="embed-hl"
                value={highlightLines}
                onChange={(e) => setHighlightLines(e.target.value)}
                placeholder="e.g. 1-4,8"
                className="bg-white/[0.03] border-white/10 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id={lineNumbersId}
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer"
            />
            <Label htmlFor={lineNumbersId} className="text-xs text-muted cursor-pointer">
              Show line numbers
            </Label>
          </div>

          {/* Snippet box */}
          <div className="space-y-1.5 pt-2">
            <Label className="text-xs text-muted">HTML Embed Code</Label>
            <div className="relative">
              <textarea
                readOnly
                value={embedSnippet}
                rows={3}
                className="w-full p-2.5 font-mono text-xs rounded-md bg-white/[0.03] border border-white/10 text-foreground resize-none select-all focus:outline-none"
              />
              <Button
                size="sm"
                onClick={handleCopy}
                className="absolute right-2 bottom-3 h-7 text-xs gap-1.5 bg-foreground text-background hover:bg-white font-medium"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
